import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, X, AlertCircle, ArrowRight } from 'lucide-react';
import { Task } from '../types';
import { TYPE_COLORS, TASK_CARD_BORDER_COLORS, TYPE_INDICATOR_COLORS } from '../constants';
import { cardHover, checkbox } from '../utils/animations';

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
    isOverdue?: boolean;
    viewMode?: 'show' | 'fade' | 'hide';
}

export const TaskCard = React.memo<TaskCardProps>(({
    task,
    variant,
    index,
    onDragStart,
    onToggleComplete,
    onStartFocus,
    onUpdateTask,
    onDeleteTask,

    onTaskDrop,
    isOverdue,
    viewMode = 'show'
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDuration, setEditedDuration] = useState(task.duration.toString());
    const [isDragging, setIsDragging] = useState(false);

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

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.effectAllowed = 'move';
        setIsDragging(true);
        onDragStart(e, task.id);

        // Delay opacity change to ensure browser captures full-opacity drag image
        setTimeout(() => {
            if (e.target) {
                (e.target as HTMLElement).style.opacity = '0.5';
            }
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        setIsDragging(false);
        (e.target as HTMLElement).style.opacity = '1';
    };

    // Format duration nicely
    const formatDuration = (mins: number) => {
        if (mins < 60) return `${mins} min`;
        const hours = Math.floor(mins / 60);
        const remaining = mins % 60;
        if (remaining === 0) return `${hours}h`;
        return `${hours}h ${remaining}m`;
    };

    // Rescheduled "Ghost Trail" variant
    if (task.status === 'rescheduled') {
        return (
            <div className="flex items-center gap-2 px-2 py-1 rounded border border-dashed border-zinc-700/50 bg-zinc-800/20 select-none">
                <ArrowRight size={12} className="text-zinc-500" />
                <span className="text-[11px] text-zinc-500 truncate flex-1 font-medium">
                    {task.title}
                </span>
                <span className="text-[10px] text-zinc-600">
                    Rescheduled
                </span>
            </div>
        );
    }

    // Edit mode rendering
    if (isEditing) {
        return (
            <div
                className="relative flex flex-col gap-2 p-3 rounded-xl border backdrop-blur-md animate-in zoom-in-95 duration-200"
                style={{
                    backgroundColor: 'color-mix(in srgb, var(--bg-tertiary) 90%, transparent)',
                    borderColor: 'var(--accent)'
                }}
            >
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col min-w-0 flex-1 gap-2">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-black/20 text-sm font-medium rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-1 transition-all"
                            style={{
                                color: 'var(--text-primary)',
                                '--tw-ring-color': 'var(--accent)'
                            } as React.CSSProperties}
                            autoFocus
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={editedDuration}
                                onChange={(e) => setEditedDuration(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="bg-black/20 text-xs rounded-lg px-3 py-1.5 w-16 focus:outline-none focus:ring-1 transition-all"
                                style={{
                                    color: 'var(--text-muted)',
                                    '--tw-ring-color': 'var(--accent)'
                                } as React.CSSProperties}
                            />
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>min</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex gap-1.5">
                            <button
                                onClick={handleAcceptChanges}
                                className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all"
                                title="Save changes"
                            >
                                <Check size={14} />
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 rounded-lg bg-zinc-500/20 text-zinc-400 hover:bg-zinc-500/30 transition-all"
                                title="Cancel editing"
                            >
                                <X size={14} />
                            </button>
                        </div>
                        <button
                            onClick={handleDeleteTask}
                            className="px-2 py-1 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all text-[10px] font-bold uppercase"
                            title="Delete task"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Deep work variant
    if (variant === 'deepwork') {
        const baseBg = isCompleted
            ? 'bg-emerald-500/10 border-emerald-500/20'
            : 'bg-white/[0.06] border-white/5';

        return (
            <div
                className={`${baseBg} rounded-2xl px-5 py-4 flex items-center justify-between hover:border-emerald-400/40 hover:bg-emerald-500/20 transition-all duration-300 gap-4 border cursor-pointer`}
                onDoubleClick={handleDoubleClick}
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {typeof index === 'number' && (
                        <div className="w-8 h-8 rounded-full bg-zinc-800/80 text-zinc-300 text-sm flex items-center justify-center flex-shrink-0 font-bold">
                            {index + 1}
                        </div>
                    )}
                    <div className={`w-1.5 h-12 rounded-full ${TYPE_INDICATOR_COLORS[task.type]} flex-shrink-0`} />
                    <div className="flex flex-col min-w-0 gap-1">
                        <h3 className={`font-semibold text-base truncate transition-colors ${isCompleted ? 'text-emerald-400 decoration-emerald-500/50' : 'text-zinc-200'}`}>
                            {task.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <span className={`uppercase tracking-wider font-bold text-[11px] ${TYPE_COLORS[task.type]}`}>
                                {task.type}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {task.duration}m
                            </span>
                        </div>
                    </div>
                </div>
                {isCompleted && (
                    <div className="text-emerald-300 animate-in zoom-in duration-300">
                        <Check size={24} />
                    </div>
                )}
            </div>
        );
    }

    // Board variant - Optimized layout (Icon-Only Overdue Indicator)
    if (variant === 'board') {
        const baseOpacity = isCompleted ? (viewMode === 'fade' ? 0.6 : 1) : 1;
        const hoverOpacity = isCompleted ? (viewMode === 'fade' ? 0.8 : 1) : 1;

        return (
            <motion.div
                draggable={!isEditing}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDoubleClick={handleDoubleClick}
                initial={false}
                animate={{
                    scale: isCompleted ? 1 : 1,
                    opacity: isOverdue ? 1 : baseOpacity // Force opacity 1 for overdue
                }}
                whileHover={{
                    scale: 1.01,
                    opacity: isOverdue ? 1 : hoverOpacity,
                    transition: { duration: 0.15, ease: 'easeOut' }
                }}
                whileTap={{ scale: 0.98 }}
                className={`
                    relative flex flex-row items-center justify-between gap-3 py-3 px-3 rounded-lg border min-h-[70px]
                    cursor-grab active:cursor-grabbing
                    ${isDragging ? '' : ''}
                    ${isOverdue && !isCompleted
                        ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.15)]'
                        : isCompleted
                            ? 'bg-emerald-900/20 border-emerald-500/20'
                            : `bg-white/[0.04] border-white/[0.08] ${TASK_CARD_BORDER_COLORS[task.type]} border-l-[3px]`
                    }
                `}
            >
                {/* Absolute Overdue Icon Indicator */}
                {isOverdue && !isCompleted && (
                    <div className="absolute -top-1.5 -right-1.5 z-10 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white shadow-sm ring-2 ring-[#09090b]">
                        <AlertCircle size={12} strokeWidth={3} />
                    </div>
                )}

                {/* Left Side: Title (Vertically Centered) */}
                <div className="flex-1 flex items-center min-w-0">
                    <h3
                        className={`font-medium text-base leading-tight whitespace-normal break-words pr-2`}
                        style={{ color: isCompleted ? '#f1f5f9' : 'var(--text-primary)' }}
                    >
                        {task.title}
                    </h3>
                </div>

                {/* Right Side: Simple Stack (Checkbox -> Time) */}
                <div className="flex flex-col items-center justify-center gap-1 flex-shrink-0 w-12">
                    {/* Checkbox */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(task.id);
                        }}
                        className={`
                            w-6 h-6 rounded flex items-center justify-center
                            transition-all duration-200
                            ${isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-white/[0.1] text-zinc-500 hover:bg-emerald-500/20 hover:text-emerald-400'}
                        `}
                    >
                        {isCompleted ? (
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1, rotate: [0, 3, 0] }}
                                transition={{ duration: 0.14, ease: 'easeOut' }}
                            >
                                <Check size={14} strokeWidth={3} />
                            </motion.div>
                        ) : (
                            <Check size={14} strokeWidth={3} className="opacity-0 group-hover:opacity-100" />
                        )}
                    </button>

                    {/* Duration Pill */}
                    <span
                        className={`text-[12px] font-mono leading-none text-center ${isCompleted ? 'text-emerald-400/80' : 'text-zinc-500'}`}
                    >
                        {formatDuration(task.duration)}
                    </span>
                </div>
            </motion.div>
        );
    }

    // Sidebar variant
    return (
        <motion.div
            draggable={!isEditing}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDoubleClick={handleDoubleClick}
            whileHover={{
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
            transition={{ duration: 0.15 }}
            className={`
                relative flex flex-col gap-2 p-3 rounded-xl border
                cursor-grab active:cursor-grabbing
                ${isDragging ? '' : ''}
                ${isCompleted
                    ? 'bg-emerald-500/15 border-emerald-500/30'
                    : `bg-white/[0.03] border-white/[0.06] ${TASK_CARD_BORDER_COLORS[task.type]} border-l-[3px]`
                }
            `}
        >
            {/* Checkbox + Title - centered vertically */}
            <div className="flex items-center gap-2.5">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleComplete(task.id);
                    }}
                    className={`
                        flex-shrink-0 w-5 h-5 rounded flex items-center justify-center
                        transition-all duration-200
                        ${isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/[0.1] text-zinc-500 hover:bg-emerald-500/20 hover:text-emerald-400'}
                    `}
                >
                    <Check size={12} strokeWidth={3} />
                </button>

                <h3
                    className={`flex-1 font-medium text-base leading-snug line-clamp-2 ${isCompleted ? 'text-emerald-400/70' : ''}`}
                    style={{ color: isCompleted ? undefined : 'var(--text-primary)' }}
                >
                    {task.title}
                </h3>
            </div>

            {/* Bottom: Duration badge */}
            <div className="flex justify-end">
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : ''}`}
                    style={{
                        backgroundColor: isCompleted ? undefined : 'rgba(255,255,255,0.05)',
                        color: isCompleted ? undefined : 'var(--text-secondary)'
                    }}
                >
                    <Clock size={11} />
                    {formatDuration(task.duration)}
                </span>
            </div>
        </motion.div>
    );
});
