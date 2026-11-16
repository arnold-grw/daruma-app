
import { completeDaruma, createDaruma, extendDarumaDeadline, markOverdueDarumas, migrateDarumaColors, updateDarumaGoal, updateDarumaNotes } from "@/domain/daruma_domain";
import { useUserStore } from "@/store/user_store";
import { DrawingData } from "@/types/drawing";
import 'react-native-get-random-values';
import { create } from "zustand";
import { useShallow } from 'zustand/react/shallow';
import { DarumaRepository } from "../repositories/daruma_repository";
import { Daruma, DarumaColor } from "../types/daruma";


const repo = new DarumaRepository();

export interface DarumaDraft {
  color: DarumaColor
  goal: string
  notes: string
  deadline?: string
  leftEyeDrawing?: DrawingData;
}

interface DarumaState {
  darumas: Daruma[];
  draft: DarumaDraft;

  load: () => Promise<void>;
  add: (daruma: Daruma) => Promise<void>;
  complete: (darumaId: string, drawing: DrawingData) => Promise<void>;
  updateNotes: (darumaId: string, notes: string) => Promise<void>;
  updateGoal: (darumaId: string, goal: string) => Promise<void>;
  extendDeadline: (darumaID: string, deadline: string) => Promise<void>;
  delete: (darumaId: string) => Promise<void>;

  setDraft: (values: Partial<DarumaDraft>) => void;
  // saves the draft as a new daruma and returns its id
  commitDraft: () => Promise<string>;
  resetDraft: () => void;
}

const DEFAULT_DRAFT: DarumaDraft = {
  color: 'red',
  goal: '',
  notes: ''
}

export const useDarumaStore = create<DarumaState>((set, get) => ({
  darumas: [],
  draft: DEFAULT_DRAFT,

  load: async () => {
    //repo.clearAll(); //clear storage for testing
    const stored = await repo.getAll();
    const migrated = migrateDarumaColors(stored);
    // mark overdue darumas before they reach the state, so they show up in the archive right away
    const { darumas, changed } = markOverdueDarumas(migrated.darumas);
    if (changed || migrated.changed) {
      await repo.saveAll(darumas);
    }
    set({ darumas });
  },

  add: async (daruma: Daruma) => {
    await repo.add(daruma);
    const darumas = await repo.getAll();
    set({ darumas });
  },

  setDraft: (values) => {
    set(state => ({ draft: { ...state.draft, ...values } }))
  },

  resetDraft: () => {
    set({ draft: DEFAULT_DRAFT })
  },

  commitDraft: async () => {
    const { draft } = get()

    const userId = useUserStore.getState().activeUserId;
    if (!userId) {
      throw new Error("No active user, the user store must be loaded before creating a daruma");
    }

    const newDaruma = createDaruma(draft, userId);

    await repo.add(newDaruma)
    const darumas = await repo.getAll()
    set({ darumas, draft: DEFAULT_DRAFT })   //clean up draft after commit
    return newDaruma.id

  },

  complete: async (id: string, drawing: DrawingData) => {
    const { darumas } = get();

    const daruma = darumas.find(d => d.id === id);
    if (!daruma) return;

    const updated = completeDaruma(daruma, drawing);

    await repo.update(updated);

    set({
      darumas: darumas.map(d => d.id === id ? updated : d)
    });

    // counts towards unlocking colors (only the first time, in case a daruma gets completed twice)
    if (!daruma.isCompleted) {
      const { activeUser, updateCurrentUser } = useUserStore.getState();
      if (activeUser) await updateCurrentUser({ completedDarumaCount: activeUser.completedDarumaCount + 1 });
    }
  },

  updateNotes: async (id: string, notes: string) => {
    const { darumas } = get();

    const daruma = darumas.find(d => d.id === id);
    if (!daruma) return;
    // unchanged notes: don't save, so updatedAt only changes on real edits
    if (notes.trim() === (daruma.notes ?? "")) return;

    const updated = updateDarumaNotes(daruma, notes);

    await repo.update(updated);

    set({
      darumas: darumas.map(d => d.id === id ? updated : d)
    });

  },

  updateGoal: async (id: string, goal: string) => {
    const { darumas } = get();

    const daruma = darumas.find(d => d.id === id);
    if (!daruma) return;
    if (!goal.trim() || goal.trim() === daruma.goal) return;

    const updated = updateDarumaGoal(daruma, goal);

    await repo.update(updated);

    set({
      darumas: darumas.map(d => d.id === id ? updated : d)
    });
  },

  extendDeadline: async (id: string, deadline: string) => {
    const { darumas } = get();

    const daruma = darumas.find(d => d.id === id);
    if (!daruma) return;

    const updated = extendDarumaDeadline(daruma, deadline);

    await repo.update(updated);

    set({
      darumas: darumas.map(d => d.id === id ? updated : d)
    });
  },

  delete: async (id: string) => {
    await repo.remove(id);

    const darumas = await repo.getAll();
    set({ darumas });
  },

}));

export const useActiveDarumas = () =>
  useDarumaStore(useShallow(state =>
    state.darumas
      .filter(d => !d.isCompleted && !d.isFailed)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  ))

export const useCompletedDarumas = () =>
  useDarumaStore(useShallow(state =>
    state.darumas
      .filter(d => d.isCompleted && !d.isFailed)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
  ))

export const useOverdueDarumas = () =>
  useDarumaStore(useShallow(state =>
    state.darumas
      .filter(d => d.isFailed)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  ))
