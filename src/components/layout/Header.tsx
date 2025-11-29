import React from 'react';
import { CalendarDays, Target, ListChecks, Notebook, BarChart3, Layers, ChevronLeft, ChevronRight, Moon } from 'lucide-react';
import { formatDate, getWeekDays, isLateNight } from '../../constants';

interface HeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    currentDate: Date;
    onWeekChange: (direction: 'prev' | 'next') => void;
    isStacked: boolean;
    setIsStacked: (stacked: boolean) => void;
    showCompleted: boolean;
    setShowCompleted: (show: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
    activeTab,
    setActiveTab,
    currentDate,
    onWeekChange,
    isStacked,
    setIsStacked,
    showCompleted,
    setShowCompleted
}) => {
    const currentWeekDays = getWeekDays(currentDate);
    const isLateNightSession = isLateNight();

    const tabs = [
        { id: 'planner', label: 'Planner', icon: CalendarDays },
        { id: 'focus', label: 'Deep Work', icon: Target },
        { id: 'braindump', label: 'Brain Dump', icon: Notebook },
        { id: 'habits', label: 'Habits', icon: ListChecks },
        { id: 'analytics', label: 'Stats', icon: BarChart3 },
    ];

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] sticky top-0 z-50">
            {/* LEFT: Overview & Date */}
            <div className="flex flex-col justify-center pointer-events-auto min-w-[200px]">
                <h1 className="text-lg font-medium text-[var(--text-primary)]">
                    Overview
                </h1>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                    {currentWeekDays[0].toLocaleDateString('en-US', { month: 'short' })} {currentWeekDays[0].getDate()} — {currentWeekDays[6].getDate()}, {currentWeekDays[0].getFullYear()}
                </p>
            </div>

            {/* CENTER: Navigation Tabs & Stack Toggle */}
            <div className="pointer-events-auto flex items-center gap-2">
                {/* View Options Toggle - Always visible in Planner mode */}
                {activeTab === 'planner' && (
                    <button
                        onClick={() => setShowCompleted(!showCompleted)}
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all
                            ${showCompleted
                                ? 'bg-[var(--bg-tertiary)] border-[var(--border-hover)] text-[var(--text-primary)]'
                                : 'bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                            }
                        `}
                        title={showCompleted ? "Fade Completed Tasks" : "Show Completed Tasks"}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full ${showCompleted ? 'bg-green-500/30' : 'bg-green-500'}`} />
                        <span className="text-xs font-medium">
                            {showCompleted ? 'Fade Done' : 'Show Done'}
                        </span>
                    </button>
                )}

                {/* Stack Toggle (Only visible on Planner tab) */}
                {activeTab === 'planner' && (
                    <button
                        onClick={() => setIsStacked(!isStacked)}
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all
                            ${isStacked
                                ? 'bg-[var(--bg-tertiary)] border-[var(--border-hover)] text-[var(--text-primary)]'
                                : 'bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
                            }
                        `}
                    >
                        <Layers size={14} />
                        <span className="text-xs font-medium">{isStacked ? 'Unstack' : 'Stack'}</span>
                    </button>
                )}

                {/* Main Menu */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)]">
                    {tabs.map(tab => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                                    ${isActive
                                        ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                                    }
                                `}
                            >
                                <Icon size={14} />
                                <span>{tab.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* RIGHT: Week Navigation & Late Night Badge */}
            <div className="pointer-events-auto flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[var(--bg-primary)] rounded-lg p-1 border border-[var(--border-primary)] min-w-[100px] justify-center">
                    <button
                        onClick={() => onWeekChange('prev')}
                        className="px-2 py-1 hover:bg-[var(--bg-hover)] rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <div className="px-2 py-1 text-xs font-medium text-[var(--text-secondary)]">Week</div>
                    <button
                        onClick={() => onWeekChange('next')}
                        className="px-2 py-1 hover:bg-[var(--bg-hover)] rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>

                {/* Late Night Badge */}
                {isLateNightSession && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-secondary)]">
                        <Moon size={12} />
                        <span className="text-xs font-medium">Late Night</span>
                    </div>
                )}
            </div>
        </div>
    );
};
