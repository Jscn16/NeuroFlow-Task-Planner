import { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants';
import { getSpace, Space } from '../state/space';
import { useLanguage } from '../context/LanguageContext';

export const useSpaceCategories = () => {
    const { t } = useLanguage();
    const [categories, setCategories] = useState(CATEGORIES);

    useEffect(() => {
        const updateCategories = () => {
            const currentSpace = getSpace();

            const translatedCats = CATEGORIES.map(c => {
                let label = c.label;
                switch (c.id) {
                    case 'high': label = t.sidebar.high; break;
                    case 'medium': label = t.sidebar.medium; break;
                    case 'low': label = t.sidebar.low; break;
                    case 'leisure': label = t.sidebar.leisure; break;
                    case 'chores': label = t.sidebar.chores; break;
                    case 'backlog': label = t.sidebar.backlog; break;
                }

                if (currentSpace === 'work' && c.id === 'leisure') {
                    label = t.header.work === 'Arbeit' ? 'Anfragen' : 'Requests';
                }
                return { ...c, label };
            });

            setCategories(translatedCats);
        };

        // Initial load
        updateCategories();

        // Listen for space changes
        window.addEventListener('weekflux-space-changed', updateCategories);
        window.addEventListener('storage', updateCategories);

        return () => {
            window.removeEventListener('weekflux-space-changed', updateCategories);
            window.removeEventListener('storage', updateCategories);
        };
    }, [t]);

    return categories;
};
