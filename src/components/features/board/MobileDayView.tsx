import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { CheckCircle2, Clock, GripVertical } from 'lucide-react';
import { Task, GridRow } from '../../../types';
import { formatDate, ROW_CONFIG } from '../../../constants';
import { MobileActionSheet, ActionSheetAction } from './MobileActionSheet';
import { useCompletionSound } from '../../../hooks/useCompletionSound';

// ============================================================================
// Types
// ============================================================================

interface MobileDayViewProps {
  /** Tasks filtered for the selected day */
  tasks: Task[];
  /** Currently selected date */
  selectedDate: Date;
  /** Today's date string */
  todayStr: string;
  /** Direction for animation (1 = right/future, -1 = left/past) */
  direction: number;
  /** View mode for completed tasks */
  viewMode: 'show' | 'fade' | 'hide';
  /** Callback to navigate to next day */
  onNextDay: () => void;
  /** Callback to navigate to previous day */
  onPrevDay: () => void;
  /** Callback to toggle task completion */
  onToggleComplete: (taskId: string) => void;
  /** Callback to update task */
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  /** Callback to delete task */
  onDeleteTask: (taskId: string) => void;
}

interface MobileTaskCardProps {
  task: Task;
  isPastDay: boolean;
  viewMode: 'show' | 'fade' | 'hide';
  onToggleComplete: (taskId: string) => void;
  onLongPress: (task: Task) => void;
}

// ============================================================================
// Animation Variants
// ============================================================================

const listVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 }
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 }
    }
  })
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3
    }
  }),
  exit: { opacity: 0, y: -10 }
};

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * MobileTaskCard - Individual task card with long-press support
 */
