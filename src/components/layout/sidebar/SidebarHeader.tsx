import React from 'react';
import { Settings, PanelLeftClose, X, Clock, List } from 'lucide-react';
import { WeekFluxLogo } from '../../../brand/WeekFluxLogo';

interface SidebarHeaderProps {
    onOpenSettings: () => void;
    onToggle: () => void;
    onClose: () => void;
    isMobile: boolean;
    dayViewMode?: 'list' | 'timeline';
    onDayViewModeChange?: (mode: 'list' | 'timeline') => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
    onOpenSettings,
    onToggle,
    onClose,
    isMobile,
    dayViewMode,
    onDayViewModeChange
}) => {
    return (
        <div className="p-4 pb-3 flex items-center justify-between">
            <WeekFluxLogo size="lg" showIcon={true} />
            <div className="flex items-center gap-1">
                {isMobile ? (
                    <button
                        onClick={onClose}
                        className="btn-icon"
                        title="Close Sidebar"
                    >
                        <X size={18} />
                    </button>
                ) : (
                    <button
                        onClick={onToggle}
                        className="btn-icon"
                        title="Collapse Sidebar"
                    >
                        <PanelLeftClose size={18} />
                    </button>
                )}
                {onDayViewModeChange && (
                    <button
                        onClick={() => onDayViewModeChange(dayViewMode === 'list' ? 'timeline' : 'list')}
                        className="btn-icon"
                        title={dayViewMode === 'list' ? "Switch to Timeline View" : "Switch to List View"}
                    >
                        {dayViewMode === 'list' ? <Clock size={18} /> : <List size={18} />}
                    </button>
                )}
                <button
                    onClick={onOpenSettings}
                    className="btn-icon"
                >
                    <Settings size={18} />
                </button>
            </div>
        </div>
    );
};
