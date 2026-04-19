
import { Daruma, DarumaColor } from "../types/daruma";
import { DarumaRepository } from "../repositories/daruma_repository";
import { create } from "zustand";
import { useShallow } from 'zustand/react/shallow'
import 'react-native-get-random-values';
import { createDaruma, completeDaruma, updateDarumaNotes } from "@/domain/daruma_domain";
import { TEST_DARUMA } from "@/constants/test_data";


const repo = new DarumaRepository();

export interface DarumaDraft {
  color: DarumaColor
  goal: string
  notes: string
}

interface DarumaState {
  darumas: Daruma[];
  draft: DarumaDraft;

  load: () => Promise<void>;
  add: (daruma: Daruma) => Promise<void>;
  complete: (darumaId: string) => Promise<void>;
  updateNotes: (darumaId: string, notes: string) => Promise<void>;
  delete: (darumaId: string) => Promise<void>;

  setDraft: (values: Partial<DarumaDraft>) => void;
  commitDraft: () => Promise<void>;
  resetDraft: () => void;
}

const DEFAULT_DRAFT: DarumaDraft = {
  color: 'red',
  goal: '',
  notes: '',
}

export const useDarumaStore = create<DarumaState>((set, get) => ({
  darumas: [],
  draft: DEFAULT_DRAFT,

  load: async () => {
    //repo.clearAll(); //clear storage for testing
    const darumas = await repo.getAll();
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

    const newDaruma = createDaruma(draft);

    await repo.add(newDaruma)
    const darumas = await repo.getAll()
    set({ darumas, draft: DEFAULT_DRAFT })   //clean up draft after commit

  },

  complete: async (id: string) => {
    const { darumas } = get();

    const daruma = darumas.find(d => d.id === id);
    if (!daruma) return;

    const updated = completeDaruma(daruma);

    await repo.update(updated);

    set({
      darumas: darumas.map(d => d.id === id ? updated : d)
    });
  },

  updateNotes: async (id: string, notes: string) => {
    const { darumas } = get();

    const daruma = darumas.find(d => d.id === id);
    if (!daruma) return;

    const updated = updateDarumaNotes(daruma, notes);

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
  useDarumaStore(useShallow(state => [TEST_DARUMA, ...state.darumas.filter(d => !d.isCompleted)]))   // insert test daruma for development/testing

export const useCompletedDarumas = () =>
  useDarumaStore(useShallow(state => state.darumas.filter(d => d.isCompleted)))



