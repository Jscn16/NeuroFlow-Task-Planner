import { Shield, ShieldCheck } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { useLanguage } from '../../../context/LanguageContext';

interface SettingsSecurityProps {
    encryptionEnabled?: boolean;
    onEnableEncryption?: () => void;
    onDisableEncryption?: () => void;
}

export const SettingsSecurity: React.FC<SettingsSecurityProps> = ({
    encryptionEnabled = false,
    onEnableEncryption,
    onDisableEncryption
}) => {
    const { t } = useLanguage();
    return (
        <SettingsSection title={t.settings.security} icon={Shield} defaultOpen={false}>
            <div className="space-y-3">
                {/* Encryption Toggle */}
                <div
                    className="p-3 rounded-xl transition-all"
                    style={{
                        backgroundColor: encryptionEnabled ? 'rgba(34,197,94,0.1)' : 'var(--bg-primary)',
                        border: `1px solid ${encryptionEnabled ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {encryptionEnabled
                                ? <ShieldCheck size={16} className="text-emerald-400" />
                                : <Shield size={16} style={{ color: 'var(--text-muted)' }} />
                            }
                            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                {encryptionEnabled ? t.settings.encryptionActive : t.settings.encryptionDisabled}
                            </span>
                        </div>
                        {encryptionEnabled ? (
                            <div className="px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                                {t.settings.activeStatus}
                            </div>
                        ) : onEnableEncryption && (
                            <button
                                onClick={onEnableEncryption}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                style={{
                                    backgroundColor: 'var(--accent)',
                                    color: 'white'
                                }}
                            >
                                {t.settings.enable}
                            </button>
                        )}
                    </div>
                    <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
                        {encryptionEnabled
                            ? t.settings.encryptionDescActive
                            : t.settings.encryptionDescDisabled
                        }
                    </p>
                </div>

                {encryptionEnabled && (
                    <div className="flex gap-2">
                        {onDisableEncryption && (
                            <button
                                onClick={onDisableEncryption}
                                className="flex-1 p-2 rounded-lg text-xs font-semibold border transition-all hover:bg-red-500/10"
                                style={{
                                    borderColor: 'var(--border)',
                                    backgroundColor: 'var(--bg-primary)',
                                    color: 'var(--error)'
                                }}
                            >
                                {t.settings.disable}
                            </button>
                        )}
                        <div className="flex-1 text-[10px] p-2 rounded-lg" style={{
                            color: 'var(--warning)',
                            backgroundColor: 'rgba(251,191,36,0.1)',
                            border: '1px solid rgba(251,191,36,0.2)'
                        }}>
                            ⚠️ {t.settings.passphraseWarning}
                        </div>
                    </div>
                )}
            </div>
        </SettingsSection>
    );
};
