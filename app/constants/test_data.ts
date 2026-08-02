import { Daruma } from "../types/daruma";
import { User } from "../types/user";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export const TEST_USER: User = {
  id: "00000000-0000-0000-0000-000000000000",
  name: "Max",
  email: "test@mail.com",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  languagePreference: "en",
};

export const TEST_DARUMA: Daruma = {
  id: uuidv4(),
  userId: TEST_USER.id,
  goal: "test drawing",
  notes: "-",
  color: "blue",
  isCompleted: false,
  isFailed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  leftEyeDrawing: {
    lines: [
      {
        points: [{ x: -0.0, y: -0.0 }, { x: 0.0, y: 0.0 }],
        width: 1.5,
      },
    ],
  },
  rightEyeDrawing: {
    lines: [
      {
        points: [{ x: -0.0, y: -0.0 }, { x: 0.0, y: 0.0 }],
        width: 1.5,
      },
    ],
  },
};