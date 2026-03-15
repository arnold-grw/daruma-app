
import { Daruma, DarumaColor } from "../types/daruma";
import { DarumaRepository } from "../repositories/daruma_repository";
import { create } from "zustand";
import { TEST_DARUMAS } from '../constants/test_data';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";

const repo = new DarumaRepository();

interface DarumaDraft {
  color: DarumaColor
  goal: string
}

interface DarumaState {
  darumas: Daruma[];
  draft: DarumaDraft;

  load: () => Promise<void>;
  add: (daruma: Daruma) => Promise<void>;

  setDraft: (values: Partial<DarumaDraft>) => void;
  commitDraft: () => Promise<void>;
}

const DEFAULT_DRAFT: DarumaDraft = {
  color: 'red',
  goal: '',
}

export const useDarumaStore = create<DarumaState>((set, get) => ({
  darumas: [],
  draft: DEFAULT_DRAFT,

  load: async () => {
    repo.clearAll(); //clear storage for testing
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

  commitDraft: async () => {
    const { draft } = get()

    const newDaruma: Daruma = {
      id: uuidv4(),
      userId: 'test-user',
      goal: draft.goal.trim(),
      color: draft.color,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await repo.add(newDaruma)
    const darumas = await repo.getAll()
    set({ darumas, draft: DEFAULT_DRAFT })   //clean up draft after commit

  },
}));



