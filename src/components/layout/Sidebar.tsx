import React, { useState, useRef } from 'react';
import { Plus, Settings, PanelLeftClose, PanelLeftOpen, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, TaskType } from '../../types';
import { SidebarTaskCard } from '../tasks/SidebarTaskCard';
import { VirtualSidebarList } from './VirtualSidebarList';
import { CATEGORIES } from '../../constants';
import { useTaskContext } from '../../context/TaskContext';

interface SidebarProps {
    onOpenSettings: () => void;
    isOpen: boolean;
    onToggle: () => void;
}

// 6 buttons for even grid
const QUICK_DURATIONS = [15, 30, 45, 60, 90, 120];

export const Sidebar: React.FC<SidebarProps> = ({
    onOpenSettings,
    isOpen,
    onToggle
}) => {
    const {
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        handleDragStart,
        handleDragEnd,
        handleDropOnSidebar,
        isDragging
    } = useTaskContext();

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
        addTask(newTaskTitle.trim(), newTaskDuration, newTaskType);
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
        if (taskId && updateTask) {
            updateTask(taskId, {
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
            handleDropOnSidebar(e);
        }
    };

    const selectedCategory = CATEGORIES.find(c => c.id === newTaskType);

    // Defensive check for tasks
    const safeTasks = Array.isArray(tasks) ? tasks : [];

    return (
        <motion.div
            initial={{ width: 320 }}
            animate={{ width: isOpen ? 320 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full flex flex-col border-r relative z-20 overflow-hidden"
            style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-medium)'
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleSidebarDrop}
        >
            <div className="w-80 h-full flex flex-col">
                {/* Logo */}
                <div className="p-4 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Check size={32} strokeWidth={4} style={{ color: 'var(--accent)' }} />
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-display font-bold leading-none tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                Neuro<span style={{ color: 'var(--accent)' }}>Flow</span>
                            </h1>
                            <p className="text-[9px] font-medium tracking-[0.2em] uppercase leading-none mt-1" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
                                Task Planner
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onToggle}
                            className="p-2.5 rounded-xl transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Collapse Sidebar"
                        >
                            <PanelLeftClose size={18} />
                        </button>
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
                                className="w-full bg-transparent text-sm px-3 py-2.5 rounded-lg placeholder-zinc-500 focus:outline-none border"
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
                <VirtualSidebarList
                    tasks={safeTasks}
                    expandedCategories={expandedCategories}
                    toggleCategory={toggleCategory}
                    dragOverCategory={dragOverCategory}
                    onCategoryDragEnter={handleCategoryDragEnter}
                    onCategoryDragLeave={handleCategoryDragLeave}
                    onCategoryDrop={handleCategoryDrop}
                    isDragging={isDragging}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                    onToggleComplete={toggleTaskComplete}
                />

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
        </motion.div>
    );
};
