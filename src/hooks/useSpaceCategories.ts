import { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants'; // Assumes CATEGORIES is exported from constants
import { getSpace, Space } from '../state/space';

export const useSpaceCategories = () => {
    const [categories, setCategories] = useState(CATEGORIES);

    useEffect(() => {
        const updateCategories = () => {
            const currentSpace = getSpace();

            if (currentSpace === 'work') {
                // Work Mode: Rename Leisure -> Maintenance
                const workCats = CATEGORIES.map(c => {
                    if (c.id === 'leisure') {
                        return { ...c, label: 'Requests', emoji: '📥' };
                    }
                    return c;
                });
                setCategories(workCats);
            } else {
                // Private Mode: Default
                setCategories(CATEGORIES);
            }
        };

        // Initial load
        updateCategories();

        // Listen for space changes
        window.addEventListener('weekflux-space-changed', updateCategories);
        window.addEventListener('storage', updateCategories); // Fallback for cross-tab

        return () => {
            window.removeEventListener('weekflux-space-changed', updateCategories);
            window.removeEventListener('storage', updateCategories);
        };
    }, []);

    return categories;
};
