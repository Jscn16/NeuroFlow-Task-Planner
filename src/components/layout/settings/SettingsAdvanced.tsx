import { AlertTriangle, RotateCcw, BarChart3, Trash2 } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { useLanguage } from '../../../context/LanguageContext';

interface SettingsAdvancedProps {
    onClearRescheduled?: () => void;
    onResetStats?: () => void;
    onDeleteAllTasks?: () => void;
}

export const SettingsAdvanced: React.FC<SettingsAdvancedProps> = ({
    onResetStats,
    onDeleteAllTasks
}) => {
    const { t } = useLanguage();
    const handleDeleteAll = () => {
        const input = window.prompt(t.settings.deleteAllWarn, '');
        const confirmStr = t.header.work === 'Arbeit' ? 'SICHER' : 'SURE';
        if (input !== confirmStr) {
            if (input !== null) alert(t.settings.deleteAllCancel);
            return;
        }
        onDeleteAllTasks?.();
    };

    return (
        <SettingsSection title={t.settings.advanced} icon={AlertTriangle} defaultOpen={false} variant="danger">
            <div className="space-y-2">
                {/* Reset Schedule Trails removed as requested */}

                {onResetStats && (
                    <button
                        onClick={() => {
                            if (window.confirm(t.settings.resetStatsConfirm)) {
                                onResetStats();
                            }
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-rose-500/10"
                        style={{ border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                        <BarChart3 size={16} className="text-rose-400" />
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{t.settings.resetStatsBtn}</span>
                    </button>
                )}

                {onDeleteAllTasks && (
                    <button
                        onClick={handleDeleteAll}
                        className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-rose-500/10"
                        style={{ border: '1px solid rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.05)' }}
                    >
                        <Trash2 size={16} className="text-rose-400" />
                        <span className="text-sm text-rose-300">{t.settings.deleteAllBtn}</span>
                    </button>
                )}
            </div>
        </SettingsSection>
    );
};
