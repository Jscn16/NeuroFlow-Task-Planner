import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cog, ArrowRight, Moon, Palette } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { modalVariants } from '../../utils/animations';

interface SettingsModalProps {
    onClose: () => void;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onExport, onImport }) => {
    const { theme, setTheme } = useTheme();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            >
                <motion.div
                    variants={modalVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-8 w-96 shadow-lg relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-medium text-[var(--text-primary)] mb-8 flex items-center gap-2">
                        <Cog size={20} className="text-[var(--text-secondary)]" /> Settings
                    </h2>

                    <div className="space-y-6">
                        {/* Theme Selection */}
                        <div>
                            <h3 className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Palette size={12} /> Appearance
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                                        theme === 'dark'
                                            ? 'bg-[var(--bg-tertiary)] border-[var(--border-hover)] text-[var(--text-primary)]'
                                            : 'bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Moon size={14} />
                                        <span className="text-sm font-medium">Dark</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setTheme('neutral')}
                                    className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                                        theme === 'neutral'
                                            ? 'bg-[var(--bg-tertiary)] border-[var(--border-hover)] text-[var(--text-primary)]'
                                            : 'bg-[var(--bg-primary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Palette size={14} />
                                        <span className="text-sm font-medium">Neutral</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Data Management */}
                        <div>
                            <h3 className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                                Data Management
                            </h3>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={onExport}
                                    className="w-full text-left px-4 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] transition-all"
                                >
                                    Export Data (.json)
                                </button>
                                <label className="w-full text-left px-4 py-2.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] transition-all cursor-pointer flex items-center justify-between group">
                                    <span>Import Data (.json)</span>
                                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-[var(--text-secondary)] transition-opacity" />
                                    <input type="file" accept=".json" onChange={onImport} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
