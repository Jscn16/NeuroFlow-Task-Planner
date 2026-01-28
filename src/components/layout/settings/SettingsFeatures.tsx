import React from 'react';
import { ToggleLeft, CalendarDays, ListChecks, CheckCircle2 } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { useCalendarEnabled, ViewStrategy } from '../../../hooks/useCalendarEnabled';
import { useLanguage } from '../../../context/LanguageContext';

export const SettingsFeatures: React.FC = () => {
    const { viewStrategy, setViewStrategy, isCalendarEnabled } = useCalendarEnabled();
    const { t } = useLanguage();

    const options: { id: ViewStrategy; label: string; desc: string; icon: React.ElementType }[] = [
        {
            id: 'priority',
            label: t.header?.priority || 'Priority Only',
            desc: "Focus on tasks. List view only.",
            icon: ListChecks
        },
        {
            id: 'both',
            label: "Priority + Calendar",
            desc: "Switch between List and Timeline.",
            icon: ToggleLeft
        },
        {
            id: 'calendar',
            label: t.header?.calendar || 'Calendar Only',
            desc: "Focus on time. Timeline view only.",
            icon: CalendarDays
        }
    ];

    return (
        <SettingsSection title={t.settings.features || "Features"} icon={ToggleLeft} defaultOpen={true}>
            <div className="space-y-4">
                <div className="text-sm font-semibold text-[var(--text-secondary)] px-1">
                    {t.settings.viewPreference || "View Preference"}
                </div>

                <div className="grid gap-3">
                    {options.map((opt) => {
                        const isSelected = viewStrategy === opt.id;
                        return (
                            <button
                                key={opt.id}
                                onClick={() => setViewStrategy(opt.id)}
                                className={`
                                    relative flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200
                                    ${isSelected
                                        ? 'bg-[var(--accent)]/10 border-[var(--accent)] shadow-[0_0_20px_-10px_var(--accent)]'
                                        : 'bg-[var(--bg-primary)] border-[var(--border)] hover:bg-[var(--bg-surface-strong)]'
                                    }
                                `}
                            >
                                <div className={`p-2.5 rounded-lg transition-colors ${isSelected ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>
                                    <opt.icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className={`font-semibold text-sm ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                        {opt.label}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)] mt-0.5">
                                        {opt.desc}
                                    </div>
                                </div>
                                {isSelected && (
                                    <div className="absolute right-4 text-[var(--accent)]">
                                        <CheckCircle2 size={20} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </SettingsSection>
    );
};
