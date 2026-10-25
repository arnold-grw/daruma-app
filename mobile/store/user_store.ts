import { create } from "zustand";
import { UserRepository } from "../repositories/user_repository";
import { User } from "../types/user";
import { createUser, isUserEditable } from "@/domain/user_domain";

const repo = new UserRepository();

// ids of the test users "Max" and "Anna" that were written to storage on first launch
const LEGACY_SEED_USER_IDS = [
  "00000000-0000-0000-0000-000000000000",
  "11111111-1111-1111-1111-111111111111",
];

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
    const stored = await repo.getAll();

    // earlier versions seeded test users into storage, drop them
    let users = stored.filter((user) => !LEGACY_SEED_USER_IDS.includes(user.id));
    let changed = users.length !== stored.length;

    // users saved before completedDarumaCount existed start at 0
    if (users.some((user) => user.completedDarumaCount == null)) {
      users = users.map((user) => ({ ...user, completedDarumaCount: user.completedDarumaCount ?? 0 }));
      changed = true;
    }

    // first launch: create the local user (the name gets set in the onboarding later)
    if (!users.length) {
      users = [createUser({ name: "" })];
      changed = true;
    }

    if (changed) {
      await repo.saveAll(users);
    }

    const storedActiveUserId = await repo.getActiveUserId();
    const activeUser = users.find((user) => user.id === storedActiveUserId) ?? users[0];

    if (activeUser.id !== storedActiveUserId) {
      await repo.setActiveUserId(activeUser.id);
    }

    set({ users, activeUserId: activeUser.id, activeUser });
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
export const useCompletedDarumaCount = () => useUserStore((state) => state.activeUser?.completedDarumaCount ?? 0);
export const useOtherUsers = () =>
  useUserStore((state) => state.users.filter((user) => user.id !== state.activeUserId));
