import React from 'react';
import { Task } from '../../../types';
import { TaskCard } from '../../TaskCard';
import { formatDate } from '../../../constants';

interface FocusModeProps {
    tasks: Task[];
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onToggleTaskComplete: (taskId: string) => void;
    onStartFocus: (taskId: string) => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({ tasks, onDragStart, onToggleTaskComplete, onStartFocus }) => {
    const todayStr = formatDate(new Date());
    const focusTasks = tasks.filter(t =>
        (t.status === 'scheduled' && t.dueDate === todayStr) ||
        (t.status === 'unscheduled' && t.type === 'high')
    );

    return (
        <div className="h-full p-8 flex flex-col">
            <h2 className="text-3xl font-display font-bold text-white mb-6">Deep Focus Mode</h2>
            <div className="flex-1 overflow-y-auto space-y-4 pr-4">
                {focusTasks.map(task => (
                    <div key={task.id} className="relative group">
                        <TaskCard
                            task={task}
                            variant="sidebar" // Focus tasks here are like special backlog
                            onDragStart={onDragStart}
                            onToggleComplete={onToggleTaskComplete}
                            onStartFocus={onStartFocus}
                        />
                    </div>
                ))}
                {focusTasks.length === 0 && (
                    <div className="text-center py-20 text-slate-500">No focus tasks for today. Check your schedule!</div>
                )}
            </div>
        </div>
    );
};
