import React, { useState, useRef } from 'react';
import { LayoutGrid, Plus, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { Task, TaskType } from '../../types';
import { TaskCard } from '@/components/TaskCard';

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

const CATEGORIES = [
    { id: 'high', label: 'High', color: '#f43f5e', emoji: '🔥' },
    { id: 'medium', label: 'Medium', color: '#f97316', emoji: '⚡' },
    { id: 'low', label: 'Low', color: '#facc15', emoji: '📋' },
    { id: 'leisure', label: 'Leisure', color: '#22d3ee', emoji: '🎮' },
    { id: 'chores', label: 'Chores', color: '#a8b3c1', emoji: '🧹' },
    { id: 'backlog', label: 'Backlog', color: '#5a6472', emoji: '📥' },
];

// 6 buttons for even grid
const QUICK_DURATIONS = [15, 30, 45, 60, 90, 120];

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
        'high': true, 'medium': true, 'low': true, 'leisure': false, 'backlog': true, 'chores': false
    });
    const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
    const dragCounters = useRef<Record<string, number>>({});

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        onAddTask(newTaskTitle.trim(), newTaskDuration, newTaskType);
        setNewTaskTitle('');
        setExpandedCategories(prev => ({ ...prev, [newTaskType]: true }));
    };

    const toggleCategory = (catId: string) => {
        setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
    };

    const handleCategoryDragEnter = (e: React.DragEvent, categoryId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!dragCounters.current[categoryId]) {
            dragCounters.current[categoryId] = 0;
        }
        dragCounters.current[categoryId]++;
        setDragOverCategory(categoryId);
    };

    const handleCategoryDragLeave = (e: React.DragEvent, categoryId: string) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounters.current[categoryId]--;
        if (dragCounters.current[categoryId] === 0) {
            setDragOverCategory(null);
        }
    };

    const handleCategoryDrop = (e: React.DragEvent, categoryId: string) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounters.current[categoryId] = 0;
        setDragOverCategory(null);

        const taskId = e.dataTransfer.getData('taskId');
        if (taskId && onUpdateTask) {
            onUpdateTask(taskId, {
                type: categoryId as TaskType,
                status: 'unscheduled',
                dueDate: null,
                assignedRow: null
            });
            setExpandedCategories(prev => ({ ...prev, [categoryId]: true }));
        }
    };

    const handleSidebarDrop = (e: React.DragEvent) => {
        if (!dragOverCategory) {
            onDrop(e);
        }
    };

    const selectedCategory = CATEGORIES.find(c => c.id === newTaskType);

    return (
        <div
            className="w-80 h-full flex flex-col border-r relative z-20"
            style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-medium)'
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleSidebarDrop}
        >
            {/* Logo */}
            <div className="p-4 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: 'var(--accent)' }}
                    >
                        <LayoutGrid size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                            Neuro<span style={{ color: 'var(--accent)' }}>Flow</span>
                        </h1>
                        <p className="text-[10px] font-medium -mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            Task Planner
                        </p>
                    </div>
                </div>
                <button
                    onClick={onOpenSettings}
                    className="p-2.5 rounded-xl transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <Settings size={18} />
                </button>
            </div>

            {/* Add Task Section */}
            <div className="px-3 pb-4">
                <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                    {/* Input Row */}
                    <div className="mb-4">
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                            placeholder="Add new task..."
                            className="w-full bg-transparent text-sm px-3 py-2.5 rounded-lg placeholder-slate-500 focus:outline-none border"
                            style={{
                                color: 'var(--text-primary)',
                                borderColor: newTaskTitle ? 'var(--accent)' : 'var(--border-light)'
                            }}
                        />
                    </div>

                    {/* Duration Label + Buttons */}
                    <div className="mb-4">
                        <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                            Duration
                        </div>
                        <div className="grid grid-cols-6 gap-1.5">
                            {QUICK_DURATIONS.map(d => (
                                <button
                                    key={d}
                                    onClick={() => setNewTaskDuration(d)}
                                    className="py-2 rounded-lg text-[11px] font-semibold transition-all"
                                    style={{
                                        backgroundColor: newTaskDuration === d ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                                        color: newTaskDuration === d ? 'white' : 'var(--text-secondary)'
                                    }}
                                >
                                    {d < 60 ? `${d}m` : `${d / 60}h`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Type Label + Grid */}
                    <div className="mb-4">
                        <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                            Priority
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setNewTaskType(cat.id as TaskType)}
                                    className="py-2.5 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all"
                                    style={{
                                        backgroundColor: newTaskType === cat.id ? `${cat.color}20` : 'rgba(255,255,255,0.03)',
                                        color: newTaskType === cat.id ? cat.color : 'var(--text-muted)',
                                        border: newTaskType === cat.id ? `1px solid ${cat.color}40` : '1px solid transparent'
                                    }}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={handleAddTask}
                        disabled={!newTaskTitle.trim()}
                        className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-30"
                        style={{
                            backgroundColor: newTaskTitle.trim() ? selectedCategory?.color : 'rgba(255,255,255,0.05)',
                            color: newTaskTitle.trim() ? 'white' : 'var(--text-muted)'
                        }}
                    >
                        <Plus size={16} />
                        Add Task
                    </button>
                </div>
            </div>

            {/* Main Task Lists (scrollable) */}
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 scrollbar-hide">
                {CATEGORIES.map(cat => {
                    const catTasks = tasks.filter(t => t.type === cat.id && t.status === 'unscheduled');
                    const isExpanded = expandedCategories[cat.id];
                    const isDraggedOver = dragOverCategory === cat.id;

                    return (
                        <div
                            key={cat.id}
                            onDragEnter={(e) => handleCategoryDragEnter(e, cat.id)}
                            onDragOver={(e) => e.preventDefault()}
                            onDragLeave={(e) => handleCategoryDragLeave(e, cat.id)}
                            onDrop={(e) => handleCategoryDrop(e, cat.id)}
                        >
                            <button
                                onClick={() => toggleCategory(cat.id)}
                                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all"
                                style={{
                                    backgroundColor: isDraggedOver ? `${cat.color}15` : 'transparent',
                                    border: isDraggedOver ? `2px dashed ${cat.color}` : '2px solid transparent'
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: cat.color }}>
                                        {cat.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-[11px] font-bold px-2 py-0.5 rounded"
                                        style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                                    >
                                        {catTasks.length}
                                    </span>
                                    <ChevronDown
                                        size={14}
                                        className="transition-transform"
                                        style={{
                                            color: 'var(--text-muted)',
                                            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
                                        }}
                                    />
                                </div>
                            </button>

                            <div
                                className="space-y-1.5 overflow-hidden transition-all duration-200"
                                style={{
                                    maxHeight: isExpanded ? 'none' : '0px',
                                    opacity: isExpanded ? 1 : 0,
                                    paddingTop: isExpanded && catTasks.length > 0 ? '6px' : '0'
                                }}
                            >
                                {catTasks.map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        variant="sidebar"
                                        onDragStart={onDragStart}
                                        onUpdateTask={onUpdateTask}
                                        onDeleteTask={onDeleteTask}
                                        onToggleComplete={onToggleTaskComplete}
                                    />
                                ))}
                                {catTasks.length === 0 && (
                                    <div className="text-xs py-2 px-2" style={{ color: 'var(--text-muted)' }}>
                                        {isDraggedOver ? 'Drop here to add' : 'No tasks — drag here'}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div
                className="p-3 border-t flex items-center justify-between"
                style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}
            >
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-full"
                        style={{ background: 'linear-gradient(135deg, var(--accent), var(--warning))' }}
                    />
                    <div>
                        <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>User</div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Pro</div>
                    </div>
                </div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>v1.2</div>
            </div>
        </div>
    );
};
