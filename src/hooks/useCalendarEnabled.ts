import { useState, useEffect } from 'react';

// Storage Keys
const VIEW_STRATEGY_KEY = 'weekflux:view_strategy'; // 'priority' | 'calendar' | 'both'
const CALENDAR_ENABLED_KEY = 'weekflux:calendar_enabled'; // Legacy key, keeping for migration/fallback
const EVENT_KEY = 'weekflux:view_strategy_change';

export type ViewStrategy = 'priority' | 'calendar' | 'both';

export const useCalendarEnabled = () => {
    // Initialize State
    const [viewStrategy, setViewStrategy] = useState<ViewStrategy>(() => {
        try {
            // 1. Check new key first
            const stored = localStorage.getItem(VIEW_STRATEGY_KEY);
            if (stored === 'priority' || stored === 'calendar' || stored === 'both') {
                return stored;
            }

            // 2. Fallback to legacy key
            const legacyEnabled = localStorage.getItem(CALENDAR_ENABLED_KEY) === 'true';
            return legacyEnabled ? 'both' : 'priority'; // If enabled before, default to 'both' to keep access. If disabled, 'priority'.
        } catch {
            return 'priority'; // Default OFF
        }
    });

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === VIEW_STRATEGY_KEY && e.newValue) {
                setViewStrategy(e.newValue as ViewStrategy);
            }
        };

        const handleCustomEvent = () => {
            try {
                const stored = localStorage.getItem(VIEW_STRATEGY_KEY);
                if (stored) setViewStrategy(stored as ViewStrategy);
            } catch {
                // Ignore
            }
        }

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener(EVENT_KEY, handleCustomEvent);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener(EVENT_KEY, handleCustomEvent);
        };
    }, []);

    const updateViewStrategy = (strategy: ViewStrategy) => {
        try {
            localStorage.setItem(VIEW_STRATEGY_KEY, strategy);

            // Sync legacy key just in case (optional, but good for safety)
            if (strategy === 'priority') {
                localStorage.removeItem(CALENDAR_ENABLED_KEY);
            } else {
                localStorage.setItem(CALENDAR_ENABLED_KEY, 'true');
            }

            setViewStrategy(strategy);
            window.dispatchEvent(new Event(EVENT_KEY));
        } catch (e) {
            console.error('Failed to set view strategy', e);
        }
    };

    // Derived properties for easy consumption
    // isCalendarEnabled: true if we are in 'calendar' or 'both' mode (allows scheduling)
    const isCalendarEnabled = viewStrategy === 'calendar' || viewStrategy === 'both';

    // specifically for requiring Timeline view enforcement
    const isTimelineOnly = viewStrategy === 'calendar';
    const isPriorityOnly = viewStrategy === 'priority';

    return {
        viewStrategy,
        setViewStrategy: updateViewStrategy,
        isCalendarEnabled,
        isTimelineOnly,
        isPriorityOnly
    };
};
