import AsyncStorage from "@react-native-async-storage/async-storage";
import { Daruma } from '../types/daruma';

const STORAGE_KEY = 'darumas';

export class DarumaRepository {

    async getAll(): Promise<Daruma[]> {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    }

    async saveAll(darumas: Daruma[]): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(darumas));
    }

    async add(daruma: Daruma): Promise<void> {
        const darumas = await this.getAll();
        darumas.push(daruma);
        await this.saveAll(darumas);
    }

    async remove(darumaId: string): Promise<void> {
        const darumas = await this.getAll();
        const filtered = darumas.filter(d => d.id !== darumaId);
        await this.saveAll(filtered);
    }

    async clearAll(): Promise<void> {
        await AsyncStorage.removeItem(STORAGE_KEY);
    }

}