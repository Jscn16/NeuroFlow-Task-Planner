import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, X } from 'lucide-react';
import { Task } from '../types';
import { TYPE_COLORS, TASK_CARD_BORDER_COLORS, TYPE_INDICATOR_COLORS } from '../constants';
import { taskCardVariants, completionVariants } from '../utils/animations';

interface TaskCardProps {
    task: Task;
    variant: 'board' | 'sidebar' | 'deepwork';
    index?: number;
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onToggleComplete: (taskId: string) => void;
    onStartFocus?: (taskId: string) => void;
    onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
    onDeleteTask?: (taskId: string) => void;
    onTaskDrop?: (sourceId: string, targetId: string) => void;
    showCompleted?: boolean;
}

const TaskCardComponent: React.FC<TaskCardProps> = ({
    task,
    variant,
    index,
    onDragStart,
    onToggleComplete,
    onStartFocus,
    onUpdateTask,
    onDeleteTask,
    onTaskDrop,
    showCompleted = true
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDuration, setEditedDuration] = useState(task.duration.toString());

    const isCompleted = task.status === 'completed';

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (variant === 'deepwork') return;
        setIsEditing(true);
        setEditedTitle(task.title);
        setEditedDuration(task.duration.toString());
    };

    const handleAcceptChanges = () => {
        const duration = parseInt(editedDuration) || task.duration;
        if (onUpdateTask) {
            onUpdateTask(task.id, {
                title: editedTitle.trim() || task.title,
                duration
            });
        }
        setIsEditing(false);
    };

    const handleDeleteTask = () => {
        if (onDeleteTask) {
            onDeleteTask(task.id);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAcceptChanges();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const sourceTaskId = e.dataTransfer.getData('taskId');
        if (sourceTaskId && sourceTaskId !== task.id && onTaskDrop) {
            onTaskDrop(sourceTaskId, task.id);
        }
    };

    // Edit mode rendering
    if (isEditing) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group flex flex-col gap-2 p-2.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] cursor-default"
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col min-w-0 flex-1 gap-1.5">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs font-medium rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] border border-[var(--border-primary)]"
                            autoFocus
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={editedDuration}
                                onChange={(e) => setEditedDuration(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-xs rounded px-2 py-1 w-16 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] border border-[var(--border-primary)]"
                            />
                            <span className="text-xs text-[var(--text-tertiary)]">min</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={handleAcceptChanges}
                            className="p-1.5 rounded bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/30 transition-colors"
                        >
                            <Check size={14} />
                        </button>
                        <button
                            onClick={handleDeleteTask}
                            className="p-1.5 rounded bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (variant === 'deepwork') {
        const shouldDim = isCompleted && !showCompleted;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{
                    opacity: shouldDim ? 0.2 : 1,
                    scale: 1,
                    y: 0,
                    transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        mass: 0.8,
                        duration: 0.3,
                    },
                }}
                whileHover={{
                    scale: 1.02,
                    y: -2,
                    opacity: shouldDim ? 0.4 : 1,
                    transition: {
                        duration: 0.2,
                        ease: [0.16, 1, 0.3, 1],
                    },
                }}
                className={`
                    relative flex items-center gap-3 p-4 rounded-lg border transition-all
                    ${isCompleted
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-primary)] hover:border-[var(--border-hover)]'
                    }
                `}
                onDoubleClick={handleDoubleClick}
            >
                {typeof index === 'number' && (
                    <div className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs flex items-center justify-center flex-shrink-0">
                        {index + 1}
                    </div>
                )}
                <div className={`w-1 h-8 rounded-full ${TYPE_INDICATOR_COLORS[task.type]} flex-shrink-0`} />
                <div className="flex flex-col min-w-0 flex-1">
                    <h3 className={`font-medium text-sm truncate transition-colors ${
                        isCompleted
                            ? 'text-green-700 dark:text-green-400 line-through'
                            : 'text-[var(--text-primary)]'
                    }`}>
                        {task.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mt-0.5">
                        <span className={`uppercase tracking-wider font-medium text-[10px] ${TYPE_COLORS[task.type]}`}>
                            {task.type}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {task.duration}m
                        </span>
                    </div>
                </div>
                {isCompleted && (
                    <motion.div
                        variants={completionVariants}
                        initial="initial"
                        animate="animate"
                        className="text-green-600 dark:text-green-400"
                    >
                        <Check size={18} />
                    </motion.div>
                )}
            </motion.div>
        );
    }

    const shouldDim = isCompleted && !showCompleted;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{
                opacity: shouldDim ? 0.2 : 1,
                scale: 1,
                y: 0,
                transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8,
                    duration: 0.3,
                },
            }}
            whileHover={{
                scale: 1.02,
                y: -2,
                opacity: shouldDim ? 0.4 : 1,
                transition: {
                    duration: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                },
            }}
            whileDrag={{ scale: 1.05, rotate: 1 }}
            draggable={!isEditing}
            onDragStart={(e) => {
                e.dataTransfer.setData('taskId', task.id);
                onDragStart(e as any, task.id);
            }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDoubleClick={handleDoubleClick}
            className={`
                relative group flex flex-col gap-1.5 p-2.5 rounded-lg border transition-all
                ${isCompleted
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30'
                    : `bg-[var(--bg-secondary)] border-[var(--border-primary)] hover:border-[var(--border-hover)] ${!isCompleted ? TASK_CARD_BORDER_COLORS[task.type] : ''}`
                }
                ${!isEditing ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
            `}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                        {isCompleted ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                {task.type}
                            </span>
                        ) : (
                            <>
                                <div className={`w-1.5 h-1.5 rounded-full ${TYPE_INDICATOR_COLORS[task.type]}`} />
                                <span className={`text-[9px] font-medium uppercase tracking-wider ${TYPE_COLORS[task.type]}`}>
                                    {task.type}
                                </span>
                            </>
                        )}
                    </div>
                    <h3 className={`font-medium text-xs leading-snug line-clamp-2 transition-colors ${
                        isCompleted
                            ? 'text-green-700 dark:text-green-400 line-through'
                            : 'text-[var(--text-primary)]'
                    }`}>
                        {task.title}
                    </h3>
                </div>

                {variant === 'board' && (
                    <motion.button
                        whileHover={{ 
                            scale: 1.15,
                            transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] }
                        }}
                        whileTap={{ 
                            scale: 0.85,
                            transition: { duration: 0.1, ease: [0.16, 1, 0.3, 1] }
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(task.id);
                        }}
                        className={`
                            flex-shrink-0 p-1.5 rounded-md transition-colors border
                            ${isCompleted
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30'
                                : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                            }
                        `}
                    >
                        <AnimatePresence mode="wait">
                            {isCompleted ? (
                                <motion.div
                                    key="check"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 180 }}
                                    transition={{ 
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 25,
                                        duration: 0.3
                                    }}
                                >
                                    <Check size={14} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="uncheck"
                                    initial={{ scale: 0, rotate: 180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: -180 }}
                                    transition={{ 
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 25,
                                        duration: 0.3
                                    }}
                                >
                                    <div className="w-3 h-3 rounded border border-[var(--border-primary)]" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                )}
            </div>

            <div className="flex items-center justify-between mt-0.5">
                <div className={`flex items-center gap-1 text-[10px] font-medium ${
                    isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-[var(--text-tertiary)]'
                }`}>
                    <Clock size={10} />
                    <span>{task.duration}m</span>
                </div>
            </div>

            {variant === 'sidebar' && !isCompleted && (
                <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full ${TYPE_INDICATOR_COLORS[task.type]}`}></div>
            )}
        </motion.div>
    );
};

// Memoize TaskCard to prevent unnecessary re-renders
export const TaskCard = memo(TaskCardComponent, (prevProps, nextProps) => {
    // Only re-render if task object changed, variant changed, or showCompleted changed
    return (
        prevProps.task.id === nextProps.task.id &&
        prevProps.task.title === nextProps.task.title &&
        prevProps.task.duration === nextProps.task.duration &&
        prevProps.task.status === nextProps.task.status &&
        prevProps.task.type === nextProps.task.type &&
        prevProps.variant === nextProps.variant &&
        prevProps.showCompleted === nextProps.showCompleted &&
        prevProps.index === nextProps.index
    );
});
