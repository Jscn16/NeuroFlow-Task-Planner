import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, GridRow } from '../../../types';
import { getWeekDays, formatDate, TARGET_HOURS_PER_DAY, ROW_CONFIG, DAYS, getAdjustedDate } from '../../../constants';
import { TaskCard } from '@/components/TaskCard';
import { GridCell } from './GridCell';
import { WeekStackedView } from './WeekStackedView';
import { WeekMatrixView } from './WeekMatrixView';
import { CheckCircle2 } from 'lucide-react';
import { weekSwitch, fadeLift } from '../../../utils/animations';

interface WeekViewProps {
    tasks: Task[];
    currentDate: Date;
    weekDirection: 'next' | 'prev';
    isStacked: boolean;
    onDropOnGrid: (e: React.DragEvent, day: Date, row: GridRow | null) => void;
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onToggleTaskComplete: (taskId: string) => void;
    onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
    onDeleteTask?: (taskId: string) => void;
    onTaskDrop?: (sourceId: string, targetId: string) => void;
    viewMode: 'show' | 'fade' | 'hide';
}

// Progress color: 0% = Red (nothing done), 100% = Green (all done)
const getGradientColor = (percent: number): string => {
    const p = Math.max(0, Math.min(100, percent));

    // Red (0%) -> Yellow (50%) -> Green (100%)
    if (p <= 50) {
        // Red to Yellow: (239, 68, 68) to (250, 204, 21)
        const r = Math.round(239 + (250 - 239) * (p / 50));
        const g = Math.round(68 + (204 - 68) * (p / 50));
        const b = Math.round(68 + (21 - 68) * (p / 50));
        return `rgb(${r}, ${g}, ${b})`;
    } else {
        // Yellow to Green: (250, 204, 21) to (34, 197, 94)
        const r = Math.round(250 + (34 - 250) * ((p - 50) / 50));
        const g = Math.round(204 + (197 - 204) * ((p - 50) / 50));
        const b = Math.round(21 + (94 - 21) * ((p - 50) / 50));
        return `rgb(${r}, ${g}, ${b})`;
    }
};

