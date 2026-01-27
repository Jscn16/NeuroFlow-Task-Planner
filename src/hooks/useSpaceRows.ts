import { useState, useEffect } from 'react';
import { ROW_CONFIG, ROW_LABELS } from '../constants';
import { getSpace } from '../state/space';
import { Repeat } from 'lucide-react';

export const useSpaceRows = () => {
    const [rows, setRows] = useState(ROW_LABELS);
    const [rowConfig, setRowConfig] = useState(ROW_CONFIG);

    useEffect(() => {
        const updateRows = () => {
            const currentSpace = getSpace();

            if (currentSpace === 'work') {
                // Work Mode:
                // 1. Keep all rows (including LEISURE)
                // 2. Rename LEISURE -> MAINTENANCE, Sub -> Recurring, Icon -> Repeat

                const newConfig = { ...ROW_CONFIG };
                newConfig['LEISURE'] = {
                    ...newConfig['LEISURE'],
                    label: 'REQUESTS',
                    sub: 'Tickets',
                    icon: Repeat,
                    description: 'Incoming requests and tickets.'
                };

                setRows(ROW_LABELS);
                setRowConfig(newConfig);
            } else {
                // Private Mode: Default
                setRows(ROW_LABELS);
                setRowConfig(ROW_CONFIG);
            }
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
    }, []);

    return { rows, rowConfig };
};
