import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { User } from "@/types/user";

export const createUser = (input: Partial<User> & Pick<User, "name">): User => {
  const now = new Date().toISOString();

  return {
    id: input.id ?? uuidv4(),
    name: input.name,
    email: input.email,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
    languagePreference: input.languagePreference, // unset = follow the system language
    useDarkmode: input.useDarkmode ?? false,
    completedDarumaCount: input.completedDarumaCount ?? 0,
  };
};

export const isUserEditable = (user: User, activeUserId: string | null): boolean =>
  user.id === activeUserId;
