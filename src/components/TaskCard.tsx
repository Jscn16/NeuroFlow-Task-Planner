import React, { useState } from 'react';
import { Clock, Check, X } from 'lucide-react';
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
        requestAnimationFrame(() => {
            (e.target as HTMLElement).style.opacity = '0.4';
        });
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
                    <div className="flex gap-1.5">
                        <button
                            onClick={handleAcceptChanges}
                            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all"
                        >
                            <Check size={14} />
                        </button>
                        <button
                            onClick={handleDeleteTask}
                            className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all"
                        >
                            <X size={14} />
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
                        <div className="w-8 h-8 rounded-full bg-slate-800/80 text-slate-300 text-sm flex items-center justify-center flex-shrink-0 font-bold">
                            {index + 1}
                        </div>
                    )}
                    <div className={`w-1.5 h-12 rounded-full ${TYPE_INDICATOR_COLORS[task.type]} flex-shrink-0`} />
                    <div className="flex flex-col min-w-0 gap-1">
                        <h3 className={`font-semibold text-base truncate transition-colors ${isCompleted ? 'text-emerald-400 line-through decoration-emerald-500/50' : 'text-slate-200'}`}>
                            {task.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
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

    // Board variant - Optimized layout
    if (variant === 'board') {
        return (
            <div
                draggable={!isEditing}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDoubleClick={handleDoubleClick}
                className={`
                    relative h-full flex flex-col p-2.5 rounded-lg border
                    cursor-grab active:cursor-grabbing
                    transition-all duration-150
                    ${isDragging ? 'opacity-40 scale-95' : 'hover:shadow-md'}
                    ${isCompleted 
                        ? 'bg-emerald-500/15 border-emerald-500/30' 
                        : `bg-white/[0.04] hover:bg-white/[0.07] border-white/[0.08] ${TASK_CARD_BORDER_COLORS[task.type]} border-l-[3px]`
                    }
                `}
            >
                {/* Main content - centered vertically */}
                <div className="flex-1 flex items-center gap-2">
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
                                : 'bg-white/[0.1] text-slate-500 hover:bg-emerald-500/20 hover:text-emerald-400'}
                        `}
                    >
                        <Check size={12} strokeWidth={3} />
                    </button>
                    
                    <h3 
                        className={`flex-1 font-medium text-[13px] leading-snug line-clamp-2 ${isCompleted ? 'text-emerald-400/70 line-through' : ''}`}
                        style={{ color: isCompleted ? undefined : 'var(--text-primary)' }}
                    >
                        {task.title}
                    </h3>
                </div>
                
                {/* Bottom: Duration badge */}
                <div className="flex justify-end mt-1">
                    <span 
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : ''}`}
                        style={{ 
                            backgroundColor: isCompleted ? undefined : 'rgba(255,255,255,0.06)',
                            color: isCompleted ? undefined : 'var(--text-secondary)' 
                        }}
                    >
                        <Clock size={10} />
                        {formatDuration(task.duration)}
                    </span>
                </div>
            </div>
        );
    }

    // Sidebar variant
    return (
        <div
            draggable={!isEditing}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDoubleClick={handleDoubleClick}
            className={`
                relative flex flex-col gap-2 p-3 rounded-xl border
                cursor-grab active:cursor-grabbing
                transition-all duration-150
                ${isDragging ? 'opacity-40 scale-95' : 'hover:shadow-sm'}
                ${isCompleted 
                    ? 'bg-emerald-500/15 border-emerald-500/30' 
                    : `bg-white/[0.03] hover:bg-white/[0.05] border-white/[0.06] ${TASK_CARD_BORDER_COLORS[task.type]} border-l-[3px]`
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
                            : 'bg-white/[0.1] text-slate-500 hover:bg-emerald-500/20 hover:text-emerald-400'}
                    `}
                >
                    <Check size={12} strokeWidth={3} />
                </button>
                
                <h3 
                    className={`flex-1 font-medium text-sm leading-snug line-clamp-2 ${isCompleted ? 'text-emerald-400/70 line-through' : ''}`}
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
        </div>
    );
};
