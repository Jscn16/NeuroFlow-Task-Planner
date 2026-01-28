import { HelpCircle } from 'lucide-react';
import { SettingsSection } from './SettingsSection';
import { useLanguage } from '../../../context/LanguageContext';

interface SettingsHelpProps {
    onResetTour?: () => void;
    onClose: () => void;
}

export const SettingsHelp: React.FC<SettingsHelpProps> = ({
    onResetTour,
    onClose
}) => {
    const { t } = useLanguage();
    if (!onResetTour) return null;

    return (
        <SettingsSection title={t.settings.help} icon={HelpCircle} defaultOpen={false}>
            <button
                onClick={() => {
                    onResetTour();
                    onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all hover:bg-white/[0.03]"
                style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--bg-primary)'
                }}
            >
                <HelpCircle size={16} style={{ color: 'var(--accent)' }} />
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{t.settings.resetTour}</span>
            </button>
        </SettingsSection>
    );
};
