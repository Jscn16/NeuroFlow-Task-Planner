import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Habit } from '../../../types';
import { DAYS } from '../../../constants';

interface HabitTrackerProps {
    habits: Habit[];
    toggleHabit: (habitId: string, dayIndex: number) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, toggleHabit }) => {
    return (
        <div className="h-full p-8 overflow-y-auto">
            <h2 className="text-3xl font-display font-bold text-white mb-8">Habit Tracker</h2>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left py-4 px-4 text-slate-500 uppercase text-xs tracking-wider">Habit</th>
                            {DAYS.map(d => (
                                <th key={d} className="text-center py-4 px-2 text-slate-500 uppercase text-xs tracking-wider">{d}</th>
                            ))}
                            <th className="text-center py-4 px-4 text-slate-500 uppercase text-xs tracking-wider">Streak</th>
                        </tr>
                    </thead>
                    <tbody>
                        {habits.map(habit => {
                            const streak = habit.checks.filter(Boolean).length;
                            return (
                                <tr key={habit.id} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-4 font-bold text-slate-200">{habit.name}</td>
                                    {habit.checks.map((checked, i) => (
                                        <td key={i} className="py-4 px-2 text-center">
                                            <button
                                                onClick={() => toggleHabit(habit.id, i)}
                                                className={`
                                                    w-8 h-8 rounded-lg transition-all duration-300 flex items-center justify-center mx-auto
                                                    ${checked
                                                        ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-110'
                                                        : 'bg-white/[0.05] text-transparent hover:bg-white/[0.1]'
                                                    }
                                                `}
                                            >
                                                <CheckCircle2 size={16} strokeWidth={4} />
                                            </button>
                                        </td>
                                    ))}
                                    <td className="py-4 px-4 text-center">
                                        <span className="px-3 py-1 rounded-full bg-white/[0.05] text-xs font-bold text-slate-300">{streak} / 7</span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <div className="mt-8 flex gap-3">
                    <input type="text" placeholder="New Habit..." className="bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-cyan-500" />
                    <button className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold text-sm uppercase hover:bg-cyan-500/30 transition-all">Add</button>
                </div>
            </div>
        </div>
    );
};
