import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, X } from 'lucide-react';
import { Task } from '../../types';
import { TASK_CARD_BORDER_COLORS } from '../../constants';

interface SidebarTaskCardProps {
    task: Task;
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onToggleComplete: (taskId: string) => void;
    onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
    onDeleteTask?: (taskId: string) => void;
}

export const SidebarTaskCard = React.memo<SidebarTaskCardProps>(({
    task,
    onDragStart,
    onDragEnd,
    onToggleComplete,
    onUpdateTask,
    onDeleteTask
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDuration, setEditedDuration] = useState(task.duration.toString());
    const [isDragging, setIsDragging] = useState(false);

    const isCompleted = task.status === 'completed';

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
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

        // Delay opacity change
        setTimeout(() => {
            if (e.target) {
                (e.target as HTMLElement).style.opacity = '0.5';
            }
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        setIsDragging(false);
        (e.target as HTMLElement).style.opacity = '1';
        if (onDragEnd) {
            onDragEnd(e);
        }
    };

    const formatDuration = (mins: number) => {
        if (mins < 60) return `${mins} min`;
        const hours = Math.floor(mins / 60);
        const remaining = mins % 60;
        if (remaining === 0) return `${hours}h`;
        return `${hours}h ${remaining}m`;
    };

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
            <div className="flex items-center gap-2.5">
                <h3
                    className={`flex-1 font-medium text-base leading-snug line-clamp-2 ${isCompleted ? 'text-emerald-400/70' : ''}`}
                    style={{ color: isCompleted ? undefined : 'var(--text-primary)' }}
                >
                    {task.title}
                </h3>
            </div>

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
