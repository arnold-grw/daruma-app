import { Daruma } from "@/types/daruma";
import { DrawingData } from "@/types/drawing";
import { isDeadlinePassed } from "@/utils/date_formatter";
import { v4 as uuidv4 } from "uuid";
import { DarumaDraft } from "../store/daruma_store";

export function createDaruma(draft: DarumaDraft, userId: string): Daruma {
    if (!draft.goal.trim()) {
        throw new Error("Goal cannot be empty");
    }

    const now = new Date().toISOString();

    return {
        id: uuidv4(),
        userId,
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

export function updateDarumaGoal(daruma: Daruma, goal: string): Daruma {
    const now = new Date().toISOString();

    return {
        ...daruma,
        goal: goal.trim(),
        updatedAt: now,
    };
}

export function extendDarumaDeadline(daruma: Daruma, deadline: string) : Daruma {
    const now = new Date().toISOString();

    return {
        ...daruma,
        deadline: deadline.trim(),
        isFailed: false,
        updatedAt: now,
    };
}

/**
 * Marks active darumas whose deadline day is over as failed.
 * `changed` tells the caller whether anything needs to be saved.
 */
export function markOverdueDarumas(darumas: Daruma[], now: Date = new Date()): { darumas: Daruma[]; changed: boolean } {
    let changed = false;

    const updated = darumas.map(daruma => {
        if (daruma.deadline && !daruma.isCompleted && !daruma.isFailed && isDeadlinePassed(daruma.deadline, now)) {
            changed = true;
            return { ...daruma, isFailed: true, updatedAt: now.toISOString() };
        }
        return daruma;
    });

    return { darumas: updated, changed };
}