export const WeekView = React.memo<WeekViewProps>(({
    tasks,
    currentDate,
    weekDirection,
    isStacked,
    onDropOnGrid,
    onDragStart,
    onToggleTaskComplete,
    onUpdateTask,
    onDeleteTask,
    onTaskDrop,
    viewMode
}) => {
    const currentWeekDays = getWeekDays(currentDate);
    const todayStr = formatDate(getAdjustedDate());

    // Generate a unique key for the current week
    const weekKey = formatDate(currentWeekDays[0]);

    return (
        <div className="flex flex-col h-full font-sans overflow-hidden" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex-grow flex flex-col px-4 pb-4 overflow-hidden relative">
                {/* Days Header */}
                <div className={`flex ${isStacked ? 'pl-0' : 'pl-20'} pb-0 shrink-0 transition-all duration-300 pt-1 gap-0`}>
                    {currentWeekDays.map((day, i) => {
                        const isToday = formatDate(day) === todayStr;
                        const dateStr = formatDate(day);

                        // Calculate stats from live tasks (including rescheduled for denominator)
                        const dayTasks = tasks.filter(t => t.dueDate === dateStr && t.status !== 'unscheduled');
                        const completedTasks = dayTasks.filter(t => t.status === 'completed');

                        const totalMinutes = dayTasks.reduce((acc, t) => acc + t.duration, 0);
                        const completedMinutes = completedTasks.reduce((acc, t) => acc + t.duration, 0);
                        const targetMinutesPerDay = TARGET_HOURS_PER_DAY * 60;

                        const plannedPercent = Math.min(100, (totalMinutes / targetMinutesPerDay) * 100);

                        // Completion Rate: Completed / (Completed + Remaining + Rescheduled)
                        const completionPercent = totalMinutes > 0 ? Math.round((completedMinutes / totalMinutes) * 100) : 0;

                        const plannedHours = (totalMinutes / 60).toFixed(1).replace(/\.0$/, '');
                        const completionColor = getGradientColor(completionPercent);

                        const isOverCapacity = plannedPercent > 100;
                        const isNearCapacity = plannedPercent > 80;

                        // Check if day is in the past (strictly before today)
                        const todayDate = new Date(todayStr);
                        const currentDayDate = new Date(formatDate(day));
                        const isPastDay = currentDayDate < todayDate;

                        // Apply subtle styling for past completed days
                        const isSubtle = isPastDay;

                        return (
                            <div key={i} className="flex-1 w-0 text-center relative group px-1">
                                <div
                                    className="flex flex-col items-center py-3 px-2 rounded-t-2xl transition-all duration-300 relative"
                                    style={{
                                        background: isToday ? 'rgba(255,255,255,0.02)' : 'transparent',
                                        borderLeft: isToday ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                        borderRight: isToday ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                        borderTop: isToday ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                        boxShadow: isToday ? '0 0 20px rgba(34,211,238,0.15)' : 'none',
                                        zIndex: isToday ? 10 : 'auto',
                                        opacity: isPastDay ? 0.85 : 1
                                    }}
                                >
                                    {/* Day Name */}
                                    <span
                                        className="text-[11px] font-black uppercase tracking-widest mb-0.5"
                                        style={{ color: isToday ? 'var(--accent)' : 'var(--text-muted)', opacity: isToday ? 1 : 0.6 }}
                                    >
                                        {DAYS[i]}
                                    </span>

                                    {/* Date Number */}
                                    <span
                                        className="text-4xl font-display font-black leading-none transition-all duration-300"
                                        style={{
                                            color: isToday ? 'var(--text-primary)' : 'var(--text-muted)',
                                            textShadow: isToday ? '0 0 20px rgba(255,255,255,0.2)' : 'none',
                                            opacity: isToday ? 1 : 0.5
                                        }}
                                    >
                                        {day.getDate()}
                                    </span>

                                    {/* Workload Indicator */}
                                    <div className="w-full mt-3 flex flex-col items-center gap-1.5">
                                        <div
                                            className="text-xs font-extrabold transition-colors"
                                            style={{
                                                color: isOverCapacity
                                                    ? 'var(--error)'
                                                    : isNearCapacity
                                                        ? 'var(--warning)'
                                                        : 'var(--text-muted)',
                                                opacity: totalMinutes > 0 ? 1 : 0.4
                                            }}
                                        >
                                            {totalMinutes > 0 ? `${plannedHours}h / ${TARGET_HOURS_PER_DAY}h` : '—'}
                                        </div>

                                        {totalMinutes > 0 && (
                                            <div className="w-full flex flex-col items-center gap-1">
                                                <div
                                                    className="w-full h-2 rounded-full overflow-hidden relative"
                                                    style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                                                >
                                                    <motion.div
                                                        className="absolute left-0 top-0 bottom-0 rounded-full"
                                                        initial={false}
                                                        animate={{
                                                            width: `${completionPercent}%`,
                                                            backgroundColor: completionColor,
                                                            opacity: isSubtle ? 0.4 : 1,
                                                            boxShadow: (completionPercent > 0 && !isSubtle) ? `0 0 10px ${completionColor}50` : 'none'
                                                        }}
                                                        transition={{ type: "spring", stiffness: 40, damping: 15 }}
                                                    />
                                                </div>

                                                <div
                                                    className="flex items-center gap-1"
                                                    style={{ opacity: isSubtle ? 0.4 : 1 }}
                                                >
                                                    {completionPercent >= 100 && (
                                                        <CheckCircle2 size={12} style={{ color: completionColor }} />
                                                    )}
                                                    <span
                                                        className="text-[11px] font-extrabold"
                                                        style={{ color: completionColor }}
                                                    >
                                                        {completionPercent}% done
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Rows */}
                <AnimatePresence mode="wait">
                    {isStacked ? (
                        <WeekStackedView
                            weekKey={weekKey}
                            weekDirection={weekDirection}
                            currentWeekDays={currentWeekDays}
                            tasks={tasks}
                            todayStr={todayStr}
                            viewMode={viewMode}
                            onDropOnGrid={onDropOnGrid}
                            onDragStart={onDragStart}
                            onUpdateTask={onUpdateTask}
                            onDeleteTask={onDeleteTask}
                            onToggleTaskComplete={onToggleTaskComplete}
                            onTaskDrop={onTaskDrop}
                        />
                    ) : (
                        <WeekMatrixView
                            weekKey={weekKey}
                            weekDirection={weekDirection}
                            currentWeekDays={currentWeekDays}
                            tasks={tasks}
                            todayStr={todayStr}
                            viewMode={viewMode}
                            onDropOnGrid={onDropOnGrid}
                            onDragStart={onDragStart}
                            onUpdateTask={onUpdateTask}
                            onDeleteTask={onDeleteTask}
                            onToggleTaskComplete={onToggleTaskComplete}
                            onTaskDrop={onTaskDrop}
                        />
                    )}
                </AnimatePresence>
            </div >
        </div >
    );
});
