//types/daruma

export interface Daruma {
  id: string;
  userId: string
  goal: string;
  notes?: string;
  color: DarumaColor;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
  updatedAt: string;
  //imageUrl: string;
}

export type DarumaColor = "red" | "blue" | "green" | "yellow" | "pink" | "black";

