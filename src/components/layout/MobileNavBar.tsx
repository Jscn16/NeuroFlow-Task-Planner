import React from 'react';
import { motion } from 'framer-motion';
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
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.85))',
        backdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <div
        className="h-16 flex items-center justify-around px-1"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex flex-col items-center justify-center gap-0.5 relative touch-manipulation"
              style={{
                minWidth: '56px',
                minHeight: '48px', // Minimum 48px touch target
                color: isActive ? 'var(--accent)' : 'var(--text-muted)'
              }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full"
                  style={{ backgroundColor: 'var(--accent)' }}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className="text-[10px] font-semibold"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  opacity: isActive ? 1 : 0.7
                }}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
