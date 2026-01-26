import React from 'react';
import { Shield, ShieldCheck } from 'lucide-react';
import { SettingsSection } from './SettingsSection';

interface SettingsSecurityProps {
    encryptionEnabled?: boolean;
    onEnableEncryption?: () => void;
}

export const SettingsSecurity: React.FC<SettingsSecurityProps> = ({
    encryptionEnabled = false,
    onEnableEncryption
}) => {
    return (
        <SettingsSection title="Security" icon={Shield} defaultOpen={false}>
            <div className="space-y-3">
                {/* Encryption Toggle */}
                <div
                    className="p-3 rounded-xl transition-all"
                    style={{
                        backgroundColor: encryptionEnabled ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${encryptionEnabled ? 'rgba(34,197,94,0.3)' : 'var(--border-light)'}`
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {encryptionEnabled
                                ? <ShieldCheck size={16} className="text-emerald-400" />
                                : <Shield size={16} style={{ color: 'var(--text-muted)' }} />
                            }
                            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                {encryptionEnabled ? 'Encryption enabled' : 'End-to-end encryption'}
                            </span>
                        </div>
                        {encryptionEnabled ? (
                            <div className="px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                                Active
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
                                Enable
                            </button>
                        )}
                    </div>
                    <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
                        {encryptionEnabled
                            ? 'Your data is encrypted with your passphrase. Only you can read it.'
                            : 'Encrypt your data with a passphrase. No one (including us) can read your data.'
                        }
                    </p>
                </div>

                {encryptionEnabled && (
                    <p className="text-[10px] p-2 rounded-lg" style={{
                        color: 'var(--warning)',
                        backgroundColor: 'rgba(251,191,36,0.1)',
                        border: '1px solid rgba(251,191,36,0.2)'
                    }}>
                        ⚠️ If you forget your passphrase, your data cannot be recovered.
                    </p>
                )}
            </div>
        </SettingsSection>
    );
};
