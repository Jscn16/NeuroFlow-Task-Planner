import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Plus, ChevronRight, Settings, LogOut } from 'lucide-react';
import { Task, TaskType } from '../../types';
import { TaskCard } from '@/components/TaskCard';
import { TYPE_COLORS } from '../../constants';

interface SidebarProps {
    tasks: Task[];
    onDragStart: (e: React.DragEvent, taskId: string) => void;
    onDrop: (e: React.DragEvent) => void;
    onAddTask: (title: string, duration: number, type: TaskType) => void;
    onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
    onDeleteTask: (taskId: string) => void;
    onToggleTaskComplete: (taskId: string) => void;
    onOpenSettings: () => void;
}

const SIDEBAR_CATEGORIES = [
    { id: 'high', label: 'High Prio' },
    { id: 'medium', label: 'Medium Prio' },
    { id: 'low', label: 'Low Prio' },
    { id: 'leisure', label: 'Leisure' },
    { id: 'backlog', label: 'BACKLOG' },
    { id: 'chores', label: 'Chores' },
];

export const Sidebar: React.FC<SidebarProps> = ({
    tasks,
    onDragStart,
    onDrop,
    onAddTask,
    onUpdateTask,
    onDeleteTask,
    onToggleTaskComplete,
    onOpenSettings
}) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDuration, setNewTaskDuration] = useState(30);
    const [newTaskType, setNewTaskType] = useState<TaskType>('backlog');

    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
        'high': true, 'medium': true, 'low': false, 'leisure': false, 'backlog': true, 'chores': false
    });

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        onAddTask(newTaskTitle, newTaskDuration, newTaskType);
        setNewTaskTitle('');
        setExpandedCategories(prev => ({ ...prev, [newTaskType]: true }));
    };

    const toggleCategory = (catId: string) => {
        setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
    };

    return (
        <div
            className="w-[325px] h-full flex flex-col border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] relative z-20"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
        >
            {/* Logo Area */}
            <div className="p-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center">
                        <LayoutGrid size={16} className="text-white" />
                    </div>
                    <h1 className="text-lg font-medium text-[var(--text-primary)]">
                        Neuro<span className="text-[var(--accent-primary)]">Flow</span>
                    </h1>
                </div>
                <p className="text-[10px] text-[var(--text-tertiary)] font-medium ml-9">Task Planner</p>
            </div>

            {/* Quick Add Task */}
            <div className="p-4 border-b border-[var(--border-primary)]">
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                        placeholder="New Task..."
                        className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] transition-all"
                    />
                    <div className="relative w-20">
                        <input
                            type="number"
                            value={newTaskDuration}
                            onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg pl-3 pr-6 py-2 text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] transition-all text-right"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[var(--text-tertiary)]">min</span>
                    </div>
                </div>

                {/* Type Grid */}
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                    {[
                        { id: 'high', label: 'HIGH' },
                        { id: 'medium', label: 'MEDIUM' },
                        { id: 'low', label: 'LOW' },
                        { id: 'leisure', label: 'LEISURE' },
                        { id: 'backlog', label: 'BACKLOG' },
                        { id: 'chores', label: 'CHORES' }
                    ].map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setNewTaskType(type.id as TaskType)}
                            className={`
                                py-2 rounded-lg text-[9px] font-medium tracking-wider uppercase transition-all border
                                ${newTaskType === type.id
                                    ? `bg-[var(--bg-tertiary)] border-[var(--border-hover)] ${TYPE_COLORS[type.id as TaskType]}`
                                    : 'bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                                }
                            `}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* Add Button */}
                <button
                    onClick={handleAddTask}
                    className="w-full py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] text-xs font-medium text-[var(--text-primary)] uppercase tracking-wide hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={14} />
                    Add Task
                </button>
            </div>

            {/* Categories / Backlog List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
                {SIDEBAR_CATEGORIES.filter(c => c.id !== 'chores').map(cat => {
                    const catTasks = tasks.filter(t => t.type === cat.id && t.status === 'unscheduled');
                    const isExpanded = expandedCategories[cat.id];

                    if (catTasks.length === 0 && cat.id !== 'backlog') return null;

                    return (
                        <div key={cat.id} className="group">
                            <button
                                onClick={() => toggleCategory(cat.id)}
                                className="w-full flex items-center justify-between py-1.5 px-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-1"
                            >
                                <div className="flex items-center gap-1.5">
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronRight size={10} />
                                    </motion.div>
                                    <span>{cat.label}</span>
                                </div>
                                <span className="bg-[var(--bg-primary)] text-[var(--text-tertiary)] px-1.5 py-0.5 rounded text-[9px] min-w-[18px] text-center">
                                    {catTasks.length}
                                </span>
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-1.5 overflow-hidden"
                                    >
                                        {catTasks.map((task, index) => (
                                            <motion.div
                                                key={task.id}
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                            >
                                                <TaskCard
                                                    task={task}
                                                    variant="sidebar"
                                                    onDragStart={onDragStart}
                                                    onUpdateTask={onUpdateTask}
                                                    onDeleteTask={onDeleteTask}
                                                    onToggleComplete={onToggleTaskComplete}
                                                />
                                            </motion.div>
                                        ))}
                                        {catTasks.length === 0 && (
                                            <div className="text-[9px] text-[var(--text-tertiary)] italic pl-5 py-1">No tasks</div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* Fixed Chores Section */}
            {(() => {
                const choresCat = SIDEBAR_CATEGORIES.find(c => c.id === 'chores')!;
                const choresTasks = tasks.filter(t => t.type === 'chores' && t.status === 'unscheduled');
                const isExpanded = expandedCategories['chores'];

                return (
                    <div className="px-3 py-2 border-t border-[var(--border-primary)] bg-[var(--bg-primary)]">
                        <div className="group">
                            <button
                                onClick={() => toggleCategory('chores')}
                                className="w-full flex items-center justify-between py-1.5 px-2 text-[10px] font-medium uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-1"
                            >
                                <div className="flex items-center gap-1.5">
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronRight size={10} />
                                    </motion.div>
                                    <span>{choresCat.label}</span>
                                </div>
                                <span className="bg-[var(--bg-secondary)] text-[var(--text-tertiary)] px-1.5 py-0.5 rounded text-[9px] min-w-[18px] text-center">
                                    {choresTasks.length}
                                </span>
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-1.5 overflow-hidden"
                                    >
                                        <div className="max-h-[200px] overflow-y-auto pr-1">
                                            {choresTasks.map((task, index) => (
                                                <motion.div
                                                    key={task.id}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                >
                                                    <TaskCard
                                                        task={task}
                                                        variant="sidebar"
                                                        onDragStart={onDragStart}
                                                        onUpdateTask={onUpdateTask}
                                                        onDeleteTask={onDeleteTask}
                                                        onToggleComplete={onToggleTaskComplete}
                                                    />
                                                </motion.div>
                                            ))}
                                            {choresTasks.length === 0 && (
                                                <div className="text-[9px] text-[var(--text-tertiary)] italic pl-5 py-1">No chores</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                );
            })()}

            {/* User / Settings Footer */}
            <div className="p-3 border-t border-[var(--border-primary)] flex items-center justify-between bg-[var(--bg-primary)]">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--accent-primary)] border border-[var(--border-primary)]"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-medium text-[var(--text-primary)]">User</span>
                        <span className="text-[9px] text-[var(--text-tertiary)]">Pro Plan</span>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={onOpenSettings}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <Settings size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-red-500 transition-colors">
                        <LogOut size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
