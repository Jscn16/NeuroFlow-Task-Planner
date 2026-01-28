import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Briefcase, Lock } from 'lucide-react';
import { getSpacesEnabled, setSpacesEnabled } from '../../../state/features';
import { getSpace, setSpace } from '../../../state/space';
import { migrateDataToSpaces } from '../../../utils/migration';
import { StorageService } from '../../../services/StorageService';
import { SupabaseDataService } from '../../../services/supabaseDataService';
import { logger } from '../../../utils/logger';

import { SettingsSection } from './SettingsSection';

import { useLanguage } from '../../../context/LanguageContext';

interface SettingsSpacesProps {
    supabaseEnabled: boolean;
}

export const SettingsSpaces: React.FC<SettingsSpacesProps> = ({ supabaseEnabled }) => {
    const { t } = useLanguage();
    const [enabled, setEnabled] = useState(getSpacesEnabled());
    const [isMigrating, setIsMigrating] = useState(false);

    useEffect(() => {
        setEnabled(getSpacesEnabled());
    }, []);

    const handleToggle = async () => {
        const newState = !enabled;

        if (newState) {
            // Enabling: Trigger migration if needed
            setIsMigrating(true);
            try {
                // 1. Identify users default space as private initially
                setSpace('private');

                // 2. Perform migration logic (client-side)
                const storage = StorageService.getInstance();
                const appData = storage.load();

                if (appData) {
                    const migrated = migrateDataToSpaces(appData);
                    storage.save(migrated);
                }

                // 3. Set flag
                setSpacesEnabled(true);
                setEnabled(true);
                logger.info('Spaces enabled and migration attempted.');
            } catch (e) {
                logger.error('Migration failed during enable', e);
            } finally {
                setIsMigrating(false);
            }
        } else {
            // Disabling
            setSpacesEnabled(false);
            setEnabled(false);
            // Ensure we are back in private mode
            setSpace('private');
            logger.info('Spaces disabled.');
        }
    };

    return (
        <SettingsSection
            title={t.settings.spaces?.title || "Work / Private Mode"}
            icon={Briefcase}
            defaultOpen={false}
        >
            <div
                className="p-4 rounded-xl border transition-all duration-200"
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-light)'
                }}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: 'var(--accent-muted)', color: 'var(--accent)' }}
                        >
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{t.settings.spaces?.enable || "Enable Work Space"}</h4>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {t.settings.spaces?.desc || "Separates tasks and entries into Work and Private spaces."}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleToggle}
                        disabled={isMigrating}
                        className="transition-colors duration-200 focus:outline-none"
                        style={{ color: enabled ? 'var(--accent)' : 'var(--text-muted)' }}
                    >
                        {enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                </div>

                {enabled && (
                    <div
                        className="mt-3 p-3 text-xs rounded-lg border"
                        style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--accent)',
                            color: 'var(--accent)'
                        }}
                    >
                        <p>
                            {(t.settings.spaces?.info || 'You are currently in {mode} mode. Use the switcher in the header to toggle between spaces.')
                                .replace('{mode}', getSpace() === 'work' ? (t.header.work || 'Work') : (t.header.private || 'Private'))}
                        </p>
                    </div>
                )}
            </div>
        </SettingsSection>
    );
};
