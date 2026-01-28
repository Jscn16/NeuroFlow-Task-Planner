import { useState, useEffect } from 'react';
import { ROW_CONFIG, ROW_LABELS } from '../constants';
import { getSpace } from '../state/space';
import { Repeat } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const useSpaceRows = () => {
    const { t } = useLanguage();
    const [rows, setRows] = useState(ROW_LABELS);
    const [rowConfig, setRowConfig] = useState(ROW_CONFIG);

    useEffect(() => {
        const updateRows = () => {
            const currentSpace = getSpace();

            const newConfig = { ...ROW_CONFIG };

            // Apply translations based on the language
            newConfig['GOAL'] = { ...newConfig['GOAL'], label: t.rows.goal.label, sub: t.rows.goal.sub };
            newConfig['FOCUS'] = { ...newConfig['FOCUS'], label: t.rows.focus.label, sub: t.rows.focus.sub };
            newConfig['WORK'] = { ...newConfig['WORK'], label: t.rows.work.label, sub: t.rows.work.sub };
            newConfig['LEISURE'] = { ...newConfig['LEISURE'], label: t.rows.leisure.label, sub: t.rows.leisure.sub };
            newConfig['CHORES'] = { ...newConfig['CHORES'], label: t.rows.chores.label, sub: t.rows.chores.sub };

            if (currentSpace === 'work') {
                newConfig['LEISURE'] = {
                    ...newConfig['LEISURE'],
                    label: t.header.work === 'Arbeit' ? 'ANFRAGEN' : 'REQUESTS',
                    sub: t.header.work === 'Arbeit' ? 'Tickets' : 'Tickets',
                    icon: Repeat,
                    description: t.header.work === 'Arbeit' ? 'Eingehende Anfragen und Tickets.' : 'Incoming requests and tickets.'
                };
            }

            setRows(ROW_LABELS);
            setRowConfig(newConfig);
        };

        // Initial load
        updateRows();

        // Listen for space changes
        window.addEventListener('weekflux-space-changed', updateRows);
        window.addEventListener('storage', updateRows);

        return () => {
            window.removeEventListener('weekflux-space-changed', updateRows);
            window.removeEventListener('storage', updateRows);
        };
    }, [t]);

    return { rows, rowConfig };
};
