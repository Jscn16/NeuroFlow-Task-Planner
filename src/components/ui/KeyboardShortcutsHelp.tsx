import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import { KEYBOARD_SHORTCUTS } from '../../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
    isOpen,
    onClose
}) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if ((e.key === 'Escape' || e.key === '?') && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    className="relative w-full max-w-md mx-4 rounded-2xl border shadow-2xl overflow-hidden"
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-medium)'
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                        <div className="flex items-center gap-2">
                            <Keyboard size={18} style={{ color: 'var(--accent)' }} />
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Keyboard Shortcuts</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Shortcuts List */}
                    <div className="p-4 space-y-2">
                        {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors"
                            >
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {shortcut.description}
                                </span>
                                <div className="flex items-center gap-1">
                                    {(isMac && shortcut.mac ? shortcut.mac : shortcut.keys).map((key, i) => (
                                        <React.Fragment key={i}>
                                            <kbd
                                                className="px-2 py-1 rounded text-xs font-mono font-medium"
                                                style={{
                                                    backgroundColor: 'var(--bg-tertiary)',
                                                    color: 'var(--text-primary)',
                                                    border: '1px solid var(--border-light)'
                                                }}
                                            >
                                                {key}
                                            </kbd>
                                            {i < (isMac && shortcut.mac ? shortcut.mac : shortcut.keys).length - 1 && (
                                                <span style={{ color: 'var(--text-muted)' }}>+</span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-tertiary)' }}>
                        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                            Press <kbd className="px-1.5 py-0.5 mx-1 rounded text-[10px] font-mono" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>?</kbd> anytime to show this help
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
