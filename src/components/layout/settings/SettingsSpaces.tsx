import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Briefcase, Lock } from 'lucide-react';
import { getSpacesEnabled, setSpacesEnabled } from '../../../state/features';
import { getSpace, setSpace } from '../../../state/space';
import { migrateDataToSpaces } from '../../../utils/migration';
import { StorageService } from '../../../services/StorageService';
import { SupabaseDataService } from '../../../services/supabaseDataService';
import { logger } from '../../../utils/logger';

import { SettingsSection } from './SettingsSection';

interface SettingsSpacesProps {
    supabaseEnabled: boolean;
}

export const SettingsSpaces: React.FC<SettingsSpacesProps> = ({ supabaseEnabled }) => {
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
            title="Work / Private Mode"
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
                            <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Enable Work Space</h4>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                Separates tasks and entries into Work and Private spaces.
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
                            backgroundColor: 'var(--accent-muted)',
                            borderColor: 'var(--accent-glow)',
                            color: 'var(--accent)'
                        }}
                    >
                        <p>
                            You are currently in <strong>{getSpace() === 'work' ? 'Work' : 'Private'}</strong> mode.
                            Use the switcher in the header to toggle between spaces.
                        </p>
                    </div>
                )}
            </div>
        </SettingsSection>
    );
};
