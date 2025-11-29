import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskManager } from './TaskManager';
import { Task } from '../types';

describe('TaskManager', () => {
    let taskManager: TaskManager;
    const initialTasks: Task[] = [
        { id: '1', title: 'Test Task', duration: 60, type: 'high', status: 'unscheduled', dueDate: null, assignedRow: null, eisenhowerQuad: null, createdAt: Date.now() }
    ];

    beforeEach(() => {
        taskManager = new TaskManager(initialTasks);
    });

    it('should initialize with tasks', () => {
        expect(taskManager.getTasks()).toHaveLength(1);
        expect(taskManager.getTasks()[0].title).toBe('Test Task');
    });

    it('should add a task', () => {
        const listener = vi.fn();
        taskManager.subscribe(listener);

        taskManager.addTask('New Task', 30, 'medium');

        expect(taskManager.getTasks()).toHaveLength(2);
        expect(listener).toHaveBeenCalledTimes(2); // Initial + Update
        expect(taskManager.getTasks()[1].title).toBe('New Task');
    });

    it('should update a task', () => {
        taskManager.updateTask('1', { title: 'Updated Task' });
        expect(taskManager.getTasks()[0].title).toBe('Updated Task');
    });

    it('should delete a task', () => {
        taskManager.deleteTask('1');
        expect(taskManager.getTasks()).toHaveLength(0);
    });

    it('should toggle task completion', () => {
        // Complete
        taskManager.toggleTaskComplete('1');
        expect(taskManager.getTasks()[0].status).toBe('completed');

        // Uncomplete (should go back to unscheduled since no due date)
        taskManager.toggleTaskComplete('1');
        expect(taskManager.getTasks()[0].status).toBe('unscheduled');
    });

    it('should schedule a task', () => {
        const date = new Date('2023-01-01');
        taskManager.scheduleTask('1', date, 'FOCUS');

        const task = taskManager.getTasks()[0];
        expect(task.status).toBe('scheduled');
        expect(task.dueDate).toBe('2023-01-01');
        expect(task.assignedRow).toBe('FOCUS');
    });
});
