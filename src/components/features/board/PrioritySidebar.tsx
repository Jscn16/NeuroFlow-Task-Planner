import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Task, GridRow } from '../../../types';
import { ROW_CONFIG, ROW_LABELS } from '../../../constants';
import { BoardTaskCard } from '../../tasks/BoardTaskCard';
import { useTaskContext } from '../../../context/TaskContext';
import { useSpaceRows } from '../../../hooks/useSpaceRows';

interface PrioritySidebarProps {
    tasks: Task[];
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
    onToggleComplete: (taskId: string) => void;
    onDeleteTask?: (taskId: string) => void;
}

const ROW_LIMITS: Record<GridRow, number> = {
    'GOAL': 1,
    'FOCUS': 3,
    'WORK': 3,
    'LEISURE': 3,
    'CHORES': 5
};

export const PrioritySidebar: React.FC<PrioritySidebarProps> = ({
    tasks,
    onUpdateTask,
    onToggleComplete,
    onDeleteTask
}) => {
    const { handleDragStart } = useTaskContext();
    const { rows, rowConfig } = useSpaceRows();

    const handleDropOnRow = (e: React.DragEvent, row: GridRow) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        if (!taskId) return;

        // Check limits
        const rowTasks = tasks.filter(t => t.assignedRow === row && t.status !== 'completed');
        const limit = ROW_LIMITS[row];

        // If task is ALREADY in this row, don't count it against limit (it's just moving back to unscheduled)
        // But if it's new to this row, check count < limit.
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        if (task.assignedRow !== row && rowTasks.length >= limit) {
            alert(`Limit reached for ${row} tasks (${limit} max). Complete or move tasks to add more.`);
            return;
        }

        onUpdateTask(taskId, {
            assignedRow: row,
            scheduledTime: undefined, // Unschedule time when moving back to sidebar
            status: 'unscheduled' // Or 'scheduled' without time? Usually 'unscheduled' implies backlog. But if it has a Row, it's 'Planned'.
            // Let's assume status 'scheduled' but no time implies "Planned for Day".
            // If the system uses 'unscheduled' for Backlog, then 'scheduled' needs a day.
            // But here we are in DayTimelineView. The dropped task likely has a dueDate set to today?
            // I'll keep existing dueDate and just clear scheduledTime.
        });
    };

    return (
        <div className="w-64 flex-shrink-0 flex flex-col h-full bg-zinc-900/50 border-r border-white/5 overflow-y-auto no-scrollbar">
            <div className="p-4 pb-2">
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Priorities</h2>
            </div>

            <div className="flex-1 flex flex-col gap-4 p-2">
                {rows.map(row => {
                    const config = rowConfig[row];
                    const rowTasks = tasks.filter(t =>
                        t.assignedRow === row &&
                        !t.scheduledTime && // Only show unscheduled (time-wise) tasks
                        t.status !== 'completed' // Hide completed from sidebar? Or show faded?
                    );

                    return (
                        <div
                            key={row}
                            className="flex flex-col gap-2 rounded-xl p-2 bg-white/[0.02]"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDropOnRow(e, row)}
                        >
                            {/* Header - Clean List Style */}
                            <div className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/5 transition-colors rounded-lg group/header">
                                <div className="flex items-center gap-3">
                                    <div className={`p-1 rounded-full ${config.color} bg-current/10`}>
                                        <config.icon size={10} strokeWidth={3} />
                                    </div>
                                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{config.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-medium text-zinc-600 group-hover/header:text-zinc-500 transition-colors">
                                        {rowTasks.length}
                                    </span>
                                    <ChevronDown size={12} className="text-zinc-700 group-hover/header:text-zinc-500 transition-colors" />
                                </div>
                            </div>

                            {/* Drop Zone / List */}
                            <div className="flex flex-col gap-2 min-h-[40px]">
                                {rowTasks.map(task => (
                                    <div key={task.id} className="h-20"> {/* Fixed height for cards in sidebar */}
                                        <BoardTaskCard
                                            task={task}
                                            onDragStart={handleDragStart}
                                            onToggleComplete={onToggleComplete}
                                            onUpdateTask={onUpdateTask} // Allow editing in sidebar
                                            onDeleteTask={onDeleteTask}
                                            viewMode="show"
                                        />
                                    </div>
                                ))}
                                {rowTasks.length === 0 && (
                                    <div className="text-[10px] text-zinc-700 text-center py-2 italic border border-dashed border-zinc-800 rounded">
                                        Drag here
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
