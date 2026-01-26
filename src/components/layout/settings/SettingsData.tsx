import React from 'react';
import { Cloud, CloudOff, Download, Upload, LogOut } from 'lucide-react';
import { SettingsSection } from './SettingsSection';

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
    return (
        <SettingsSection title="Data & Sync" icon={Cloud} defaultOpen={supabaseEnabled}>
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

            {supabaseEnabled && onLogout && (
                <button
                    onClick={() => {
                        if (window.confirm('Sign out of your account? Your data will stay synced.')) {
                            onLogout();
                            onClose();
                        }
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border transition-all hover:bg-rose-500/10"
                    style={{ borderColor: 'var(--border-light)' }}
                >
                    <LogOut size={16} className="text-rose-400" />
                    <span className="text-sm text-rose-400">Sign Out</span>
                </button>
            )}
        </SettingsSection>
    );
};
