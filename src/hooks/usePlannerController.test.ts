import { describe, it, expect } from 'vitest';
import {
  getProgressColor,
  computeDayStats,

  selectTasksForDay,
  selectTasksForCell,
  isTaskFaded
} from './usePlannerController';
import { Task } from '../types';

// ============================================================================
// Test Data Factories
// ============================================================================

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: Math.random().toString(36).substr(2, 9),
  title: 'Test Task',
  duration: 30,
  type: 'medium',
  status: 'scheduled',
  dueDate: '2024-01-15',
  deadline: null,
  assignedRow: 'FOCUS',
  eisenhowerQuad: null,
  createdAt: Date.now(),
  ...overrides
});

// ============================================================================
// getProgressColor Tests
// ============================================================================

describe('getProgressColor', () => {
  it('returns red at 0%', () => {
    const color = getProgressColor(0);
    expect(color).toBe('rgb(239, 68, 68)');
  });

  it('returns yellow at 50%', () => {
    const color = getProgressColor(50);
    expect(color).toBe('rgb(250, 204, 21)');
  });

  it('returns green at 100%', () => {
    const color = getProgressColor(100);
    expect(color).toBe('rgb(34, 197, 94)');
  });

  it('clamps values below 0', () => {
    const color = getProgressColor(-20);
    expect(color).toBe('rgb(239, 68, 68)');
  });

  it('clamps values above 100', () => {
    const color = getProgressColor(150);
    expect(color).toBe('rgb(34, 197, 94)');
  });

  it('returns intermediate color at 25%', () => {
    const color = getProgressColor(25);
    // Should be between red and yellow
    expect(color).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
  });
});

// ============================================================================
// computeDayStats Tests
// ============================================================================

describe('computeDayStats', () => {
  const targetMinutes = 360; // 6 hours

  it('returns zero stats for empty task list', () => {
    const stats = computeDayStats([], '2024-01-15', targetMinutes);

    expect(stats.dateStr).toBe('2024-01-15');
    expect(stats.totalMinutes).toBe(0);
    expect(stats.completionPercent).toBe(0);
    expect(stats.isOverCapacity).toBe(false);
    expect(stats.isNearCapacity).toBe(false);
  });

  it('calculates correct totals for scheduled tasks', () => {
    const tasks = [
      createTask({ duration: 60, status: 'scheduled' }),
      createTask({ duration: 30, status: 'scheduled' })
    ];

    const stats = computeDayStats(tasks, '2024-01-15', targetMinutes);

    expect(stats.totalMinutes).toBe(90);
    expect(stats.plannedHours).toBe('1.5');
  });

  it('ignores unscheduled tasks', () => {
    const tasks = [
      createTask({ duration: 60, status: 'scheduled' }),
      createTask({ duration: 120, status: 'unscheduled' })
    ];

    const stats = computeDayStats(tasks, '2024-01-15', targetMinutes);

    expect(stats.totalMinutes).toBe(60);
  });

  it('calculates completion percentage correctly', () => {
    const tasks = [
      createTask({ duration: 60, status: 'completed' }),
      createTask({ duration: 60, status: 'scheduled' })
    ];

    const stats = computeDayStats(tasks, '2024-01-15', targetMinutes);

    expect(stats.completionPercent).toBe(50);
  });

  it('detects near-capacity correctly', () => {
    const tasks = [
      createTask({ duration: 300, status: 'scheduled' }) // 5 hours = 83%
    ];

    const stats = computeDayStats(tasks, '2024-01-15', targetMinutes);

    expect(stats.isNearCapacity).toBe(true);
    expect(stats.isOverCapacity).toBe(false);
  });

  it('detects over-capacity correctly', () => {
    const tasks = [
      createTask({ duration: 420, status: 'scheduled' }) // 7 hours = 117%
    ];

    const stats = computeDayStats(tasks, '2024-01-15', targetMinutes);

    expect(stats.isOverCapacity).toBe(true);
  });
});

// ============================================================================
// selectTasksForDay Tests
// ============================================================================

describe('selectTasksForDay', () => {
  it('returns only tasks for the specified date', () => {
    const tasks = [
      createTask({ dueDate: '2024-01-15', status: 'scheduled' }),
      createTask({ dueDate: '2024-01-16', status: 'scheduled' }),
      createTask({ dueDate: '2024-01-15', status: 'completed' })
    ];

    const result = selectTasksForDay(tasks, '2024-01-15');

    expect(result).toHaveLength(2);
    expect(result.every(t => t.dueDate === '2024-01-15')).toBe(true);
  });

  it('excludes unscheduled tasks', () => {
    const tasks = [
      createTask({ dueDate: '2024-01-15', status: 'scheduled' }),
      createTask({ dueDate: '2024-01-15', status: 'unscheduled' })
    ];

    const result = selectTasksForDay(tasks, '2024-01-15');

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('scheduled');
  });
});

// ============================================================================
// selectTasksForCell Tests
// ============================================================================

describe('selectTasksForCell', () => {
  it('returns tasks matching date and row', () => {
    const tasks = [
      createTask({ dueDate: '2024-01-15', assignedRow: 'FOCUS', status: 'scheduled' }),
      createTask({ dueDate: '2024-01-15', assignedRow: 'WORK', status: 'scheduled' }),
      createTask({ dueDate: '2024-01-16', assignedRow: 'FOCUS', status: 'scheduled' })
    ];

    const result = selectTasksForCell(tasks, '2024-01-15', 'FOCUS', 'show');

    expect(result).toHaveLength(1);
    expect(result[0].assignedRow).toBe('FOCUS');
  });

  it('hides completed tasks in hide mode', () => {
    const tasks = [
      createTask({ dueDate: '2024-01-15', assignedRow: 'FOCUS', status: 'completed' }),
      createTask({ dueDate: '2024-01-15', assignedRow: 'FOCUS', status: 'scheduled' })
    ];

    const result = selectTasksForCell(tasks, '2024-01-15', 'FOCUS', 'hide');

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('scheduled');
  });

  it('shows completed tasks in show mode', () => {
    const tasks = [
      createTask({ dueDate: '2024-01-15', assignedRow: 'FOCUS', status: 'completed' })
    ];

    const result = selectTasksForCell(tasks, '2024-01-15', 'FOCUS', 'show');

    expect(result).toHaveLength(1);
  });
});

// ============================================================================
// isTaskFaded Tests
// ============================================================================

describe('isTaskFaded', () => {
  it('returns true for completed task in fade mode', () => {
    const task = createTask({ status: 'completed' });
    expect(isTaskFaded(task, 'fade')).toBe(true);
  });

  it('returns false for completed task in show mode', () => {
    const task = createTask({ status: 'completed' });
    expect(isTaskFaded(task, 'show')).toBe(false);
  });

  it('returns false for scheduled task in fade mode', () => {
    const task = createTask({ status: 'scheduled' });
    expect(isTaskFaded(task, 'fade')).toBe(false);
  });
});
