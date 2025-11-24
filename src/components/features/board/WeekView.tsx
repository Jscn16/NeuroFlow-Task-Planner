import React from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { Task, GridRow } from '../../../types';
import { getWeekDays, formatDate, TARGET_HOURS_PER_DAY, ROW_CONFIG, DAYS } from '../../../constants';
import { TaskCard } from '../../TaskCard';
import { GridCell } from './GridCell';

interface WeekViewProps {
    tasks: Task[];
    currentDate: Date;
    onWeekChange: (direction: 'prev' | 'next') => void;
    isStacked: boolean;
    setIsStacked: (stacked: boolean) => void;
    onDropOnGrid: (e: React.DragEvent, day: Date, row: GridRow | null) => void;
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onToggleTaskComplete: (taskId: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
    tasks,
    currentDate,
    onWeekChange,
    isStacked,
    setIsStacked,
    onDropOnGrid,
    onDragStart,
    onToggleTaskComplete
}) => {
    const currentWeekDays = getWeekDays(currentDate);
    const todayStr = formatDate(new Date());
    const ROW_LABELS: GridRow[] = ['GOAL', 'FOCUS', 'WORK', 'LEISURE', 'CHORES'];

    const renderWeekStacked = () => (
        <div className="flex-grow flex relative mt-4 overflow-y-auto no-scrollbar gap-2">
            {currentWeekDays.map((day, i) => {
                const dayTasks = tasks.filter(t => t.status !== 'unscheduled' && t.dueDate === formatDate(day));
                const isToday = formatDate(day) === todayStr;

                return (
                    <div
                        key={i}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => onDropOnGrid(e, day, null)}
                        className={`
                            flex-1 w-0 flex flex-col p-1.5 border-r last:border-none rounded-xl gap-2
                            ${isToday
                                ? 'bg-cyan-500/[0.02] border border-cyan-500/20'
                                : 'border-white/[0.05]'
                            }
                        `}
                    >
                        {dayTasks
                            .sort((a, b) => {
                                const rowOrder: Record<string, number> = { 'GOAL': 0, 'FOCUS': 1, 'WORK': 2, 'LEISURE': 3, 'CHORES': 4 };
                                const aVal = rowOrder[a.assignedRow || ''] ?? 99;
                                const bVal = rowOrder[b.assignedRow || ''] ?? 99;
                                return aVal - bVal;
                            })
                            .map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    variant="board" // Always board variant for grid
                                    onDragStart={onDragStart}
                                    onToggleComplete={onToggleTaskComplete}
                                />
                            ))}
                    </div>
                );
            })}
        </div>
    );

    const renderWeekMatrix = () => (
        <div className="flex-grow flex flex-col relative mt-2 overflow-y-auto no-scrollbar pr-1">
            <div className="absolute top-0 left-2 text-[8px] font-bold text-slate-600 tracking-widest uppercase transform -translate-y-full mb-1">Mode</div>
            {ROW_LABELS.map(row => {
                const rowConfig = ROW_CONFIG[row];
                const style = rowConfig;
                return (
                    <div key={row} className={`${style.flexClass} shrink-0 flex border-b border-white/[0.05] last:border-b-0 group/row hover:bg-white/[0.01] transition-colors`}>
                        {/* Enhanced Label Column - Reduced width */}
                        <div className="w-16 shrink-0 flex flex-col items-center justify-center relative py-2 border-r border-white/[0.05]">
                            <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full ${style.barColor} opacity-60 group-hover/row:opacity-100 transition-opacity`}></div>
                            <rowConfig.icon size={14} className={`mb-1 ${style.color}`} />
                            <div className={`text-[8px] font-bold tracking-widest uppercase ${style.color} mb-0.5 scale-90`}>{rowConfig.label}</div>
                        </div>

                        {/* Columns */}
                        {currentWeekDays.map((day, i) => {
                            const dayTasks = tasks.filter(t => t.dueDate === formatDate(day) && t.status !== 'unscheduled');
                            const isDayEmpty = dayTasks.length === 0; // Determine if the day has no scheduled tasks
                            return (
                                <GridCell
                                    key={`${i}-${row}`}
                                    day={day}
                                    row={row}
                                    isToday={formatDate(day) === todayStr}
                                    tasks={tasks}
                                    onDrop={onDropOnGrid}
                                    onDragStart={onDragStart}
                                    onToggleComplete={onToggleTaskComplete}
                                    isDayEmpty={isDayEmpty}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="flex flex-col h-full font-sans text-slate-300 overflow-hidden">
            {/* Header - Compact & Moved Up - pt-1 removed */}
            <div className="flex items-center justify-between px-6 pb-2 shrink-0 relative z-20">
                <div className="flex flex-col justify-center">
                    <h1 className="text-xl font-display font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
                        Overview
                    </h1>
                    <p className="text-[10px] text-slate-400 font-medium ml-0.5">
                        {currentWeekDays[0].toLocaleDateString('en-US', { month: 'short' })} {currentWeekDays[0].getDate()} — {currentWeekDays[6].getDate()}, {currentWeekDays[0].getFullYear()}
                    </p>
                </div>

                {/* Centered Stack Button */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <button
                        onClick={() => setIsStacked(!isStacked)}
                        className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 shadow-lg backdrop-blur-md
                    ${isStacked
                                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                                : 'bg-white/[0.05] border-white/[0.1] text-slate-400 hover:text-white hover:bg-white/[0.1]'
                            }
                `}
                    >
                        <Layers size={12} />
                        <span className="text-[10px] font-bold tracking-widest uppercase">{isStacked ? 'Unstack' : 'Stack'}</span>
                    </button>
                </div>

                {/* Date Navigation - Moved up */}
                <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 border border-white/[0.05] shadow-inner backdrop-blur-md">
                    <button onClick={() => onWeekChange('prev')} className="px-3 py-1.5 hover:bg-white/[0.05] rounded-lg text-slate-400 hover:text-white transition-colors flex items-center justify-center">
                        <ChevronLeft size={14} />
                    </button>
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-300 uppercase tracking-wider">Week</div>
                    <button onClick={() => onWeekChange('next')} className="px-3 py-1.5 hover:bg-white/[0.05] rounded-lg text-slate-400 hover:text-white transition-colors flex items-center justify-center">
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Grid Body */}
            <div className="flex-grow flex flex-col px-4 pb-4 overflow-hidden relative">
                {/* Days Header - Significantly Scaled Up */}
                <div className={`flex ${isStacked ? 'pl-0' : 'pl-16'} pb-2 shrink-0 transition-all duration-300 pt-1 gap-0`}>
                    {currentWeekDays.map((day, i) => {
                        const isToday = formatDate(day) === todayStr;
                        const dayTasks = tasks.filter(t => t.dueDate === formatDate(day) && t.status !== 'unscheduled');
                        const totalMinutes = dayTasks.reduce((acc, t) => acc + t.duration, 0);

                        // Capacity Logic
                        const targetMinutesPerDay = TARGET_HOURS_PER_DAY * 60;
                        const percentage = Math.min(100, (totalMinutes / targetMinutesPerDay) * 100);

                        // Format planned hours/minutes
                        const plannedHours = totalMinutes / 60;
                        let plannedDurationText: string;
                        if (totalMinutes === 0) {
                            plannedDurationText = '0h planned';
                        } else if (plannedHours < 1) {
                            plannedDurationText = `${totalMinutes}m`;
                        } else {
                            plannedDurationText = `${plannedHours.toFixed(1).replace(/\.0$/, '')}h`;
                        }

                        // Color Logic for text and bar fill - Simplified per spec for "Quiet Grid"
                        const statTextColor = 'text-slate-500/80';
                        const barFillColor = 'bg-cyan-500/80'; // Always category-neutral color
                        const dayHeaderCaption = totalMinutes === 0 ? 'Free day' : '';

                        return (
                            <div key={i} className="flex-1 w-0 text-center relative group px-1">
                                <div className={`
                        flex flex-col items-center py-2 px-1 rounded-xl transition-all relative 
                        ${isToday
                                        ? 'bg-gradient-to-b from-[#1e293b] to-transparent border-t border-cyan-500/30 text-cyan-50 shadow-[0_-5px_20px_rgba(6,182,212,0.1)] z-10'
                                        : 'border-transparent'
                                    }
                    `}>
                                    {/* Enlarged Day Name - Adjusted contrast */}
                                    <span className={`text-xs font-black uppercase tracking-widest opacity-80 mb-0 ${isToday ? 'text-cyan-400' : 'text-slate-400'}`}>{DAYS[i]}</span>

                                    {/* Massive Date Number - Scaled to 4xl */}
                                    <span className={`text-4xl font-display font-black leading-none ${isToday ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'text-slate-400'}`}>{day.getDate()}</span>

                                    {/* Optional "Free day" caption */}
                                    {dayHeaderCaption && (
                                        <span className="text-[10px] text-slate-600/70">{dayHeaderCaption}</span>
                                    )}

                                    {/* Ultra-thin Capacity Bar + Capacity Text */}
                                    <div className="w-full mt-2 flex flex-col items-center">
                                        {/* Bar Track */}
                                        <div className="w-full h-1 relative rounded-full bg-slate-800/30 overflow-hidden">
                                            {/* Bar Fill */}
                                            <div
                                                className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ease-out ${barFillColor} rounded-full`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>

                                        {/* Text Overlay - Small, muted capacity text */}
                                        <div className={`text-[10px] mt-1 font-medium ${statTextColor} transition-colors`}>
                                            {dayTasks.length} tasks · {plannedDurationText}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Rows */}
                {isStacked ? renderWeekStacked() : renderWeekMatrix()}
            </div>
        </div>
    );
};
