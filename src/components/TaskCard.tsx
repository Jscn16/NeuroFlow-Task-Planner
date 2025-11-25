import React, { useState } from 'react';
import { Play, CheckCircle2, Clock, Check, X } from 'lucide-react';
import { Task } from '../types';
import { TYPE_COLORS, TASK_CARD_BORDER_COLORS, TYPE_INDICATOR_COLORS } from '../constants';

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
}

export const TaskCard: React.FC<TaskCardProps> = ({
    task,
    variant,
    index,
    onDragStart,
    onToggleComplete,
    onStartFocus,
    onUpdateTask,
    onDeleteTask,
    onTaskDrop
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDuration, setEditedDuration] = useState(task.duration.toString());

    const isCompleted = task.status === 'completed';

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (variant === 'deepwork') return; // Disable editing in deepwork mode
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

    // Base styles
    const baseStyles = "relative group flex flex-col gap-0.5 p-2 rounded-lg border backdrop-blur-md transition-all duration-300";

    // Dragging styles - disable when editing
    const dragStyles = isEditing ? "cursor-default" : "cursor-grab active:cursor-grabbing hover:scale-[1.02] hover:shadow-lg hover:z-10";

    // Variant styles
    let variantStyles = "";
    if (variant === 'board') {
        // If completed, we override the background/border in completionStyles
        variantStyles = isCompleted
            ? `hover:scale-[1.02] hover:shadow-lg hover:z-10`
            : `bg-white/[0.06] border-white/5 hover:bg-white/[0.08] hover:scale-[1.02] hover:shadow-lg hover:z-10`;
    } else if (variant === 'sidebar') {
        variantStyles = isCompleted
            ? `mb-2 gap-1.5 p-2.5`
            : `bg-white/[0.06] border-white/5 hover:bg-white/[0.08] mb-2 gap-1.5 p-2.5`;
    } else if (variant === 'deepwork') {
        // Matching planner mode background as requested, but with emerald tint for completed
        const baseBg = isCompleted
            ? 'bg-emerald-500/10 border-emerald-500/20'
            : 'bg-white/[0.06] border-white/5';

        variantStyles = `${baseBg} rounded-2xl px-5 py-3 flex-row items-center justify-between hover:border-emerald-400/40 hover:bg-emerald-500/20 transition-colors gap-4`;
    }

    // Completion styles - The "Satisfyingly Done" State
    const completionStyles = isCompleted
        ? 'bg-emerald-500/10 border-emerald-500/30 transition-all duration-300 ease-in-out'
        : '';

    // Edit mode rendering
    if (isEditing) {
        return (
            <div className={`${baseStyles} ${variantStyles} cursor-default`}>
                <div className="flex items-start justify-between gap-2">
                    {/* Edit Form Left */}
                    <div className="flex flex-col min-w-0 flex-1 gap-1">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-black/20 text-white text-xs font-medium rounded px-1.5 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                            autoFocus
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={editedDuration}
                                onChange={(e) => setEditedDuration(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="bg-black/20 text-slate-400 text-[10px] rounded px-1.5 py-0.5 w-12 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                            />
                            <span className="text-[10px] text-slate-500">min</span>
                        </div>
                    </div>

                    {/* Edit Actions Right */}
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={handleAcceptChanges}
                            className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                        >
                            <Check size={12} />
                        </button>
                        <button
                            onClick={handleDeleteTask}
                            className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'deepwork') {
        return (
            <div
                className={`${variantStyles} ${completionStyles}`}
                onDoubleClick={handleDoubleClick}
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Index Pill */}
                    {typeof index === 'number' && (
                        <div className="w-6 h-6 rounded-full bg-slate-800/80 text-slate-300 text-[11px] flex items-center justify-center flex-shrink-0">
                            {index + 1}
                        </div>
                    )}

                    {/* Left Color Stripe */}
                    <div className={`w-1 h-8 rounded-full ${TYPE_INDICATOR_COLORS[task.type]} flex-shrink-0`} />

                    <div className="flex flex-col min-w-0">
                        <h3 className={`font-medium text-sm truncate transition-colors ${isCompleted ? 'text-emerald-400 line-through decoration-emerald-500/50' : 'text-slate-200'}`}>
                            {task.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className={`uppercase tracking-wider font-bold text-[10px] ${TYPE_COLORS[task.type]}`}>
                                {task.type}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <Clock size={10} />
                                {task.duration}m
                            </span>
                        </div>
                    </div>
                </div>

                {/* Completed Checkmark (Optional, for visual feedback) */}
                {isCompleted && (
                    <div className="text-emerald-300">
                        <Check size={20} />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            draggable={!isEditing}
            onDragStart={(e) => {
                e.dataTransfer.setData('taskId', task.id);
                onDragStart(e, task.id);
            }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDoubleClick={handleDoubleClick}
            // If completed, we override the border color entirely
            className={`${baseStyles} ${dragStyles} ${variantStyles} ${completionStyles} ${!isCompleted ? TASK_CARD_BORDER_COLORS[task.type] : ''}`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                        {/* Priority Tag / Indicator */}
                        {isCompleted ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-medium uppercase tracking-wider">
                                {task.type}
                            </span>
                        ) : (
                            <>
                                <div className={`w-1.5 h-1.5 rounded-full ${TYPE_INDICATOR_COLORS[task.type]}`} />
                                <span className={`text-[9px] font-bold uppercase tracking-wider ${TYPE_COLORS[task.type]}`}>
                                    {task.type}
                                </span>
                            </>
                        )}
                    </div>
                    <h3 className={`font-medium text-xs leading-snug line-clamp-2 transition-colors ${isCompleted ? 'text-emerald-400 line-through decoration-emerald-500/50' : 'text-slate-200'}`}>
                        {task.title}
                    </h3>
                </div>

                {variant === 'board' && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(task.id);
                        }}
                        className={`
                            flex-shrink-0 p-1 rounded-md transition-all duration-200 border
                            ${isCompleted
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                : 'bg-white/5 text-slate-400 border-transparent hover:bg-emerald-500/10 hover:text-emerald-400'}
                        `}
                    >
                        {/* Replaced CheckCircle2 with Check for "no round circle" */}
                        <Check size={14} />
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between mt-0.5">
                <div className={`flex items-center gap-1 text-[10px] font-medium ${isCompleted ? 'text-emerald-500/70' : 'text-slate-500'}`}>
                    <Clock size={10} />
                    <span>{task.duration}m</span>
                </div>
            </div>

            {/* Progress/Indicator Bar for Sidebar variant */}
            {variant === 'sidebar' && !isCompleted && (
                <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full ${TYPE_INDICATOR_COLORS[task.type]}`}></div>
            )}
        </div>
    );
};
