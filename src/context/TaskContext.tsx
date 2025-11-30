import React, { createContext, useContext, ReactNode } from 'react';
import { useTaskManager } from '../hooks/useTaskManager';
import { Task, TaskType, GridRow } from '../types';

interface TaskContextType {
    tasks: Task[];
    addTask: (title: string, duration: number, type: TaskType) => void;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    deleteTask: (taskId: string) => void;
    toggleTaskComplete: (taskId: string) => void;
    handleReorderTasks: (sourceId: string, targetId: string) => void;
    handleDragStart: (e: React.DragEvent, taskId: string) => void;
    handleDragEnd: (e: React.DragEvent) => void;
    isDragging: boolean;
    handleDropOnGrid: (e: React.DragEvent, day: Date, row: GridRow | null) => void;
    handleDropOnSidebar: (e: React.DragEvent) => void;
    handleDropOnEisenhower: (e: React.DragEvent, quad: 'do' | 'decide' | 'delegate' | 'delete') => void;
    clearRescheduledTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
    children: ReactNode;
    initialTasks: Task[];
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children, initialTasks }) => {
    const taskManager = useTaskManager(initialTasks);

    return (
        <TaskContext.Provider value={taskManager}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};
