import React from 'react';

interface MainLayoutProps {
    sidebar: React.ReactNode;
    header: React.ReactNode;
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ sidebar, header, children }) => {
    return (
        <div className="flex h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans overflow-hidden">
            {sidebar}
            <div className="flex-1 flex flex-col relative min-w-0 z-10">
                {header}
                <div className="flex-1 overflow-hidden relative pt-5">
                    {children}
                </div>
            </div>
        </div>
    );
};
