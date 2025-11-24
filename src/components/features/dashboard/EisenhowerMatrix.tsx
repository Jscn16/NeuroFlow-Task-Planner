import React from 'react';
import { Task } from '../../../types';
import { TaskCard } from '../../TaskCard';

interface EisenhowerMatrixProps {
    tasks: Task[];
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onDrop: (e: React.DragEvent, quad: 'do' | 'decide' | 'delegate' | 'delete') => void;
    onToggleTaskComplete: (taskId: string) => void;
}

export const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ tasks, onDragStart, onDrop, onToggleTaskComplete }) => {
    const quadrants = [
        { id: 'do', label: 'Do', sub: 'Urgent & Important', color: 'bg-rose-500', border: 'border-rose-500/30' },
        { id: 'decide', label: 'Decide', sub: 'Not Urgent & Important', color: 'bg-orange-500', border: 'border-orange-500/30' },
        { id: 'delegate', label: 'Delegate', sub: 'Urgent & Not Important', color: 'bg-amber-400', border: 'border-amber-400/30' },
        { id: 'delete', label: 'Delete', sub: 'Not Urgent & Not Important', color: 'bg-slate-500', border: 'border-slate-500/30' },
    ];

    return (
        <div className="flex h-full p-8 gap-6 overflow-hidden">
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-6">
                {quadrants.map(q => (
                    <div
                        key={q.id}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => onDrop(e, q.id as any)}
                        className={`
                            relative rounded-3xl border ${q.border} bg-white/[0.02] p-6 flex flex-col
                            backdrop-blur-sm transition-all hover:bg-white/[0.04]
                        `}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className={`text-2xl font-display font-bold ${q.color} bg-clip-text text-transparent`}>{q.label}</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{q.sub}</p>
                            </div>
                            <div className={`p-2 rounded-full ${q.color} bg-opacity-20`}>
                                <div className={`w-2 h-2 rounded-full ${q.color}`}></div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                            {tasks.filter(t => t.eisenhowerQuad === q.id).map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    variant="sidebar" // Eisenhower tasks are essentially backlog
                                    onDragStart={onDragStart}
                                    onToggleComplete={onToggleTaskComplete}
                                />
                            ))}
                            {tasks.filter(t => t.eisenhowerQuad === q.id).length === 0 && (
                                <div className="h-full flex items-center justify-center text-slate-600 text-sm italic">
                                    Drop tasks here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
