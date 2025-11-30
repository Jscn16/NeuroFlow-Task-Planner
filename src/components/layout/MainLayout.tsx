import React from 'react';

interface MainLayoutProps {
    sidebar: React.ReactNode;
    header: React.ReactNode;
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ sidebar, header, children }) => {
    return (
        <div 
            className="flex h-full w-full bg-transparent font-sans overflow-hidden overscroll-none"
            style={{ 
                color: 'var(--text-secondary)',
                // Selection color uses accent
            }}
        >
            <style>{`
                ::selection {
                    background-color: color-mix(in srgb, var(--accent) 30%, transparent);
                }
            `}</style>
            {sidebar}
            <div className="flex-1 flex flex-col relative min-w-0 z-10">
                {header}
                {/* Content area now owns scrolling to keep body locked */}
                <div className="flex-1 min-h-0 relative pt-5 overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
};
