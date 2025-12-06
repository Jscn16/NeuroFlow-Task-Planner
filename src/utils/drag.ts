import type React from 'react';

/**
 * Normalize the drag payload so every drop target can read the task id
 * regardless of browser quirks around custom dataTransfer types.
 */
export function setTaskDragData(e: React.DragEvent, taskId: string) {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('application/task-id', taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.dropEffect = 'move';
}

/**
 * Read the task id from any of the formats we set during drag start.
 */
export function getTaskIdFromDragEvent(e: React.DragEvent): string {
    return (
        e.dataTransfer.getData('taskId') ||
        e.dataTransfer.getData('application/task-id') ||
        e.dataTransfer.getData('text/plain') ||
        ''
    );
}
