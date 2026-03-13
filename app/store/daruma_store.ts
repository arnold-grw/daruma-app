
import { Daruma } from "../types/daruma";
import { DarumaRepository } from "../repositories/daruma_repository";
import { create } from "zustand";
import { TEST_DARUMAS } from '../constants/test_data';

const repo = new DarumaRepository();

interface DarumaState {
    darumas: Daruma[];
    load: () => Promise<void>;
    add: (daruma: Daruma) => Promise<void>;
}

export const useDarumaStore = create<DarumaState>((set) => ({
    darumas: [],
    /*
    load: async () => {
        const darumas = await repo.getAll();
        set({ darumas });
    }, */
    load: async () => {
    repo.clearAll() // ← Zum Testen: Alle Daten löschen, damit die Testdaten geladen werden
    const darumas = await repo.getAll()
        if (darumas.length === 0) {
            // Erster Start – Testdaten speichern und laden
            await repo.saveAll(TEST_DARUMAS)
            set({ darumas: TEST_DARUMAS })
        } else {
            set({ darumas })
        }
    },

    add: async (daruma: Daruma) => {
        await repo.add(daruma);
        const darumas = await repo.getAll();
        set({ darumas });
    }
}));



