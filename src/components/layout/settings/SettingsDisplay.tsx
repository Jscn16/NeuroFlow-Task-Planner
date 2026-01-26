import React from 'react';
import { Moon } from 'lucide-react';
import { SettingsSection } from './SettingsSection';

interface SettingsDisplayProps {
    dayBoundary: number;
    onDayBoundaryChange: (hour: number) => void;
}

export const SettingsDisplay: React.FC<SettingsDisplayProps> = ({
    dayBoundary,
    onDayBoundaryChange
}) => {
    return (
        <SettingsSection title="Night Owl Mode" icon={Moon}>
            <p className="text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>
                When does your day reset? Tasks before this time count as yesterday.
            </p>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Day ends at</span>
                <div className="flex items-center gap-1">
                    {[3, 4, 5, 6, 7].map((hour) => (
                        <button
                            key={hour}
                            onClick={() => onDayBoundaryChange(hour)}
                            className="w-9 h-8 rounded-lg text-xs font-bold transition-all"
                            style={{
                                backgroundColor: dayBoundary === hour ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                                color: dayBoundary === hour ? 'white' : 'var(--text-muted)'
                            }}
                        >
                            {hour}am
                        </button>
                    ))}
                </div>
            </div>
        </SettingsSection>
    );
};
