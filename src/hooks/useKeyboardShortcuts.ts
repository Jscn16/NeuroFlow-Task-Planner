import { useEffect, useCallback } from 'react';

interface KeyboardShortcutHandlers {
    onQuickAdd?: () => void;
    onToggleFocus?: () => void;
    onNavigatePrev?: () => void;
    onNavigateNext?: () => void;
    onShowHelp?: () => void;
    onToggleSidebar?: () => void;
    onCommandPalette?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers, enabled = true) {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!enabled) return;

        // Don't trigger shortcuts when typing in input fields
        const target = e.target as HTMLElement;
        const isInput = target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable;

        // Ctrl/Cmd + K: Command Palette (works even in inputs)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            handlers.onCommandPalette?.();
            return;
        }

        // Ctrl/Cmd + N: Quick Add (works even in inputs)
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            handlers.onQuickAdd?.();
            return;
        }

        // Ctrl/Cmd + Space: Toggle Focus Mode (works even in inputs)
        if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
            e.preventDefault();
            handlers.onToggleFocus?.();
            return;
        }

        // Skip remaining shortcuts if in input
        if (isInput) return;

        // Arrow keys: Navigate weeks
        if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            handlers.onNavigatePrev?.();
            return;
        }

        if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            handlers.onNavigateNext?.();
            return;
        }

        // ?: Show shortcuts help
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
            e.preventDefault();
            handlers.onShowHelp?.();
            return;
        }

        // B: Toggle sidebar
        if (e.key === 'b' || e.key === 'B') {
            e.preventDefault();
            handlers.onToggleSidebar?.();
            return;
        }

        // Escape: Close any open modals (handled by individual modals)
    }, [handlers, enabled]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

// Keyboard shortcuts configuration for help display
export const KEYBOARD_SHORTCUTS = [
    { keys: ['Ctrl', 'K'], description: 'Command palette', mac: ['⌘', 'K'] },
    { keys: ['Ctrl', 'N'], description: 'Quick add new task', mac: ['⌘', 'N'] },
    { keys: ['Ctrl', 'Space'], description: 'Toggle Focus Mode', mac: ['⌘', 'Space'] },
    { keys: ['←'], description: 'Previous week' },
    { keys: ['→'], description: 'Next week' },
    { keys: ['B'], description: 'Toggle sidebar' },
    { keys: ['?'], description: 'Show keyboard shortcuts' },
    { keys: ['Esc'], description: 'Close modal / Cancel' },
];
