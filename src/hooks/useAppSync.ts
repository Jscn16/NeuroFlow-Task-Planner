import { useState, useEffect, useCallback, useMemo } from 'react';
import type { User } from '@supabase/supabase-js';
import { AppData, BrainDumpList, Habit, Task } from '../types';
import { useSupabaseAuth } from './useSupabaseAuth';
import { SupabaseDataService } from '../services/supabaseDataService';
import { StorageService } from '../services/StorageService';
import { supabaseAvailable, supabaseUrl, checkSupabaseConnectivity } from '../lib/supabase';
import { generateId } from '../utils/id';

interface UseAppSyncResult {
    // Sync state
    useSupabaseSync: boolean;
    isDataLoading: boolean;
    dataError: string | null;
    globalLoadingTimeout: boolean;

    // Initial data (for providers)
    initialTasks: Task[];
    initialHabits: Habit[];
    initialBrainDump: BrainDumpList[];

    // Actions
    handleToggleSupabaseSync: (enabled: boolean) => void;
    handleDataImported: (data: AppData) => void;
    handleDeleteAllTasks: () => Promise<void>;

    // Auth (passthrough from useSupabaseAuth)
    user: User | null;
    isAuthReady: boolean;
    authError: string | null;
    authTimeoutReached: boolean;
    magicLinkSent: boolean;
    signInWithEmail: (email: string) => Promise<void>;
    signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
}

/**
 * useAppSync - Centralized hook for Supabase sync and auth state management
 * 
 * Extracts all sync-related logic from App.tsx:
 * - Health checks with timeouts
 * - Auth state management
 * - Data loading with fallbacks
 * - Toggle sync on/off
 */
