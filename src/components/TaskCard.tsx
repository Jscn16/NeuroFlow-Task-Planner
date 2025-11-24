import React from 'react';
import { Play, CheckCircle2, Clock } from 'lucide-react';
import { Task } from '../types';
import { TYPE_COLORS, TASK_CARD_BORDER_COLORS, TYPE_INDICATOR_COLORS } from '../constants';

interface TaskCardProps {
    task: Task;
    variant: 'board' | 'sidebar';
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onToggleComplete: (taskId: string) => void;
    onStartFocus?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, variant, onDragStart, onToggleComplete, onStartFocus }) => {
    const isCompleted = task.status === 'completed';

    // Base styles
    const baseStyles = "relative group flex flex-col gap-2 p-3 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-grab active:cursor-grabbing hover:scale-[1.02] hover:shadow-lg hover:z-10";

    // Variant styles
    const variantStyles = variant === 'board'
        ? `bg-[#1e2338]/60 hover:bg-[#1e2338]/80 ${TASK_CARD_BORDER_COLORS[task.type]} border-l-4 border-y border-r border-white/[0.05]`
        : `bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05]`;

    // Completion styles
    const completionStyles = isCompleted ? 'opacity-50 grayscale' : 'opacity-100';

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            className={`${baseStyles} ${variantStyles} ${completionStyles}`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                    <button
                        onClick={() => onToggleComplete(task.id)}
                        className={`mt-0.5 shrink-0 transition-colors ${isCompleted ? 'text-emerald-400' : 'text-slate-500 hover:text-emerald-400'}`}
                    >
                        <CheckCircle2 size={16} className={isCompleted ? 'fill-emerald-400/20' : ''} />
                    </button>

                    <div className="flex flex-col min-w-0">
                        <span className={`text-xs font-medium truncate leading-tight ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ${TYPE_COLORS[task.type]}`}>
                                {task.type}
                            </span>
                            {task.duration > 0 && (
                                <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                                    <Clock size={8} />
                                    {task.duration}m
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {onStartFocus && !isCompleted && (
                    <button
                        onClick={() => onStartFocus(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all"
                        title="Start Focus"
                    >
                        <Play size={12} fill="currentColor" />
                    </button>
                )}
            </div>

            {/* Progress/Indicator Bar for Sidebar variant */}
            {variant === 'sidebar' && (
                <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full ${TYPE_INDICATOR_COLORS[task.type]}`}></div>
            )}
        </div>
    );
};
