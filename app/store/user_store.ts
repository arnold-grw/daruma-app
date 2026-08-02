import { create } from "zustand";
import { UserRepository } from "../repositories/user_repository";
import { User } from "../types/user";
import { createUser, isUserEditable } from "@/domain/user_domain";
import { TEST_USER } from "@/constants/test_data";

const repo = new UserRepository();

interface UserState {
  users: User[];
  activeUserId: string | null;
  activeUser: User | null;

  load: () => Promise<void>;
  setActiveUser: (userId: string) => Promise<void>;
  addUser: (user: User) => Promise<void>;
  updateCurrentUser: (updates: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  activeUserId: null,
  activeUser: null,

  load: async () => {
    const users = await repo.getAll();

    if (!users.length) {
      const seededUser = createUser({ ...TEST_USER, id: TEST_USER.id });
      const readOnlyUser = createUser({
        ...TEST_USER,
        id: "11111111-1111-1111-1111-111111111111",
        name: "Anna",
        email: "anna@example.com",
        languagePreference: "de",
      });
      const seededUsers = [seededUser, readOnlyUser];

      await repo.saveAll(seededUsers);
      await repo.setActiveUserId(seededUser.id);

      set({ users: seededUsers, activeUserId: seededUser.id, activeUser: seededUser });
      return;
    }

    const activeUserId = (await repo.getActiveUserId()) ?? users[0]?.id ?? null;
    const activeUser = users.find((user) => user.id === activeUserId) ?? users[0] ?? null;

    if (activeUser && !activeUserId) {
      await repo.setActiveUserId(activeUser.id);
    }

    set({ users, activeUserId: activeUser?.id ?? null, activeUser });
  },

  setActiveUser: async (userId: string) => {
    const { users } = get();
    const user = users.find((entry) => entry.id === userId);

    if (!user) {
      return;
    }

    await repo.setActiveUserId(user.id);
    set({ activeUserId: user.id, activeUser: user });
  },

  addUser: async (user: User) => {
    await repo.add(user);
    const users = await repo.getAll();
    set((state) => ({
      users,
      activeUserId: state.activeUserId ?? user.id,
      activeUser: state.activeUser ?? user,
    }));
  },

  updateCurrentUser: async (updates: Partial<User>) => {
    const { activeUserId, users } = get();

    if (!activeUserId) {
      return;
    }

    const currentUser = users.find((entry) => entry.id === activeUserId);
    if (!currentUser || !isUserEditable(currentUser, activeUserId)) {
      return;
    }

    const updatedUser = {
      ...currentUser,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedUsers = users.map((entry) => (entry.id === activeUserId ? updatedUser : entry));

    await repo.saveAll(updatedUsers);
    set({ users: updatedUsers, activeUser: updatedUser });
  },
}));

export const useActiveUser = () => useUserStore((state) => state.activeUser);
export const useOtherUsers = () =>
  useUserStore((state) => state.users.filter((user) => user.id !== state.activeUserId));