export function useAppSync(): UseAppSyncResult {
    const storage = useMemo(() => StorageService.getInstance(), []);
    const localData = useMemo(() => storage.load(), [storage]);

    // Sync state
    const [useSupabaseSync, setUseSupabaseSync] = useState<boolean>(supabaseAvailable);
    const [supabaseHealthy, setSupabaseHealthy] = useState<boolean | null>(null);
    const [authTimeoutReached, setAuthTimeoutReached] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
    const [dataError, setDataError] = useState<string | null>(null);
    const [globalLoadingTimeout, setGlobalLoadingTimeout] = useState(false);

    // Initial data state
    const [initialTasks, setInitialTasks] = useState<Task[]>(localData?.tasks || []);
    const [initialHabits, setInitialHabits] = useState<Habit[]>(
        localData?.habits?.map(h => ({ ...h, goal: h.goal || 7 })) || []
    );
    const [initialBrainDump, setInitialBrainDump] = useState<BrainDumpList[]>(
        (localData?.brainDumpLists && localData.brainDumpLists.length > 0)
            ? localData.brainDumpLists
            : [{ id: generateId(), title: 'Main List', content: localData?.brainDumpContent || '' }]
    );

    // Auth hook
    const { user, isAuthReady, authError, magicLinkSent, signInWithEmail, signInWithOAuth } = useSupabaseAuth();

    // Utility: Promise with timeout
    const withTimeout = useCallback(async <T,>(promise: Promise<T>, ms: number): Promise<T> => {
        return Promise.race<T>([
            promise,
            new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Supabase fetch timed out')), ms))
        ]);
    }, []);

    // Health check function
    const checkSupabaseHealth = useCallback(async (): Promise<boolean> => {
        if (!supabaseAvailable || !supabaseUrl) return false;
        try {
            const controller = new AbortController();
            const timer = window.setTimeout(() => controller.abort(), 4000);
            const res = await fetch(`${supabaseUrl}/rest/v1/`, {
                signal: controller.signal,
                headers: {
                    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`
                }
            });
            window.clearTimeout(timer);
            return res.status === 200 || res.status === 401 || res.status === 403;
        } catch {
            return false;
        }
    }, []);

    // Fallback to local mode
    const fallbackToLocal = useCallback((reason?: string) => {
        console.warn('Supabase unavailable, switching to local mode.', reason);
        setUseSupabaseSync(false);
        storage.saveSyncPreference(false);
        setDataError(null);
        setIsDataLoading(false);
        const freshLocal = storage.load();
        setInitialTasks(freshLocal?.tasks || []);
        setInitialHabits(freshLocal?.habits?.map(h => ({ ...h, goal: h.goal || 7 })) || []);
        setInitialBrainDump(
            (freshLocal?.brainDumpLists && freshLocal.brainDumpLists.length > 0)
                ? freshLocal.brainDumpLists
                : [{ id: generateId(), title: 'Main List', content: freshLocal?.brainDumpContent || '' }]
        );
    }, [storage]);

    // Push local data to Supabase
    const pushLocalToSupabase = useCallback(async (data: AppData) => {
        if (!useSupabaseSync || !user) return;
        await Promise.all([
            withTimeout(SupabaseDataService.replaceTasks(user.id, data.tasks || []), 4000),
            withTimeout(SupabaseDataService.replaceHabits(user.id, data.habits || []), 4000),
            withTimeout(SupabaseDataService.replaceNotes(user.id, data.brainDumpLists || []), 4000)
        ]);
    }, [useSupabaseSync, user, withTimeout]);

    // === EFFECTS ===

    // Health check on mount
    useEffect(() => {
        if (!useSupabaseSync || !supabaseAvailable) {
            setSupabaseHealthy(false);
            setIsDataLoading(false);
            return;
        }

        let cancelled = false;
        const runHealthCheck = async () => {
            try {
                const healthy = await checkSupabaseHealth();
                if (cancelled) return;

                if (!healthy) {
                    console.warn('Supabase health check failed on startup.');
                    setSupabaseHealthy(false);
                    fallbackToLocal('Supabase is not reachable from this environment.');
                    return;
                }

                const authOk = await checkSupabaseConnectivity();
                if (cancelled) return;

                if (!authOk) {
                    console.warn('Supabase Auth connectivity check failed.');
                    setSupabaseHealthy(false);
                    fallbackToLocal('This domain is not authorized for Supabase sync.');
                    return;
                }

                setSupabaseHealthy(true);
            } catch {
                if (cancelled) return;
                setSupabaseHealthy(false);
                fallbackToLocal('Error checking Supabase connectivity.');
            }
        };

        runHealthCheck();
        return () => { cancelled = true; };
    }, []); // Run only on mount

    // Auth timeout
    useEffect(() => {
        if (!useSupabaseSync) return;
        setAuthTimeoutReached(false);
        const timer = window.setTimeout(() => setAuthTimeoutReached(true), 5000);
        return () => window.clearTimeout(timer);
    }, [useSupabaseSync]);

    // Global loading timeout
    useEffect(() => {
        if (!useSupabaseSync || !isDataLoading) {
            setGlobalLoadingTimeout(false);
            return;
        }
        const timer = window.setTimeout(() => {
            setGlobalLoadingTimeout(true);
            console.warn('Global loading timeout reached.');
        }, 8000);
        return () => window.clearTimeout(timer);
    }, [useSupabaseSync, isDataLoading]);

    // Handle auth state changes
    useEffect(() => {
        if (!useSupabaseSync) return;
        if (authError || !user || (authTimeoutReached && !isAuthReady)) {
            setIsDataLoading(false);
        }
    }, [authError, authTimeoutReached, isAuthReady, useSupabaseSync, user]);

    // Data loading effect
    useEffect(() => {
        if (!useSupabaseSync) {
            setIsDataLoading(false);
            return;
        }
        if (!supabaseAvailable) {
            fallbackToLocal('Supabase is not configured.');
            return;
        }
        if (!user) return;

        let active = true;
        const load = async () => {
            setIsDataLoading(true);
            setDataError(null);
            try {
                const healthy = await checkSupabaseHealth();
                if (!healthy) {
                    console.warn('Supabase health check failed; attempting to load anyway.');
                }
                const [tasks, habits, notes] = await Promise.all([
                    withTimeout(SupabaseDataService.fetchTasks(user.id), 4000),
                    withTimeout(SupabaseDataService.fetchHabits(user.id), 4000),
                    withTimeout(SupabaseDataService.fetchNotes(user.id), 4000)
                ]);
                if (!active) return;

                const remoteEmpty = (!tasks.length && !habits.length && !notes.length);
                if (remoteEmpty) {
                    const freshLocal = storage.load();
                    const hasAnyLocalData = (freshLocal?.tasks?.length || 0) > 0 ||
                        (freshLocal?.habits?.length || 0) > 0 ||
                        (freshLocal?.brainDumpLists?.length || 0) > 0;
                    if (hasAnyLocalData) {
                        const fallbackData: AppData = {
                            tasks: freshLocal?.tasks || [],
                            habits: freshLocal?.habits || [],
                            brainDumpLists: freshLocal?.brainDumpLists || []
                        };
                        setInitialTasks(fallbackData.tasks);
                        setInitialHabits(fallbackData.habits);
                        setInitialBrainDump(fallbackData.brainDumpLists.length ? fallbackData.brainDumpLists : [{ id: generateId(), title: 'Main List', content: '' }]);
                        storage.save(fallbackData);
                        void pushLocalToSupabase(fallbackData);
                    } else {
                        setInitialTasks([]);
                        setInitialHabits([]);
                        setInitialBrainDump([{ id: generateId(), title: 'Main List', content: '' }]);
                    }
                } else {
                    setInitialTasks(tasks);
                    setInitialHabits(habits);
                    setInitialBrainDump(notes.length ? notes : [{ id: generateId(), title: 'Main List', content: '' }]);
                    storage.save({ tasks, habits, brainDumpLists: notes });
                }
            } catch (error) {
                console.error('Failed to load Supabase data', error);
                if (active) {
                    fallbackToLocal('Unable to load data from Supabase.');
                }
            } finally {
                if (active) {
                    setIsDataLoading(false);
                }
            }
        };
        load();
        return () => { active = false; };
    }, [user, useSupabaseSync, fallbackToLocal, storage, checkSupabaseHealth, withTimeout, pushLocalToSupabase]);

    // === HANDLERS ===

    const handleDataImported = useCallback((data: AppData) => {
        const normalized: AppData = {
            tasks: data.tasks || [],
            habits: (data.habits || []).map(h => ({ ...h, goal: h.goal || 7 })),
            brainDumpLists: (data.brainDumpLists && data.brainDumpLists.length > 0)
                ? data.brainDumpLists
                : [{ id: generateId(), title: 'Main List', content: '' }]
        };
        setInitialTasks(normalized.tasks);
        setInitialHabits(normalized.habits);
        setInitialBrainDump(normalized.brainDumpLists);
        storage.save(normalized);
        if (useSupabaseSync && user) {
            pushLocalToSupabase(normalized).catch(err => {
                console.error('Failed to sync imported data to Supabase', err);
                setDataError('Imported locally. Supabase sync failed.');
            });
        }
    }, [storage, useSupabaseSync, user, pushLocalToSupabase]);

    const handleDeleteAllTasks = useCallback(async () => {
        setInitialTasks([]);
        setInitialHabits([]);
        setInitialBrainDump([]);
        storage.save({ tasks: [], habits: [], brainDumpLists: [] });

        if (useSupabaseSync && user) {
            try {
                await Promise.all([
                    withTimeout(SupabaseDataService.replaceTasks(user.id, []), 4000),
                    withTimeout(SupabaseDataService.replaceHabits(user.id, []), 4000),
                    withTimeout(SupabaseDataService.replaceNotes(user.id, []), 4000)
                ]);
            } catch (error) {
                console.error('Failed to clear Supabase data', error);
            }
        }
    }, [storage, useSupabaseSync, user, withTimeout]);

    const handleToggleSupabaseSync = useCallback(async (enabled: boolean) => {
        if (enabled && !supabaseAvailable) {
            alert('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable sync.');
            setUseSupabaseSync(false);
            storage.saveSyncPreference(false);
            setDataError(null);
            setIsDataLoading(false);
            return;
        }
        if (enabled) {
            const healthy = await checkSupabaseHealth();
            if (!healthy) {
                console.warn('Supabase health check failed; proceeding to attempt sync.');
            }
        }
        setUseSupabaseSync(enabled);
        storage.saveSyncPreference(enabled);
        if (!enabled) {
            setDataError(null);
            setIsDataLoading(false);
        } else {
            setIsDataLoading(true);
        }
    }, [storage, checkSupabaseHealth]);

    return {
        // Sync state
        useSupabaseSync,
        isDataLoading,
        dataError,
        globalLoadingTimeout,
        // Data
        initialTasks,
        initialHabits,
        initialBrainDump,
        // Actions
        handleToggleSupabaseSync,
        handleDataImported,
        handleDeleteAllTasks,
        // Auth
        user,
        isAuthReady,
        authError,
        authTimeoutReached,
        magicLinkSent,
        signInWithEmail,
        signInWithOAuth,
    };
}
