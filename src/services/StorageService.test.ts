import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from './StorageService';
import { AppData } from '../types';

describe('StorageService', () => {
    let storageService: StorageService;

    beforeEach(() => {
        // Reset singleton instance if possible, or just clear storage
        localStorage.clear();
        storageService = StorageService.getInstance();
    });

    it('should be a singleton', () => {
        const instance1 = StorageService.getInstance();
        const instance2 = StorageService.getInstance();
        expect(instance1).toBe(instance2);
    });

    it('should save data to localStorage', () => {
        const data: AppData = { tasks: [], habits: [], brainDumpLists: [] };
        storageService.save(data);

        const stored = localStorage.getItem('neuroflow-app-data');
        expect(stored).toBeTruthy();
        expect(JSON.parse(stored!)).toEqual(data);
    });

    it('should load data from localStorage', () => {
        const data: AppData = { tasks: [], habits: [], brainDumpLists: [] };
        localStorage.setItem('neuroflow-app-data', JSON.stringify(data));

        const loaded = storageService.load();
        expect(loaded).toEqual(data);
    });

    it('should return null if no data exists', () => {
        const loaded = storageService.load();
        expect(loaded).toBeNull();
    });

    it('should handle invalid JSON gracefully', () => {
        localStorage.setItem('neuroflow-app-data', 'invalid json');
        const loaded = storageService.load();
        expect(loaded).toBeNull();
    });
});
