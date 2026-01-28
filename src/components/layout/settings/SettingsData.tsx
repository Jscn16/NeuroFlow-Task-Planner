import { Cloud, CloudOff, Download, Upload, LogOut } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { useLanguage } from '../../../context/LanguageContext';

interface SettingsDataProps {
    supabaseEnabled: boolean;
    onToggleSupabase: (enabled: boolean) => void;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onLogout?: () => void;
    onClose: () => void;
}

export const SettingsData: React.FC<SettingsDataProps> = ({
    supabaseEnabled,
    onToggleSupabase,
    onExport,
    onImport,
    onLogout,
    onClose
}) => {
    const { t } = useLanguage();
    return (
        <SettingsSection title={t.settings.dataSync} icon={Cloud} defaultOpen={false}>
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
                        {supabaseEnabled ? t.settings.cloudSyncEnabled : t.settings.localOnly}
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
                    style={{
                        borderColor: 'var(--border)',
                        backgroundColor: 'var(--bg-primary)'
                    }}
                >
                    <Download size={16} style={{ color: 'var(--accent)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{t.settings.export}</span>
                </button>
                <label
                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all hover:bg-white/[0.03] cursor-pointer"
                    style={{
                        borderColor: 'var(--border)',
                        backgroundColor: 'var(--bg-primary)'
                    }}
                >
                    <Upload size={16} style={{ color: 'var(--accent)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{t.settings.import}</span>
                    <input type="file" accept=".json" onChange={onImport} className="hidden" />
                </label>
            </div>

            {supabaseEnabled && onLogout && (
                <button
                    onClick={() => {
                        if (window.confirm(t.settings.signOutConfirm)) {
                            onLogout();
                            onClose();
                        }
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border transition-all hover:bg-rose-500/10"
                    style={{ borderColor: 'var(--border-light)' }}
                >
                    <LogOut size={16} className="text-rose-400" />
                    <span className="text-sm text-rose-400">{t.settings.signOut}</span>
                </button>
            )}
        </SettingsSection>
    );
};
