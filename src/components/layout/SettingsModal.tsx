import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Palette, Moon, Download, Upload, Cloud, CloudOff, HelpCircle, AlertTriangle, Trash2, RotateCcw, Snowflake, Eye, EyeOff } from 'lucide-react';
import { themes } from '../../themes';
import { modal } from '../../utils/animations';
import { FrostOverlay } from '../ui/FrostOverlay';
import { useIceSound } from '../../hooks/useIceSound';
import { getDayBoundaryHour, setDayBoundaryHour } from '../../constants';

interface SettingsModalProps {
    onClose: () => void;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDeleteAllTasks?: () => void;
    onFreezeOverloaded?: () => void;
    onClearRescheduled?: () => void;
    currentThemeId: string;
    onThemeChange: (themeId: string) => void;
    viewMode?: 'show' | 'fade' | 'hide';
    onViewModeChange?: (mode: 'show' | 'fade' | 'hide') => void;
    supabaseEnabled: boolean;
    onToggleSupabase: (enabled: boolean) => void;
    onAddSampleTasks?: () => void;
    sampleTasksAdded?: boolean;
    showSampleTasks?: boolean;
    onResetTour?: () => void;
}

// Collapsible Section Component
const Section = ({
    title,
    icon: Icon,
    children,
    defaultOpen = true,
    variant = 'default'
}: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    defaultOpen?: boolean;
    variant?: 'default' | 'danger';
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="rounded-2xl overflow-hidden" style={{
            backgroundColor: variant === 'danger' ? 'rgba(239,68,68,0.03)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${variant === 'danger' ? 'rgba(239,68,68,0.15)' : 'var(--border-light)'}`
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 transition-colors hover:bg-white/[0.02]"
            >
                <div className="flex items-center gap-3">
                    <Icon size={18} style={{ color: variant === 'danger' ? 'var(--error)' : 'var(--accent)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {title}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    style={{ color: 'var(--text-muted)' }}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-3">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
    onClose,
    onExport,
    onImport,
    onDeleteAllTasks,
    onFreezeOverloaded,
    onClearRescheduled,
    currentThemeId,
    onThemeChange,
    viewMode = 'fade',
    onViewModeChange,
    supabaseEnabled,
    onToggleSupabase,
    onResetTour
}) => {
    const [freezing, setFreezing] = useState(false);
    const [dayBoundary, setDayBoundaryState] = useState(getDayBoundaryHour);
    const { play } = useIceSound();

    const handleDoomLoop = () => {
        if (!onFreezeOverloaded) return;
        const confirmed = window.confirm('Freeze everything and start fresh? This will move overdue tasks to the Icebox.');
        if (!confirmed) return;

        play();
        setFreezing(true);
        setTimeout(() => onFreezeOverloaded(), 500);
        setTimeout(() => setFreezing(false), 1500);
    };

    const handleDeleteAll = () => {
        const input = window.prompt('Type SURE to delete ALL data. This cannot be undone.', '');
        if (input !== 'SURE') {
            if (input !== null) alert('Deletion cancelled. Type SURE (all caps) to confirm.');
            return;
        }
        onDeleteAllTasks?.();
    };

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center z-50"
                onClick={onClose}
            >
                <motion.div
                    variants={modal}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="relative w-full max-h-[90vh] md:max-h-[85vh] md:max-w-sm rounded-t-3xl md:rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-medium)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 pb-3" style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                            Settings
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                            style={{ color: 'var(--text-muted)' }}
                            aria-label="Close settings"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(90vh-120px)] md:max-h-[calc(85vh-120px)]">

                        {/* Theme Section */}
                        <Section title="Appearance" icon={Palette}>
                            <div className="grid grid-cols-3 gap-2">
                                {themes.map((theme) => {
                                    const isSelected = theme.id === currentThemeId;
                                    return (
                                        <button
                                            key={theme.id}
                                            onClick={() => onThemeChange(theme.id)}
                                            className="relative p-2.5 rounded-xl border transition-all hover:scale-[1.02]"
                                            style={{
                                                backgroundColor: isSelected ? 'var(--accent-muted)' : 'transparent',
                                                borderColor: isSelected ? 'var(--accent)' : 'var(--border-light)'
                                            }}
                                        >
                                            <div className="flex gap-0.5 mb-1.5 justify-center">
                                                <div className="w-3 h-3 rounded" style={{ backgroundColor: theme.colors.bgPrimary, border: '1px solid rgba(255,255,255,0.1)' }} />
                                                <div className="w-3 h-3 rounded" style={{ backgroundColor: theme.colors.accent }} />
                                            </div>
                                            <span className="text-[10px] font-medium block text-center" style={{ color: isSelected ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                                {theme.name.split(' ')[0]}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Completed Tasks Toggle */}
                            {onViewModeChange && (
                                <div className="flex items-center justify-between pt-2 mt-2" style={{ borderTop: '1px solid var(--border-light)' }}>
                                    <div className="flex items-center gap-2">
                                        {viewMode === 'hide' ? <EyeOff size={14} style={{ color: 'var(--text-muted)' }} /> : <Eye size={14} style={{ color: 'var(--text-muted)' }} />}
                                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Completed tasks</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {(['show', 'fade', 'hide'] as const).map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => onViewModeChange(mode)}
                                                className="px-2.5 py-1 rounded-md text-[10px] font-semibold capitalize transition-all"
                                                style={{
                                                    backgroundColor: viewMode === mode ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                                                    color: viewMode === mode ? 'white' : 'var(--text-muted)'
                                                }}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Section>

                        {/* Day Boundary Section */}
                        <Section title="Night Owl Mode" icon={Moon}>
                            <p className="text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>
                                When does your day reset? Tasks before this time count as yesterday.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Day ends at</span>
                                <div className="flex items-center gap-1">
                                    {[3, 4, 5, 6, 7].map((hour) => (
                                        <button
                                            key={hour}
                                            onClick={() => {
                                                setDayBoundaryState(hour);
                                                setDayBoundaryHour(hour);
                                            }}
                                            className="w-9 h-8 rounded-lg text-xs font-bold transition-all"
                                            style={{
                                                backgroundColor: dayBoundary === hour ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                                                color: dayBoundary === hour ? 'white' : 'var(--text-muted)'
                                            }}
                                        >
                                            {hour}am
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* Data & Sync Section */}
                        <Section title="Data & Sync" icon={Cloud} defaultOpen={false}>
                            {/* Sync Toggle */}
                            <button
                                onClick={() => onToggleSupabase(!supabaseEnabled)}
                                className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
                                style={{
                                    backgroundColor: supabaseEnabled ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${supabaseEnabled ? 'rgba(34,197,94,0.3)' : 'var(--border-light)'}`
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    {supabaseEnabled
                                        ? <Cloud size={16} className="text-emerald-400" />
                                        : <CloudOff size={16} style={{ color: 'var(--text-muted)' }} />
                                    }
                                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                        {supabaseEnabled ? 'Cloud sync enabled' : 'Local only'}
                                    </span>
                                </div>
                                <div
                                    className="w-10 h-6 rounded-full relative transition-all"
                                    style={{ backgroundColor: supabaseEnabled ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)' }}
                                >
                                    <div
                                        className="absolute top-1 w-4 h-4 rounded-full transition-all"
                                        style={{
                                            backgroundColor: supabaseEnabled ? '#22c55e' : 'var(--text-muted)',
                                            left: supabaseEnabled ? '22px' : '4px'
                                        }}
                                    />
                                </div>
                            </button>

                            {/* Export/Import */}
                            <div className="flex gap-2">
                                <button
                                    onClick={onExport}
                                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all hover:bg-white/[0.03]"
                                    style={{ borderColor: 'var(--border-light)' }}
                                >
                                    <Download size={16} style={{ color: 'var(--accent)' }} />
                                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Export</span>
                                </button>
                                <label
                                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all hover:bg-white/[0.03] cursor-pointer"
                                    style={{ borderColor: 'var(--border-light)' }}
                                >
                                    <Upload size={16} style={{ color: 'var(--accent)' }} />
                                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Import</span>
                                    <input type="file" accept=".json" onChange={onImport} className="hidden" />
                                </label>
                            </div>
                        </Section>

                        {/* Help Section */}
                        {onResetTour && (
                            <Section title="Help" icon={HelpCircle} defaultOpen={false}>
                                <button
                                    onClick={() => {
                                        onResetTour();
                                        onClose();
                                    }}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all hover:bg-white/[0.03]"
                                    style={{ borderColor: 'var(--border-light)' }}
                                >
                                    <HelpCircle size={16} style={{ color: 'var(--accent)' }} />
                                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Replay Tutorial</span>
                                </button>
                            </Section>
                        )}

                        {/* Advanced Section */}
                        <Section title="Advanced" icon={AlertTriangle} defaultOpen={false} variant="danger">
                            <div className="space-y-2">
                                {onClearRescheduled && (
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Clear all rescheduled task trails?')) {
                                                onClearRescheduled();
                                            }
                                        }}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-rose-500/10"
                                        style={{ border: '1px solid rgba(239,68,68,0.2)' }}
                                    >
                                        <RotateCcw size={16} className="text-rose-400" />
                                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Reset Schedule Trails</span>
                                    </button>
                                )}

                                {onFreezeOverloaded && (
                                    <button
                                        onClick={handleDoomLoop}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-rose-500/10"
                                        style={{ border: '1px solid rgba(239,68,68,0.2)' }}
                                    >
                                        <Snowflake size={16} className="text-rose-400" />
                                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Freeze Overdue Tasks</span>
                                    </button>
                                )}

                                {onDeleteAllTasks && (
                                    <button
                                        onClick={handleDeleteAll}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-rose-500/10"
                                        style={{ border: '1px solid rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.05)' }}
                                    >
                                        <Trash2 size={16} className="text-rose-400" />
                                        <span className="text-sm text-rose-300">Delete All Data</span>
                                    </button>
                                )}
                            </div>
                        </Section>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 text-center" style={{ borderTop: '1px solid var(--border-light)' }}>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            NeuroFlow v1.3
                        </span>
                    </div>

                    <FrostOverlay isVisible={freezing} />
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
