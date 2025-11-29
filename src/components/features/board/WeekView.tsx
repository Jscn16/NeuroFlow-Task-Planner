import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Task, GridRow } from '../../../types';
import { getWeekDays, formatDate, TARGET_HOURS_PER_DAY, ROW_CONFIG, DAYS, getAdjustedDate } from '../../../constants';
import { TaskCard } from '@/components/TaskCard';
import { GridCell } from './GridCell';
import { staggerContainer } from '../../../utils/animations';

interface WeekViewProps {
    tasks: Task[];
    currentDate: Date;
    isStacked: boolean;
    onDropOnGrid: (e: React.DragEvent, day: Date, row: GridRow | null) => void;
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onToggleTaskComplete: (taskId: string) => void;
    onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
    onDeleteTask?: (taskId: string) => void;
    onTaskDrop?: (sourceId: string, targetId: string) => void;
    showCompleted?: boolean;
}

export const WeekView: React.FC<WeekViewProps> = ({
    tasks,
    currentDate,
    isStacked,
    onDropOnGrid,
    onDragStart,
    onToggleTaskComplete,
    onUpdateTask,
    onDeleteTask,
    onTaskDrop,
    showCompleted
}) => {
    // Memoize expensive computations
    const currentWeekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
    const todayStr = useMemo(() => formatDate(getAdjustedDate()), []);
    const ROW_LABELS: GridRow[] = ['GOAL', 'FOCUS', 'WORK', 'LEISURE', 'CHORES'];

    // Memoize task filtering functions
    const getTasksForDay = useMemo(() => (day: Date) => {
        const dayStr = formatDate(day);
        return tasks.filter(t =>
            t.status !== 'unscheduled' &&
            t.dueDate === dayStr
        );
    }, [tasks]);

    const renderWeekStacked = () => (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex-grow flex relative mt-0 overflow-y-auto no-scrollbar gap-2"
        >
            {currentWeekDays.map((day, i) => {
                const dayTasks = getTasksForDay(day);
                const isToday = formatDate(day) === todayStr;

                return (
                    <motion.div
                        key={i}
                        variants={staggerContainer}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => onDropOnGrid(e, day, null)}
                        className={`
                            flex-1 w-0 flex flex-col p-2 border-r last:border-none rounded-lg gap-2 transition-colors
                            ${isToday
                                ? 'bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]/20'
                                : 'border-[var(--border-primary)]'
                            }
                        `}
                    >
                        {dayTasks
                            .sort((a, b) => {
                                const rowOrder: Record<string, number> = { 'GOAL': 0, 'FOCUS': 1, 'WORK': 2, 'LEISURE': 3, 'CHORES': 4 };
                                const aVal = rowOrder[a.assignedRow || ''] ?? 99;
                                const bVal = rowOrder[b.assignedRow || ''] ?? 99;
                                const indexA = tasks.findIndex(t => t.id === a.id);
                                const indexB = tasks.findIndex(t => t.id === b.id);
                                return (aVal - bVal) || (indexA - indexB);
                            })
                            .map((task, taskIndex) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: taskIndex * 0.05, duration: 0.2 }}
                                >
                                    <TaskCard
                                        task={task}
                                        variant="board"
                                        onDragStart={onDragStart}
                                        onUpdateTask={onUpdateTask}
                                        onDeleteTask={onDeleteTask}
                                        onToggleComplete={onToggleTaskComplete}
                                        onTaskDrop={onTaskDrop}
                                        showCompleted={showCompleted}
                                    />
                                </motion.div>
                            ))}
                    </motion.div>
                );
            })}
        </motion.div>
    );

    const renderWeekMatrix = () => (
        <div className="flex-grow flex flex-col relative mt-0 overflow-y-auto no-scrollbar pr-1">
            {ROW_LABELS.map(row => {
                const rowConfig = ROW_CONFIG[row];
                return (
                    <div
                        key={row}
                        className={`${rowConfig.flexClass} shrink-0 flex border-b border-[var(--border-primary)] last:border-b-0 group/row hover:bg-[var(--bg-hover)] transition-colors`}
                    >
                        {/* Label Column */}
                        <div className="w-16 shrink-0 flex flex-col items-center justify-center relative py-2 border-r border-[var(--border-primary)]">
                            <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full ${rowConfig.barColor} opacity-50 group-hover/row:opacity-100 transition-opacity`}></div>
                            <rowConfig.icon size={14} className={`mb-1 ${rowConfig.color}`} />
                            <div className={`text-[9px] font-medium tracking-wider uppercase ${rowConfig.color}`}>
                                {rowConfig.label}
                            </div>
                        </div>

                        {/* Columns */}
                        {currentWeekDays.map((day, i) => {
                            const dayTasks = tasks.filter(t => {
                                if (t.status === 'unscheduled') return false;
                                if (t.dueDate !== formatDate(day)) return false;
                                return true;
                            });
                            const isDayEmpty = dayTasks.length === 0;
                            return (
                                <GridCell
                                    key={`${i}-${row}`}
                                    day={day}
                                    row={row}
                                    isToday={formatDate(day) === todayStr}
                                    tasks={tasks}
                                    onDrop={onDropOnGrid}
                                    onDragStart={onDragStart}
                                    onUpdateTask={onUpdateTask}
                                    onDeleteTask={onDeleteTask}
                                    onToggleComplete={onToggleTaskComplete}
                                    isDayEmpty={isDayEmpty}
                                    onTaskDrop={onTaskDrop}
                                    showCompleted={showCompleted}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="flex flex-col h-full font-sans text-[var(--text-primary)] overflow-hidden">
            {/* Grid Body */}
            <div className="flex-grow flex flex-col px-4 pb-4 overflow-hidden relative">
                {/* Days Header */}
                <div className={`flex ${isStacked ? 'pl-0' : 'pl-16'} pb-2 shrink-0 transition-all duration-300 pt-2 gap-1`}>
                    {currentWeekDays.map((day, i) => {
                        const isToday = formatDate(day) === todayStr;
                        const dayTasks = getTasksForDay(day);
                        const totalMinutes = dayTasks.reduce((acc, t) => acc + t.duration, 0);

                        // Capacity Logic
                        const targetMinutesPerDay = TARGET_HOURS_PER_DAY * 60;
                        const percentage = Math.min(100, (totalMinutes / targetMinutesPerDay) * 100);

                        // Format planned hours/minutes
                        const plannedHours = totalMinutes / 60;
                        let plannedDurationText: string;
                        if (totalMinutes === 0) {
                            plannedDurationText = '0h';
                        } else if (plannedHours < 1) {
                            plannedDurationText = `${totalMinutes}m`;
                        } else {
                            plannedDurationText = `${plannedHours.toFixed(1).replace(/\.0$/, '')}h`;
                        }

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.2 }}
                                className="flex-1 w-0 text-center relative group px-1"
                            >
                                <div className={`
                                    flex flex-col items-center py-2 px-1 rounded-lg transition-all relative
                                    ${isToday
                                        ? 'bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30'
                                        : 'border border-transparent hover:border-[var(--border-primary)]'
                                    }
                                `}>
                                    {/* Day Name */}
                                    <span className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                                        isToday ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]'
                                    }`}>
                                        {DAYS[i]}
                                    </span>

                                    {/* Date Number */}
                                    <span className={`text-2xl font-medium leading-none mb-1 ${
                                        isToday ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                                    }`}>
                                        {day.getDate()}
                                    </span>

                                    {/* Capacity Bar */}
                                    <div className="w-full mt-2 flex flex-col items-center">
                                        <div className="w-full h-0.5 relative rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                                className={`absolute left-0 top-0 bottom-0 ${isToday ? 'bg-[var(--accent-primary)]' : 'bg-[var(--text-tertiary)]'} rounded-full`}
                                            />
                                        </div>

                                        {/* Capacity Text */}
                                        <div className={`mt-1.5 text-[10px] font-medium text-[var(--text-tertiary)]`}>
                                            {dayTasks.length} tasks · {plannedDurationText}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Rows */}
                {isStacked ? renderWeekStacked() : renderWeekMatrix()}
            </div>
        </div>
    );
};
