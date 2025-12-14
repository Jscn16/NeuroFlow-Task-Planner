import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Target,
    FileText,
    Calendar,
    Settings,
    Search,
    Palette,
    Command as CommandIcon
} from 'lucide-react';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onNewTask: () => void;
    onOpenSettings: () => void;
    onGoToToday: () => void;
    onOpenBrainDump: () => void;
}

interface CommandItem {
    id: string;
    label: string;
    shortcut?: string;
    icon: React.ReactNode;
    action: () => void;
    keywords?: string[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
    isOpen,
    onClose,
    onNewTask,
    onOpenSettings,
    onGoToToday,
    onOpenBrainDump,
}) => {
    const [search, setSearch] = useState('');

    // Define commands
    const commands: CommandItem[] = [
        {
            id: 'new-task',
            label: 'New Task',
            shortcut: 'N',
            icon: <Plus size={18} />,
            action: () => {
                onClose();
                onNewTask();
            },
            keywords: ['add', 'create', 'task', 'new'],
        },
        {
            id: 'today',
            label: 'Go to Today',
            shortcut: 'T',
            icon: <Calendar size={18} />,
            action: () => {
                onClose();
                onGoToToday();
            },
            keywords: ['today', 'now', 'current'],
        },
        {
            id: 'brain-dump',
            label: 'Brain Dump',
            shortcut: 'B',
            icon: <FileText size={18} />,
            action: () => {
                onClose();
                onOpenBrainDump();
            },
            keywords: ['notes', 'brain', 'dump', 'write'],
        },
        {
            id: 'settings',
            label: 'Open Settings',
            shortcut: ',',
            icon: <Settings size={18} />,
            action: () => {
                onClose();
                onOpenSettings();
            },
            keywords: ['settings', 'preferences', 'options', 'config'],
        },
    ];

    // Reset search when closed
    useEffect(() => {
        if (!isOpen) {
            setSearch('');
        }
    }, [isOpen]);

    // Handle keyboard shortcuts within palette
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Command palette */}
                    <motion.div
                        className="fixed left-1/2 top-[20%] z-[101] w-full max-w-[520px] -translate-x-1/2"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Command
                            className="rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                            loop
                        >
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                                <Search size={18} className="text-zinc-500" />
                                <Command.Input
                                    value={search}
                                    onValueChange={setSearch}
                                    placeholder="Type a command or search..."
                                    className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                                    autoFocus
                                />
                                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-zinc-500 bg-white/5 rounded border border-white/10">
                                    ESC
                                </kbd>
                            </div>

                            {/* Command list */}
                            <Command.List className="max-h-[300px] overflow-y-auto p-2">
                                <Command.Empty className="py-6 text-center text-sm text-zinc-500">
                                    No results found.
                                </Command.Empty>

                                <Command.Group heading="Actions" className="mb-2">
                                    <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                                        Quick Actions
                                    </div>
                                    {commands.map((cmd) => (
                                        <Command.Item
                                            key={cmd.id}
                                            value={cmd.label + ' ' + (cmd.keywords?.join(' ') || '')}
                                            onSelect={cmd.action}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-zinc-300 hover:bg-white/5 data-[selected=true]:bg-white/10 data-[selected=true]:text-white transition-colors"
                                        >
                                            <span className="text-zinc-500">{cmd.icon}</span>
                                            <span className="flex-1 text-sm font-medium">{cmd.label}</span>
                                            {cmd.shortcut && (
                                                <kbd className="px-2 py-0.5 text-[10px] font-semibold text-zinc-500 bg-white/5 rounded border border-white/10">
                                                    {cmd.shortcut}
                                                </kbd>
                                            )}
                                        </Command.Item>
                                    ))}
                                </Command.Group>
                            </Command.List>

                            {/* Footer hint */}
                            <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 text-[10px] text-zinc-500">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">↑</kbd>
                                        <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">↓</kbd>
                                        to navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10">↵</kbd>
                                        to select
                                    </span>
                                </div>
                                <span className="flex items-center gap-1">
                                    <CommandIcon size={12} />
                                    <span>K to toggle</span>
                                </span>
                            </div>
                        </Command>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
