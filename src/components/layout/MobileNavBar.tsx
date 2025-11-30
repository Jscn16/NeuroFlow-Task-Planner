import React from 'react';
import { CalendarDays, Play, CheckSquare, BarChart3, Notebook } from 'lucide-react';

interface MobileNavBarProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'planner', label: 'Planner', icon: CalendarDays },
  { id: 'focus', label: 'Focus', icon: Play },
  { id: 'braindump', label: 'Brain', icon: Notebook },
  { id: 'habits', label: 'Habits', icon: CheckSquare },
  { id: 'analytics', label: 'Stats', icon: BarChart3 },
] as const;

export const MobileNavBar: React.FC<MobileNavBarProps> = ({ activeTab, onChange }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 z-50 bg-zinc-950/90 backdrop-blur-lg border-t border-white/5">
      <div className="h-full flex items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex flex-col items-center gap-1 text-xs font-semibold"
              style={{ color: isActive ? '#22c55e' : '#a1a1aa' }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={isActive ? 'text-white' : 'text-zinc-500'}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
