import React, { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Task } from '../../../types';
import { formatDate, DAYS } from '../../../constants';
import { DailyStats } from '../../../hooks/usePlannerController';

// ============================================================================
// Types
// ============================================================================

interface MobileWeekStripProps {
  /** Array of 7 Date objects for current week */
  currentWeekDays: Date[];
  /** Currently selected date */
  selectedDate: Date;
  /** Callback when user taps a day */
  onSelectDate: (date: Date) => void;
  /** Today's date string (YYYY-MM-DD) */
  todayStr: string;
  /** Pre-computed stats for each day */
  dailyStats: DailyStats[];
  /** All tasks (for capacity dots) */
  tasks: Task[];
}

// ============================================================================
// Sub-Components
// ============================================================================

interface DayPillProps {
  day: Date;
  dayIndex: number;
  isSelected: boolean;
  isToday: boolean;
  taskCount: number;
  completedCount: number;
  onSelect: () => void;
}

/**
 * DayPill - Individual day button in the week strip
 */
const DayPill: React.FC<DayPillProps> = React.memo(({
  day,
  dayIndex,
  isSelected,
  isToday,
  taskCount,
  completedCount,
  onSelect
}) => {
  // Generate capacity dots (max 5 dots shown)
  const maxDots = 5;
  const dotsToShow = Math.min(taskCount, maxDots);
  
  return (
    <motion.button
      onClick={onSelect}
      className={`
        flex flex-col items-center justify-center
        min-w-[52px] py-3 px-2 rounded-2xl
        transition-colors duration-200
        ${isSelected ? 'scale-105' : ''}
      `}
      style={{
        backgroundColor: isSelected 
          ? 'var(--accent)' 
          : isToday 
            ? 'rgba(255,255,255,0.08)' 
            : 'transparent',
        border: isToday && !isSelected 
          ? '1px solid rgba(255,255,255,0.1)' 
          : '1px solid transparent'
      }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      {/* Day Name (Mon, Tue, etc.) */}
      <span
        className="text-[10px] font-bold uppercase tracking-wider mb-1"
        style={{
          color: isSelected 
            ? 'white' 
            : isToday 
              ? 'var(--accent)' 
              : 'var(--text-muted)'
        }}
      >
        {DAYS[dayIndex].slice(0, 3)}
      </span>

      {/* Date Number */}
      <span
        className="text-xl font-display font-black leading-none"
        style={{
          color: isSelected 
            ? 'white' 
            : isToday 
              ? 'var(--text-primary)' 
              : 'var(--text-secondary)'
        }}
      >
        {day.getDate()}
      </span>

      {/* Capacity Dots */}
      <div className="flex gap-0.5 mt-2 h-2">
        {dotsToShow > 0 ? (
          Array.from({ length: dotsToShow }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{
                backgroundColor: i < completedCount
                  ? isSelected 
                    ? 'rgba(255,255,255,0.9)' 
                    : 'var(--success)'
                  : isSelected
                    ? 'rgba(255,255,255,0.4)'
                    : 'rgba(255,255,255,0.2)'
              }}
            />
          ))
        ) : (
          <div className="w-1.5 h-1.5" /> // Placeholder for consistent height
        )}
      </div>
    </motion.button>
  );
});

DayPill.displayName = 'DayPill';

// ============================================================================
// Main Component
// ============================================================================

/**
 * MobileWeekStrip - Horizontal scrollable week navigation
 * 
 * Shows 7 day pills in a horizontally scrollable strip.
 * Auto-scrolls to center the selected date on mount.
 * Tapping a pill selects that day.
 */
export const MobileWeekStrip: React.FC<MobileWeekStripProps> = React.memo(({
  currentWeekDays,
  selectedDate,
  onSelectDate,
  todayStr,
  dailyStats,
  tasks
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedDateStr = formatDate(selectedDate);

  // Compute task counts per day
  const dayTaskCounts = useMemo(() => {
    return currentWeekDays.map(day => {
      const dateStr = formatDate(day);
      const dayTasks = tasks.filter(
        t => t.dueDate === dateStr && t.status !== 'unscheduled'
      );
      const completedTasks = dayTasks.filter(t => t.status === 'completed');
      return {
        total: dayTasks.length,
        completed: completedTasks.length
      };
    });
  }, [currentWeekDays, tasks]);

  // Auto-scroll: only adjust if selected pill is outside the viewport
  useEffect(() => {
    if (!scrollRef.current) return;

    const selectedIndex = currentWeekDays.findIndex(
      day => formatDate(day) === selectedDateStr
    );
    
    if (selectedIndex === -1) return;

    const container = scrollRef.current;
    const pills = Array.from(container.children) as HTMLElement[];
    const target = pills[selectedIndex];
    if (!target) return;

    const { offsetLeft, offsetWidth } = target;
    const viewStart = container.scrollLeft;
    const viewEnd = viewStart + container.clientWidth;
    const targetStart = offsetLeft;
    const targetEnd = offsetLeft + offsetWidth;

    // Only scroll if the target pill is out of view
    if (targetStart < viewStart || targetEnd > viewEnd) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedDateStr, currentWeekDays]);

  return (
    <div 
      className="w-full border-b"
      style={{ borderColor: 'var(--border-light)' }}
    >
      {/* Scrollable Strip */}
      <div
        ref={scrollRef}
        className="flex gap-1 px-4 py-3 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
        style={{
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {currentWeekDays.map((day, i) => {
          const dateStr = formatDate(day);
          const isSelected = dateStr === selectedDateStr;
          const isToday = dateStr === todayStr;
          const counts = dayTaskCounts[i];

          return (
            <div 
              key={dateStr}
              className="snap-center"
            >
              <DayPill
                day={day}
                dayIndex={i}
                isSelected={isSelected}
                isToday={isToday}
                taskCount={counts.total}
                completedCount={counts.completed}
                onSelect={() => onSelectDate(day)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

MobileWeekStrip.displayName = 'MobileWeekStrip';
