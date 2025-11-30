import { useMemo } from 'react';
import { Task } from '../types';
import { formatDate, getAdjustedDate } from '../constants';

type DoomState = 'safe' | 'risk' | 'critical';

interface DoomStats {
  remainingWorkMinutes: number;
  minutesUntilBedtime: number;
  overdueCount: number;
  state: DoomState;
}

export function useDoomLoopDetector(tasks: Task[], bedtimeHour = 23): DoomStats {
  return useMemo(() => {
    const now = getAdjustedDate();
    const todayStr = formatDate(now);
    const bedtime = new Date(now);
    bedtime.setHours(bedtimeHour, 0, 0, 0);
    const minutesUntilBedtime = Math.max(0, Math.round((bedtime.getTime() - now.getTime()) / 60000));

    const remainingTasks = (tasks || []).filter(
      (t) => t && t.dueDate === todayStr && t.status !== 'completed'
    );
    const remainingWorkMinutes = remainingTasks.reduce((acc, t) => acc + (t.duration || 0), 0);

    const overdueCount = (tasks || []).filter(
      (t) => t && t.dueDate && t.dueDate < todayStr && t.status !== 'completed'
    ).length;

    let state: DoomState = 'safe';
    if (remainingWorkMinutes > minutesUntilBedtime + 120 || overdueCount > 5) {
      state = 'critical';
    } else if (remainingWorkMinutes > minutesUntilBedtime || overdueCount > 3) {
      state = 'risk';
    }

    return {
      remainingWorkMinutes,
      minutesUntilBedtime,
      overdueCount,
      state
    };
  }, [tasks, bedtimeHour]);
}
