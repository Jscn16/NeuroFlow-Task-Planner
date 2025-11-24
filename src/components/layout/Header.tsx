import React from 'react';
import { CalendarDays, Target, Flame, Timer, ListChecks, Notebook, BarChart3 } from 'lucide-react';

interface HeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'planner', label: 'Planner', icon: CalendarDays },
        { id: 'eisenhower', label: 'Matrix', icon: Target },
        { id: 'focus', label: 'Deep Work', icon: Flame },
        { id: 'pomodoro', label: 'Timer', icon: Timer },
        { id: 'habits', label: 'Habits', icon: ListChecks },
        { id: 'notes', label: 'Journal', icon: Notebook },
        { id: 'analytics', label: 'Stats', icon: BarChart3 },
    ];

    return (
        <div className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-30 pointer-events-none">
            {/* Navigation Tabs - Centered Float */}
            <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-2xl bg-[#1e2338]/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl mx-auto mt-3">
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                              relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300
                              ${isActive
                                    ? 'text-white shadow-lg bg-white/[0.08]'
                                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                                }
                          `}
                        >
                            <Icon size={14} className={isActive ? 'text-cyan-400' : ''} />
                            <span>{tab.label}</span>
                            {isActive && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none border border-white/[0.05]"></div>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};
