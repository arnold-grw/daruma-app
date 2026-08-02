import { v4 as uuidv4 } from "uuid";
import { User } from "@/types/user";

export const createUser = (input: Partial<User> & Pick<User, "name" | "email">): User => {
  const now = new Date().toISOString();

  return {
    id: input.id ?? uuidv4(),
    name: input.name,
    email: input.email,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
    languagePreference: input.languagePreference ?? "en",
    useDarkmode: input.useDarkmode ?? false,
  };
};

export const isUserEditable = (user: User, activeUserId: string | null): boolean =>
  user.id === activeUserId;
