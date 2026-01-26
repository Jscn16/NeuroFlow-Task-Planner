import React from 'react';
import { Palette, Eye, EyeOff, List, Clock } from 'lucide-react';
import { themes } from '../../../themes';
import { SettingsSection } from './SettingsSection';

interface SettingsAppearanceProps {
    currentThemeId: string;
    onThemeChange: (themeId: string) => void;
    viewMode?: 'show' | 'fade' | 'hide';
    onViewModeChange?: (mode: 'show' | 'fade' | 'hide') => void;
    dayViewMode?: 'list' | 'timeline';
    onDayViewModeChange?: (mode: 'list' | 'timeline') => void;
}

export const SettingsAppearance: React.FC<SettingsAppearanceProps> = ({
    currentThemeId,
    onThemeChange,
    viewMode = 'fade',
    onViewModeChange,
    dayViewMode = 'list',
    onDayViewModeChange
}) => {
    return (
        <SettingsSection title="Appearance" icon={Palette}>
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

            {/* Day View Mode Toggle */}
            {onDayViewModeChange && (
                <div className="flex items-center justify-between pt-2 mt-2" style={{ borderTop: '1px solid var(--border-light)' }}>
                    <div className="flex items-center gap-2">
                        {dayViewMode === 'timeline' ? <Clock size={14} style={{ color: 'var(--text-muted)' }} /> : <List size={14} style={{ color: 'var(--text-muted)' }} />}
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Day view style</span>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onDayViewModeChange('list')}
                            className="px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1"
                            style={{
                                backgroundColor: dayViewMode === 'list' ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                                color: dayViewMode === 'list' ? 'white' : 'var(--text-muted)'
                            }}
                        >
                            <List size={10} />
                            List
                        </button>
                        <button
                            onClick={() => onDayViewModeChange('timeline')}
                            className="px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1"
                            style={{
                                backgroundColor: dayViewMode === 'timeline' ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                                color: dayViewMode === 'timeline' ? 'white' : 'var(--text-muted)'
                            }}
                        >
                            <Clock size={10} />
                            Timeline
                        </button>
                    </div>
                </div>
            )}
        </SettingsSection>
    );
};