const MobileTaskCard: React.FC<MobileTaskCardProps> = React.memo(({
  task,
  isPastDay,
  viewMode,
  onToggleComplete,
  onLongPress
}) => {
  const longPressTimer = useRef<number | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [flash, setFlash] = useState(false);
  const { play } = useCompletionSound();

  const isCompleted = task.status === 'completed';
  const isFaded = isCompleted && (viewMode === 'fade' || isPastDay);

  // Get row config for icon/color
  const rowConfig = task.assignedRow ? ROW_CONFIG[task.assignedRow] : null;

  // Type color for left border
  const getTypeColor = () => {
    const colorMap: Record<string, string> = {
      high: '#f43f5e',
      medium: '#f97316',
      low: '#facc15',
      leisure: '#22d3ee',
      chores: '#a1a1aa',
      backlog: '#6b7280'
    };
    return colorMap[task.type] || colorMap.backlog;
  };

  // Long press handlers
  const handleTouchStart = useCallback(() => {
    setIsPressed(true);
    longPressTimer.current = window.setTimeout(() => {
      onLongPress(task);
      setIsPressed(false);
    }, 500); // 500ms long press threshold
  }, [task, onLongPress]);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    // Cancel long press if user moves finger
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsPressed(false);
  }, []);

  return (
    <motion.div
      className={`
        relative rounded-xl overflow-hidden
        transition-all duration-200
        ${isPressed ? 'scale-[0.98]' : ''}
      `}
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        opacity: isFaded ? 0.5 : 1,
        borderLeft: `3px solid ${getTypeColor()}`,
        minHeight: '50px'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center p-3 md:p-4 gap-2.5 relative">
        {/* Completion Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (task.status !== 'completed') {
              play();
            }
            onToggleComplete(task.id);
            setFlash(true);
            window.setTimeout(() => setFlash(false), 300);
          }}
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center
            transition-all duration-200 shrink-0
          `}
          style={{
            borderColor: isCompleted ? 'var(--success)' : 'rgba(255,255,255,0.2)',
            backgroundColor: isCompleted ? 'var(--success)' : 'transparent'
          }}
        >
          {isCompleted && (
            <CheckCircle2 size={14} className="text-white" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h4
            className={`
              font-semibold text-sm leading-tight
              ${isCompleted ? 'line-through' : ''}
            `}
            style={{ 
              color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)' 
            }}
          >
            {task.title}
          </h4>
          
          <div className="flex items-center gap-2 mt-1">
            {/* Duration */}
            <div 
              className="flex items-center gap-1 text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              <Clock size={12} />
              <span>{task.duration}m</span>
            </div>

            {/* Row/Category badge */}
            {rowConfig && (
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: rowConfig.color.replace('text-', '#').includes('#') 
                    ? rowConfig.color 
                    : 'var(--text-muted)'
                }}
              >
                {task.assignedRow}
              </span>
            )}
          </div>
        </div>

        {/* Drag handle hint (visual only on mobile) */}
        <div 
          className="opacity-30"
          style={{ color: 'var(--text-muted)' }}
        >
          <GripVertical size={18} />
        </div>
        <AnimatePresence>
          {flash && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-emerald-500/20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

MobileTaskCard.displayName = 'MobileTaskCard';

// ============================================================================
// Row Section Component
// ============================================================================

interface RowSectionProps {
  row: GridRow;
  tasks: Task[];
  isPastDay: boolean;
  viewMode: 'show' | 'fade' | 'hide';
  onToggleComplete: (taskId: string) => void;
  onLongPress: (task: Task) => void;
}

const RowSection: React.FC<RowSectionProps> = React.memo(({
  row,
  tasks,
  isPastDay,
  viewMode,
  onToggleComplete,
  onLongPress
}) => {
  const config = ROW_CONFIG[row];
  const Icon = config.icon;

  if (tasks.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Row Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <Icon size={16} className={config.color} />
        <span 
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          {config.label}
        </span>
        <span 
          className="text-xs"
          style={{ color: 'var(--text-muted)', opacity: 0.5 }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Task Cards */}
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={index}
          >
            <MobileTaskCard
              task={task}
              isPastDay={isPastDay}
              viewMode={viewMode}
              onToggleComplete={onToggleComplete}
              onLongPress={onLongPress}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
});

RowSection.displayName = 'RowSection';

// ============================================================================
// Main Component
// ============================================================================

/**
 * MobileDayView - Swipeable day task list
 * 
 * Displays tasks grouped by row (GOAL, FOCUS, WORK, etc.)
 * Supports swipe gestures to navigate between days.
 * Long-press on cards triggers action sheet.
 */
export const MobileDayView: React.FC<MobileDayViewProps> = ({
  tasks,
  selectedDate,
  todayStr,
  direction,
  viewMode,
  onNextDay,
  onPrevDay,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask
}) => {
  const [actionSheetTask, setActionSheetTask] = useState<Task | null>(null);

  const selectedDateStr = formatDate(selectedDate);
  const isPastDay = selectedDateStr < todayStr;

  // Filter tasks for this day
  const dayTasks = (tasks || []).filter(t => {
    if (!t || !t.id) return false;
    // Skip any placeholder/ghost items that might leak from desktop logic
    if ((t as any).isPlaceholder || (t as any).isGhost) return false;
    if (t.isFrozen) return false;
    if (t.dueDate !== selectedDateStr) return false;
    if (t.status === 'unscheduled') return false;
    if (t.status === 'completed' && viewMode === 'hide') return false;
    return true;
  });

  // Group tasks by row
  const rows: GridRow[] = ['GOAL', 'FOCUS', 'WORK', 'LEISURE', 'CHORES'];
  const tasksByRow = rows.reduce((acc, row) => {
    acc[row] = dayTasks.filter(t => t.assignedRow === row);
    return acc;
  }, {} as Record<GridRow, Task[]>);

  // Swipe gesture handler
  const handleDragEnd = useCallback((
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 50;
    const velocity = 500;

    if (info.offset.x < -threshold || info.velocity.x < -velocity) {
      // Swiped left -> next day
      onNextDay();
    } else if (info.offset.x > threshold || info.velocity.x > velocity) {
      // Swiped right -> previous day
      onPrevDay();
    }
  }, [onNextDay, onPrevDay]);

  // Long press handler
  const handleLongPress = useCallback((task: Task) => {
    // Haptic feedback (if available)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setActionSheetTask(task);
  }, []);

  // Action sheet handler
  const handleAction = useCallback((action: ActionSheetAction, task: Task) => {
    switch (action) {
      case 'complete':
        onToggleComplete(task.id);
        break;
      case 'move-tomorrow': {
        const tomorrow = new Date(selectedDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        onUpdateTask(task.id, { dueDate: formatDate(tomorrow) });
        break;
      }
      case 'move-yesterday': {
        const yesterday = new Date(selectedDate);
        yesterday.setDate(yesterday.getDate() - 1);
        onUpdateTask(task.id, { dueDate: formatDate(yesterday) });
        break;
      }
      case 'delete':
        onDeleteTask(task.id);
        break;
      case 'reschedule':
        // TODO: Open date picker
        console.log('Reschedule not yet implemented');
        break;
      case 'edit':
        // TODO: Open edit modal
        console.log('Edit not yet implemented');
        break;
    }
    setActionSheetTask(null);
  }, [selectedDate, onToggleComplete, onUpdateTask, onDeleteTask]);

  // Check if there are any tasks
  const hasTasks = dayTasks.length > 0;

  return (
    <>
      {/* Swipeable Container */}
      <motion.div
        className="w-full"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={selectedDateStr}
            custom={direction}
            variants={listVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
            style={{ overscrollBehaviorY: 'contain' }}
          >
            {hasTasks ? (
              // Grouped task list
              <>
                {rows.map(row => (
                  <RowSection
                    key={row}
                    row={row}
                    tasks={tasksByRow[row]}
                    isPastDay={isPastDay}
                    viewMode={viewMode}
                    onToggleComplete={onToggleComplete}
                    onLongPress={handleLongPress}
                  />
                ))}
              </>
            ) : (
              // Empty state
              <div className="h-full flex flex-col items-center justify-center text-center px-8">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                  <CheckCircle2 size={32} style={{ color: 'var(--text-muted)' }} />
                </div>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {isPastDay ? 'No tasks recorded' : 'No tasks scheduled'}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {isPastDay 
                    ? 'This day has passed' 
                    : 'Drag tasks from the sidebar to plan your day'
                  }
                </p>
              </div>
            )}

            {/* Bottom padding for scroll */}
            <div className="h-20" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Action Sheet */}
      <MobileActionSheet
        task={actionSheetTask}
        onAction={handleAction}
        onClose={() => setActionSheetTask(null)}
      />
    </>
  );
};

MobileDayView.displayName = 'MobileDayView';
