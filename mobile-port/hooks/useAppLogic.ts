import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskType, Habit, GridRow, TaskStatus, AppData, BrainDumpList } from '../types';

// --- Constants (Ported) ---
const STORAGE_KEY = 'neuroflow-app-data';

// --- Initial Data (Ported) ---
const INITIAL_TASKS: Task[] = [
    { id: '1', title: 'Q3 Strategy Review', duration: 60, type: 'high', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: 'do', createdAt: Date.now() },
    { id: '2', title: 'Inbox Zero', duration: 30, type: 'low', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: 'delegate', createdAt: Date.now() },
];

const INITIAL_HABITS: Habit[] = [
    { id: 'h1', name: 'Meditation', goal: 7, checks: [false, false, true, false, false, false, false] },
];

export const useAppLogic = () => {
    // --- State ---
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
    const [brainDumpLists, setBrainDumpLists] = useState<BrainDumpList[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // --- Load Data ---
    useEffect(() => {
        const loadData = async () => {
            try {
                const json = await AsyncStorage.getItem(STORAGE_KEY);
                if (json) {
                    const data = JSON.parse(json);
                    if (data && Array.isArray(data.tasks)) {
                        setTasks(data.tasks);
                    }
                    if (data && Array.isArray(data.habits)) {
                        setHabits(data.habits);
                    }
                    if (data && data.brainDumpLists) {
                        setBrainDumpLists(data.brainDumpLists);
                    }
                }
            } catch (error) {
                console.error('Failed to load from AsyncStorage:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadData();
    }, []);

    // --- Save Data ---
    useEffect(() => {
        if (!isLoaded) return; // Don't save initial empty state over existing data
        const saveData = async () => {
            try {
                const appData: AppData = { tasks, habits, brainDumpLists };
                const json = JSON.stringify(appData);
                await AsyncStorage.setItem(STORAGE_KEY, json);
            } catch (error) {
                console.error('Failed to save to AsyncStorage:', error);
            }
        };
        saveData();
    }, [tasks, habits, brainDumpLists, isLoaded]);

    // --- Handlers (Ported) ---
    const addTask = (title: string, duration: number, type: TaskType) => {
        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            duration,
            type,
            status: 'unscheduled',
            dueDate: null,
            assignedRow: null,
            eisenhowerQuad: null,
            createdAt: Date.now(),
        };
        setTasks(prev => [...prev, newTask]);
    };

    const updateTask = (taskId: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, ...updates } : t
        ));
    };

    const deleteTask = (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
    };

    const toggleTaskComplete = (taskId: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                const isComplete = t.status === 'completed';
                let newStatus: TaskStatus;

                if (isComplete) {
                    newStatus = (t.dueDate && t.assignedRow) ? 'scheduled' : 'unscheduled';
                } else {
                    newStatus = 'completed';
                }
                return { ...t, status: newStatus };
            }
            return t;
        }));
    };

    return {
        tasks,
        habits,
        brainDumpLists,
        isLoaded,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
    };
};
