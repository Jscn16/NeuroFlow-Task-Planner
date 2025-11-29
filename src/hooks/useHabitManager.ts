import { useState, useEffect, useRef, useCallback } from 'react';
import { HabitManager } from '../services/HabitManager';
import { Habit } from '../types';

export function useHabitManager(initialHabits: Habit[]) {
    const managerRef = useRef<HabitManager>();
    const [habits, setHabits] = useState<Habit[]>(initialHabits);

    if (!managerRef.current) {
        managerRef.current = new HabitManager(initialHabits);
    }

    const manager = managerRef.current;

    useEffect(() => {
        return manager.subscribe(setHabits);
    }, []);

    useEffect(() => {
        if (JSON.stringify(initialHabits) !== JSON.stringify(manager.getHabits())) {
            manager.setHabits(initialHabits);
        }
    }, [initialHabits]);

    const addHabit = useCallback((name: string, goal: number) => {
        manager.addHabit(name, goal);
    }, []);

    const deleteHabit = useCallback((habitId: string) => {
        manager.deleteHabit(habitId);
    }, []);

    const toggleHabit = useCallback((habitId: string, dayIndex: number) => {
        manager.toggleHabit(habitId, dayIndex);
    }, []);

    return {
        habits,
        addHabit,
        deleteHabit,
        toggleHabit
    };
}
