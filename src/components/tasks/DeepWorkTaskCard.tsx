import React from 'react';
import { Clock, Check } from 'lucide-react';
import { Task } from '../../types';
import { TYPE_COLORS, TYPE_INDICATOR_COLORS } from '../../constants';

interface DeepWorkTaskCardProps {
    task: Task;
    index?: number;
    onToggleComplete: (taskId: string) => void;
    onStartFocus?: (taskId: string) => void;
}

export const DeepWorkTaskCard = React.memo<DeepWorkTaskCardProps>(({
    task,
    index,
    onToggleComplete,
    onStartFocus
}) => {
    const isCompleted = task.status === 'completed';

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onStartFocus) {
            onStartFocus(task.id);
        }
    };

    const baseBg = isCompleted
        ? 'bg-emerald-500/10 border-emerald-500/20'
        : 'bg-white/[0.06] border-white/5';

    return (
        <div
            className={`${baseBg} rounded-2xl px-5 py-4 flex items-center justify-between hover:border-emerald-400/40 hover:bg-emerald-500/20 transition-all duration-300 gap-4 border cursor-pointer`}
            onDoubleClick={handleDoubleClick}
            onClick={() => onStartFocus && onStartFocus(task.id)}
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
});
