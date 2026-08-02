import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/user";

const STORAGE_KEY = "users";
const ACTIVE_USER_KEY = "active-user-id";

export class UserRepository {
  async getAll(): Promise<User[]> {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? (JSON.parse(json) as User[]) : [];
  }

  async saveAll(users: User[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  async add(user: User): Promise<void> {
    const users = await this.getAll();
    const existing = users.find((entry) => entry.id === user.id);

    if (!existing) {
      users.push(user);
      await this.saveAll(users);
    }
  }

  async getById(userId: string): Promise<User | null> {
    const users = await this.getAll();
    return users.find((user) => user.id === userId) ?? null;
  }

  async update(user: User): Promise<void> {
    const users = await this.getAll();
    const updated = users.map((entry) => (entry.id === user.id ? user : entry));
    await this.saveAll(updated);
  }

  async setActiveUserId(userId: string | null): Promise<void> {
    if (userId) {
      await AsyncStorage.setItem(ACTIVE_USER_KEY, userId);
      return;
    }

    await AsyncStorage.removeItem(ACTIVE_USER_KEY);
  }

  async getActiveUserId(): Promise<string | null> {
    return AsyncStorage.getItem(ACTIVE_USER_KEY);
  }

  async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(ACTIVE_USER_KEY);
  }
}