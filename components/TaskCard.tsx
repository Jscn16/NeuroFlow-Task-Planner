
import React from 'react';
import { Play, CheckCircle2, Clock } from 'lucide-react';
import { Task } from '../types';
import { TYPE_COLORS, TYPE_INDICATOR_COLORS, TASK_CARD_BORDER_COLORS } from '../constants';

interface TaskCardProps {
  task: Task;
  variant?: 'sidebar' | 'board'; // New variant prop
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onToggleComplete?: (taskId: string) => void;
  onStartFocus?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  variant = 'sidebar', // Default to sidebar
  onDragStart,
  onToggleComplete,
  onStartFocus
}) => {
  const isCompleted = task.status === 'completed';
  
  // Dynamic Styles based on completion status and variant
  const indicatorColor = isCompleted ? 'bg-emerald-400' : TYPE_INDICATOR_COLORS[task.type];
  const textColor = isCompleted ? 'text-white/50' : (variant === 'board' ? 'text-slate-200' : 'text-zinc-100');
  const durationTextColor = isCompleted ? 'text-emerald-300/50' : (variant === 'board' ? 'text-slate-400 group-hover:text-cyan-400' : 'text-zinc-400');
  const borderLeftColor = TASK_CARD_BORDER_COLORS[task.type];

  // --- Board Variant (in the grid) ---
  if (variant === 'board') {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            className={`
                group relative flex items-center overflow-hidden
                rounded-lg
                cursor-grab active:cursor-grabbing 
                transition-all duration-500 ease-out
                w-full
                min-h-[3rem] shrink-0
                border border-white/5
                ${borderLeftColor} border-l-4
                ${isCompleted 
                    ? 'bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[0.98]' 
                    : 'bg-white/[0.08] hover:bg-white/[0.12]'
                }
            `}
        >
            {/* Content Container - Padded from left (indicator) and right (checkbox area) */}
            <div className="flex items-center flex-1 min-w-0 pl-2 pr-8 py-1.5 h-full">
                
                {/* Duration - Now Visible on Left */}
                <span className={`
                    text-xs font-bold font-mono mr-2 shrink-0
                    ${durationTextColor} transition-colors
                `}>
                    {task.duration}m
                </span>

                {/* Title */}
                <span className={`
                    font-medium truncate text-xs leading-tight flex-grow transition-all duration-500 select-none
                    ${textColor} ${isCompleted ? 'line-through' : ''}
                `}>
                    {task.title}
                </span>
            </div>

            {/* Checkbox / Action Area - Far Right Edge */}
            {onToggleComplete && (
                <div 
                    onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }} 
                    className={`
                        absolute right-0 top-0 bottom-0 w-8 
                        flex items-center justify-center
                        cursor-pointer transition-all duration-300
                        border-l border-white/[0.05]
                        hover:bg-white/[0.1]
                        group/checkbox
                    `}
                >
                    <button className={`
                        w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300
                        ${isCompleted 
                            ? 'bg-emerald-400 text-white shadow-[0_0_15px_rgba(52,211,153,0.6)] scale-110' 
                            : 'bg-white/[0.05] border border-white/[0.2] group-hover/checkbox:border-cyan-400 group-hover/checkbox:scale-110'
                        }
                    `}>
                        <CheckCircle2 size={10} strokeWidth={3} className={isCompleted ? "opacity-100" : "opacity-0 group-hover/checkbox:opacity-100 text-cyan-400 transition-opacity"} />
                    </button>
                </div>
            )}
        </div>
    );
  }

  // --- Sidebar Variant (Compact & Backlog) ---
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`
        group relative flex flex-col justify-center overflow-hidden
        backdrop-blur-md
        /* Cut Glass Borders */
        border-t border-l 
        border-b border-r 
        
        p-2 py-2 mb-1.5 rounded-lg pl-3
        cursor-grab active:cursor-grabbing 
        transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]

        ${isCompleted 
            ? 'bg-emerald-500/20 border-emerald-400/50 border-b-emerald-500/30 border-r-emerald-500/30 shadow-[0_0_30px_rgba(52,211,153,0.25)] scale-[0.98]' 
            : 'bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent border-white/[0.15] border-b-black/[0.2] border-r-black/[0.2] shadow-md shadow-slate-900/70 hover:from-white/[0.12] hover:to-white/[0.04] hover:scale-[1.02] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)]'
        }
      `}
    >
      {/* Vertical Color Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-r-sm transition-colors duration-500 ${indicatorColor} ${isCompleted ? '' : 'shadow-[0_0_10px_rgba(255,255,255,0.2)]'}`}></div>

      <div className="flex items-center justify-between gap-2">
        <span className={`
          font-medium truncate w-full drop-shadow-md transition-all duration-500 select-none
          text-sm leading-tight
          ${textColor} ${isCompleted ? 'line-through decoration-white/30' : ''}
        `}>
          {task.title}
        </span>
        
        {onToggleComplete && (
             <button 
                onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }} 
                className={`
                    shrink-0 rounded-full flex items-center justify-center transition-all duration-500
                    w-4 h-4
                    ${isCompleted 
                        ? 'bg-emerald-400 text-white shadow-[0_0_20px_rgba(52,211,153,0.6)] rotate-0 scale-110' 
                        : 'bg-white/[0.03] border border-white/[0.1] hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:rotate-12'
                    }
                `}
            >
                {isCompleted && (
                    <CheckCircle2 
                        size={10} 
                        strokeWidth={3} 
                        className="block" 
                    />
                )}
            </button>
        )}
      </div>

      <div className={`flex justify-between items-center mt-2 transition-opacity duration-500 ${isCompleted ? 'opacity-50' : 'opacity-100'}`}>
           <div className="flex items-center gap-1.5">
             <span className={`
                text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md 
                border-t border-l border-b border-r shadow-sm
                ${isCompleted 
                    ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-100' 
                    : `bg-white/[0.03] border-white/[0.08] border-b-black/[0.1] border-r-black/[0.1] ${TYPE_COLORS[task.type].split(' ')[0]}`
                }
             `}>
                {task.type}
             </span>
           </div>
           <div className={`flex items-center gap-1 text-[10px] font-medium ${durationTextColor}`}>
              <Clock size={10} className={isCompleted ? 'text-emerald-200/50' : 'text-zinc-500'} />
              <span>{task.duration}m</span>
           </div>
           {onStartFocus && !isCompleted && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onStartFocus(task.id); }} 
                    className="p-1 rounded-full bg-white/[0.03] border border-white/[0.1] text-zinc-400 hover:text-cyan-300 hover:bg-cyan-950/30 hover:border-cyan-500/30 transition-all"
                >
                    <Play size={10} fill="currentColor" />
                </button>
            )}
        </div>
    </div>
  );
};