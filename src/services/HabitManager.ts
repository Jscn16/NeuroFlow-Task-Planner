import { Habit } from '../types';

type HabitListener = (habits: Habit[]) => void;

export class HabitManager {
    private habits: Habit[];
    private listeners: Set<HabitListener>;

    constructor(initialHabits: Habit[] = []) {
        this.habits = initialHabits;
        this.listeners = new Set();
    }

    subscribe(listener: HabitListener): () => void {
        this.listeners.add(listener);
        listener(this.habits);
        return () => this.listeners.delete(listener);
    }

    private notify() {
        this.listeners.forEach(listener => listener(this.habits));
    }

    getHabits(): Habit[] {
        return [...this.habits];
    }

    addHabit(name: string, goal: number) {
        const newHabit: Habit = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            goal,
            checks: Array(7).fill(false)
        };
        this.habits = [...this.habits, newHabit];
        this.notify();
    }

    deleteHabit(habitId: string) {
        this.habits = this.habits.filter(h => h.id !== habitId);
        this.notify();
    }

    toggleHabit(habitId: string, dayIndex: number) {
        this.habits = this.habits.map(h => {
            if (h.id === habitId) {
                const newChecks = [...h.checks];
                newChecks[dayIndex] = !newChecks[dayIndex];
                return { ...h, checks: newChecks };
            }
            return h;
        });
        this.notify();
    }

    setHabits(newHabits: Habit[]) {
        this.habits = newHabits;
        this.notify();
    }
}
