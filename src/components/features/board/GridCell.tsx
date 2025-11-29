import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Task, GridRow } from '../../../types';
import { formatDate, ROW_CONFIG } from '../../../constants';
import { TaskCard } from '@/components/TaskCard';

interface GridCellProps {
    day: Date;
    row: GridRow;
    isToday: boolean;
    tasks: Task[];
    onDrop: (e: React.DragEvent, day: Date, row: GridRow) => void;
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onToggleComplete: (taskId: string) => void;
    onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
    onDeleteTask?: (taskId: string) => void;
    isDayEmpty: boolean;
    onTaskDrop?: (sourceId: string, targetId: string) => void;
    showCompleted?: boolean;
}

export const GridCell: React.FC<GridCellProps> = ({
    day,
    row,
    isToday,
    tasks,
    onDrop,
    onDragStart,
    onToggleComplete,
    onUpdateTask,
    onDeleteTask,
    isDayEmpty,
    onTaskDrop,
    showCompleted = true
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const dayStr = formatDate(day);
    const cellTasks = tasks.filter(t => {
        if (t.status === 'unscheduled') return false;
        if (t.dueDate !== dayStr) return false;
        if (t.assignedRow !== row) return false;
        return true;
    });

    // Define visual slots per category
    const slotCount = row === 'GOAL' ? 1 : 3;

    // Render tasks up to the slotCount
    const visibleTasks = cellTasks.slice(0, slotCount);
    const emptySlotsToRender = slotCount - visibleTasks.length;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        setIsDragOver(false);
        onDrop(e, day, row);
    };

    return (
        <motion.div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            title={`${ROW_CONFIG[row].label}: ${ROW_CONFIG[row].description}`}
            className={`
                relative flex-1 w-0 transition-colors group/cell
                ${isToday
                    ? 'border-l border-r border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5'
                    : 'border-r border-[var(--border-primary)] last:border-r-0'
                }
                flex flex-col p-1 gap-1.5
            `}
        >
            {/* Render actual tasks */}
            {visibleTasks.map((task, index) => (
                <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                >
                    <TaskCard
                        task={task}
                        variant="board"
                        onDragStart={onDragStart}
                        onUpdateTask={onUpdateTask}
                        onDeleteTask={onDeleteTask}
                        onToggleComplete={onToggleComplete}
                        onTaskDrop={onTaskDrop}
                        showCompleted={showCompleted}
                    />
                </motion.div>
            ))}

            {/* Empty slots container - spans across all empty slots when dragging */}
            {emptySlotsToRender > 0 && (
                <div className="relative flex-1 flex flex-col gap-1.5">
                    {/* "Add Task" overlay that spans all empty slots when dragging */}
                    <AnimatePresence>
                        {isDragOver && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                            >
                                <div className="bg-[var(--bg-tertiary)]/70 backdrop-blur-sm border border-[var(--border-primary)] rounded-lg px-4 py-2.5 flex items-center gap-2 shadow-sm">
                                    <Plus size={16} className="text-[var(--text-secondary)]" />
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">Add Task</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Individual ghost slots */}
                    {Array.from({ length: emptySlotsToRender }).map((_, index) => (
                        <motion.div
                            key={`ghost-${index}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: (visibleTasks.length + index) * 0.05 }}
                            className={`
                                flex-1 relative w-full group/slot min-h-0
                                ${row === 'GOAL' ? 'min-h-[4rem]' : 'min-h-[3rem]'}
                            `}
                        >
                            <div className={`
                                absolute inset-0 rounded-lg border border-dashed
                                ${isDragOver 
                                    ? 'border-[var(--border-hover)] bg-[var(--bg-hover)]/20' 
                                    : 'border-[var(--border-secondary)]'
                                }
                                group-hover/slot:border-[var(--border-hover)] group-hover/slot:bg-[var(--bg-hover)]/20
                                flex items-center justify-center transition-all duration-200
                            `}>
                                {!isDragOver && (
                                    <Plus
                                        size={14}
                                        className="text-[var(--text-tertiary)] opacity-0 group-hover/slot:opacity-100 transition-opacity duration-200"
                                    />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};
