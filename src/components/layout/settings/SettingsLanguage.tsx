import { useLanguage } from '../../../context/LanguageContext';
import { SettingsSection } from './SettingsSection';
import { Languages } from 'lucide-react';

export const SettingsLanguage: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();

    return (
        <SettingsSection title={t.settings.language} icon={Languages} defaultOpen={false}>
            <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
                {t.settings.selectLanguage}
            </p>
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${language === 'en'
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                        : 'bg-black/20 border-theme text-white/40 hover:bg-black/30'
                        }`}
                    style={{
                        backgroundColor: language === 'en' ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-primary)',
                        borderColor: language === 'en' ? 'rgba(99, 102, 241, 0.5)' : 'var(--border)'
                    }}
                >
                    English
                </button>
                <button
                    onClick={() => setLanguage('de')}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${language === 'de'
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                        : 'bg-black/20 border-theme text-white/40 hover:bg-black/30'
                        }`}
                    style={{
                        backgroundColor: language === 'de' ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-primary)',
                        borderColor: language === 'de' ? 'rgba(99, 102, 241, 0.5)' : 'var(--border)'
                    }}
                >
                    Deutsch
                </button>
            </div>
        </SettingsSection>
    );
};
