import { useEffect, useCallback } from 'react';
import { StorageService } from '../services/StorageService';
import { AppData, Task, Habit, BrainDumpList } from '../types';

export function usePersistence(tasks: Task[], habits: Habit[], brainDumpLists: BrainDumpList[]) {
    const storage = StorageService.getInstance();

    // Auto-save
    useEffect(() => {
        const data: AppData = { tasks, habits, brainDumpLists };
        storage.save(data);
    }, [tasks, habits, brainDumpLists]);

    const loadData = useCallback(() => {
        return storage.load();
    }, []);

    const exportData = useCallback(() => {
        const data: AppData = { tasks, habits, brainDumpLists };
        storage.exportData(data);
    }, [tasks, habits, brainDumpLists]);

    const importData = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return null;

        try {
            const data = await storage.importData(file);
            if (data) {
                // Critical: Save the imported data to localStorage immediately
                storage.save(data);
            }
            return data;
        } catch (error) {
            console.error(error);
            alert('Failed to import data.');
            return null;
        }
    }, []);

    return {
        loadData,
        exportData,
        importData,
        saveTheme: (id: string) => storage.saveTheme(id),
        loadTheme: () => storage.loadTheme()
    };
}
