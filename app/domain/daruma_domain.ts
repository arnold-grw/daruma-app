import { Daruma } from "@/types/daruma";
import { DrawingData } from "@/types/drawing";
import { v4 as uuidv4 } from "uuid";
import { DarumaDraft } from "../store/daruma_store";

export function createDaruma(draft: DarumaDraft): Daruma {
    if (!draft.goal.trim()) {
        throw new Error("Goal cannot be empty");
    }

    const now = new Date().toISOString();

    return {
        id: uuidv4(),
        userId: 'test-user',
        goal: draft.goal.trim(),
        color: draft.color,
        notes: draft.notes.trim(),
        deadline: draft.deadline,
        isCompleted: false,
        isFailed: false,
        createdAt: now,
        updatedAt: now,
        leftEyeDrawing: draft.leftEyeDrawing
    };
}


export function completeDaruma(daruma: Daruma, drawing: DrawingData): Daruma {
    const now = new Date().toISOString();

    return {
        ...daruma,
        isCompleted: true,
        completedAt: now,
        updatedAt: now,
        rightEyeDrawing: drawing,
    };
}

export function updateDarumaNotes(daruma: Daruma, notes: string): Daruma {
    const now = new Date().toISOString();

    return {
        ...daruma,
        notes: notes.trim(),
        updatedAt: now,
    };
}

export function updateDarumGoal(daruma: Daruma, goal: string): Daruma {
    const now = new Date().toISOString();

    return {
        ...daruma,
        goal: goal.trim(),
        updatedAt: now,
    };
}