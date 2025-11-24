import React from 'react';

interface MainLayoutProps {
    sidebar: React.ReactNode;
    header: React.ReactNode;
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ sidebar, header, children }) => {
    return (
        <div className="flex h-screen w-full bg-[#161b2e] text-slate-200 selection:bg-cyan-500/30 font-sans overflow-hidden">
            {sidebar}
            <div className="flex-1 flex flex-col relative min-w-0 z-10">
                {header}
                {/* Reduced Top Padding to 14 (3.5rem) to match header height */}
                <div className="flex-1 overflow-hidden relative pt-14">
                    {children}
                </div>
            </div>
        </div>
    );
};
