//types/daruma
import { DrawingData } from "@/types/drawing";

export interface Daruma {
  id: string;
  userId: string
  goal: string;
  notes?: string;
  color: DarumaColor;
  isCompleted: boolean;
  deadline?: string;
  createdAt: string;
  completedAt?: string;
  updatedAt: string;
  isFailed: boolean;

  leftEyeDrawing?: DrawingData;
  rightEyeDrawing?: DrawingData;
}

export type DarumaColor = "red" | "blue" | "green" | "yellow" | "pink" | "black";

