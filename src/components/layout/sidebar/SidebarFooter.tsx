import React from 'react';

export const SidebarFooter: React.FC = () => {
    return (
        <div
            className="p-3 border-t flex items-center justify-between"
            style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}
        >
            <div className="flex items-center gap-2">
                <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>v1.2</div>
            </div>
            <div
                className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                style={{
                    backgroundColor: 'rgba(251, 191, 36, 0.15)',
                    color: 'rgba(251, 191, 36, 0.7)',
                    border: '1px solid rgba(251, 191, 36, 0.2)'
                }}
            >
                DEV
            </div>
        </div>
    );
};
