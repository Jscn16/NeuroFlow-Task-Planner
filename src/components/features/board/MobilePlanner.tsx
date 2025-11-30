import React, { useState, useCallback, useMemo } from 'react';
import { Menu } from 'lucide-react';
import { usePlannerController } from '../../../hooks/usePlannerController';
import { MobileWeekStrip } from './MobileWeekStrip';
import { MobileDayView } from './MobileDayView';
import { formatDate } from '../../../constants';

// ============================================================================
// Types
// ============================================================================

interface MobilePlannerProps {
  /** Current week's anchor date (for week navigation) */
  currentDate: Date;
  /** How to handle completed tasks */
  viewMode: 'show' | 'fade' | 'hide';
  /** Callback when week changes (optional, for sync with desktop) */
  onWeekChange?: (direction: 'prev' | 'next') => void;
  /** Opens the global sidebar (drawer on mobile) */
  onOpenSidebar?: () => void;
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * MobilePlanner - Mobile-optimized planner view
 * 
 * Combines:
 * - MobileWeekStrip: Horizontal day selector at top
 * - MobileDayView: Swipeable task list below
 * 
 * Uses usePlannerController hook for all data/actions,
 * proving the hook's portability for different view implementations.
 */
export const MobilePlanner: React.FC<MobilePlannerProps> = ({
  currentDate,
  viewMode,
  onWeekChange,
  onOpenSidebar
}) => {
  // Get data and actions from the controller hook
  const {
    tasks,
    currentWeekDays,
    todayStr,
    dailyStats,
    actions
  } = usePlannerController({ currentDate });

  // Mobile-specific state: selected day within the week
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    // Default to today if it's in the current week, otherwise first day
    const today = new Date(todayStr);
    const weekStart = currentWeekDays[0];
    const weekEnd = currentWeekDays[6];
    
    if (today >= weekStart && today <= weekEnd) {
      return today;
    }
    return weekStart;
  });

  // Track direction for animations (1 = forward, -1 = backward)
  const [direction, setDirection] = useState(0);

  // Navigate to specific date
  const handleSelectDate = useCallback((date: Date) => {
    const currentStr = formatDate(selectedDate);
    const newStr = formatDate(date);
    
    setDirection(newStr > currentStr ? 1 : -1);
    setSelectedDate(date);
  }, [selectedDate]);

  // Navigate to next day
  const handleNextDay = useCallback(() => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);
    const weekEnd = currentWeekDays[6];
    const isBeyondWeek = formatDate(nextDate) > formatDate(weekEnd);

    setDirection(1);
    setSelectedDate(nextDate);

    if (isBeyondWeek && onWeekChange) {
      onWeekChange('next');
    }
  }, [currentWeekDays, selectedDate, onWeekChange]);

  // Navigate to previous day
  const handlePrevDay = useCallback(() => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(selectedDate.getDate() - 1);
    const weekStart = currentWeekDays[0];
    const isBeforeWeek = formatDate(prevDate) < formatDate(weekStart);

    setDirection(-1);
    setSelectedDate(prevDate);

    if (isBeforeWeek && onWeekChange) {
      onWeekChange('prev');
    }
  }, [currentWeekDays, selectedDate, onWeekChange]);

  // Reset selected date when week changes
  React.useEffect(() => {
    const selectedStr = formatDate(selectedDate);
    const weekStart = formatDate(currentWeekDays[0]);
    const weekEnd = formatDate(currentWeekDays[6]);

    // If selected date is outside current week, reset to today or first day
    if (selectedStr < weekStart || selectedStr > weekEnd) {
      const today = new Date(todayStr);
      const todayInWeek = formatDate(today) >= weekStart && formatDate(today) <= weekEnd;
      
      if (todayInWeek) {
        setSelectedDate(today);
      } else if (selectedStr < weekStart) {
        // Coming from future week, select last day
        setSelectedDate(currentWeekDays[6]);
      } else {
        // Coming from past week, select first day
        setSelectedDate(currentWeekDays[0]);
      }
    }
  }, [currentWeekDays, todayStr]);

  // Format selected date for display
  const formattedDate = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    };
    return selectedDate.toLocaleDateString('en-US', options);
  }, [selectedDate]);

  return (
    <div 
      className="flex flex-col h-[100dvh] w-full overflow-hidden fixed inset-0"
    >
      {/* Sticky Header + Week Strip */}
      <div className="flex-none z-20 backdrop-blur-md border-b border-white/5">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenSidebar?.()}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-md"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 
                className="text-xl font-display font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {formattedDate}
              </h2>
              {formatDate(selectedDate) === todayStr && (
                <span 
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--accent)' }}
                >
                  Today
                </span>
              )}
            </div>
          </div>
        </div>

        <MobileWeekStrip
          currentWeekDays={currentWeekDays}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          todayStr={todayStr}
          dailyStats={dailyStats}
          tasks={tasks}
        />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-y-contain relative z-0 no-scrollbar">
        <div className="pb-32 px-4 pt-4">
          <MobileDayView
            tasks={tasks}
            selectedDate={selectedDate}
            todayStr={todayStr}
            direction={direction}
            viewMode={viewMode}
            onNextDay={handleNextDay}
            onPrevDay={handlePrevDay}
            onToggleComplete={actions.onToggleTaskComplete}
            onUpdateTask={actions.onUpdateTask}
            onDeleteTask={actions.onDeleteTask}
          />
        </div>
      </div>
    </div>
  );
};

MobilePlanner.displayName = 'MobilePlanner';
