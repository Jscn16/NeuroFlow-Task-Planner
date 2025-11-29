import { TaskType, GridRow } from './types';
import React from 'react';
import { Target, Flame, Briefcase, Gamepad2, Brush } from 'lucide-react';

// Muted, professional color palette
export const TYPE_COLORS: Record<TaskType, string> = {
  backlog: 'text-gray-500', // Grey
  high: 'text-red-600 dark:text-red-500', // High priority (Red)
  medium: 'text-orange-600 dark:text-orange-500', // Medium priority (Orange)
  low: 'text-amber-600 dark:text-amber-500', // Low priority (Amber)
  leisure: 'text-blue-600 dark:text-blue-500', // Leisure (Blue)
  chores: 'text-gray-600 dark:text-gray-400', // Chores (Gray)
};

// Solid colors for the vertical indicators - muted
export const TYPE_INDICATOR_COLORS: Record<TaskType, string> = {
  backlog: 'bg-gray-500',
  high: 'bg-red-500',
  medium: 'bg-orange-500',
  low: 'bg-amber-500',
  leisure: 'bg-blue-500',
  chores: 'bg-gray-400',
};

// Colors for the left border of board task cards - subtle
export const TASK_CARD_BORDER_COLORS: Record<TaskType, string> = {
  backlog: 'border-l-gray-500',
  high: 'border-l-red-500',
  medium: 'border-l-orange-500',
  low: 'border-l-amber-500',
  leisure: 'border-l-blue-500',
  chores: 'border-l-gray-400',
};

export const getWeekDays = (startDate: Date = new Date()) => {
  const startOfWeek = new Date(startDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  startOfWeek.setDate(diff);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push(d);
  }
  return days;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Circadian Logic: Day ends at 5 AM
export const getAdjustedDate = (): Date => {
  const now = new Date();
  const hour = now.getHours();
  // If it's before 5 AM, subtract 1 day to stay on "Yesterday"
  if (hour < 5) {
    now.setDate(now.getDate() - 1);
  }
  return now;
};

export const isLateNight = (): boolean => {
  const hour = new Date().getHours();
  return hour < 5;
};

export const TARGET_HOURS_PER_DAY = 6; // User-defined target for daily capacity

// --- Sound Utility ---
export const playSuccessSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Create a satisfying "pop" sound with a pleasant chime
    // Two-tone: a quick pop followed by a gentle chime
    const popFreq = 800; // Quick pop
    const chimeFreq = 1200; // Pleasant chime

    // Quick pop sound
    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.value = popFreq;
    popOsc.connect(popGain);
    popGain.connect(ctx.destination);

    // Fast attack and quick decay for pop
    popGain.gain.setValueAtTime(0, now);
    popGain.gain.linearRampToValueAtTime(0.15, now + 0.01);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    popOsc.start(now);
    popOsc.stop(now + 0.08);

    // Gentle chime that follows
    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chimeOsc.type = 'sine';
    chimeOsc.frequency.value = chimeFreq;
    chimeOsc.connect(chimeGain);
    chimeGain.connect(ctx.destination);

    // Smooth chime with slight delay
    chimeGain.gain.setValueAtTime(0, now + 0.05);
    chimeGain.gain.linearRampToValueAtTime(0.08, now + 0.08);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    chimeOsc.start(now + 0.05);
    chimeOsc.stop(now + 0.25);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

// Enhanced Row Configuration with Icons and Subtitles - Using Flex weights for dynamic scaling
// Reduced min-heights to fit more on screen
export const ROW_CONFIG: Record<GridRow, {
  label: string,
  sub: string,
  icon: React.ElementType,
  color: string,
  barColor: string,
  flexClass: string,
  description: string
}> = {
  'GOAL': { label: 'GOAL', sub: 'High impact', icon: Target, color: 'text-red-600 dark:text-red-500', barColor: 'bg-red-500', flexClass: 'flex-[1] min-h-[70px]', description: 'One major objective that moves the needle.' },
  'FOCUS': { label: 'FOCUS', sub: 'Deep work', icon: Flame, color: 'text-orange-600 dark:text-orange-500', barColor: 'bg-orange-500', flexClass: 'flex-[3] min-h-[100px]', description: ' uninterrupted blocks for complex tasks.' },
  'WORK': { label: 'WORK', sub: 'Business', icon: Briefcase, color: 'text-amber-600 dark:text-amber-500', barColor: 'bg-amber-500', flexClass: 'flex-[3] min-h-[100px]', description: 'Standard operational tasks and meetings.' },
  'LEISURE': { label: 'LEISURE', sub: 'Recharge', icon: Gamepad2, color: 'text-blue-600 dark:text-blue-500', barColor: 'bg-blue-500', flexClass: 'flex-[3] min-h-[100px]', description: 'Time to rest, play, and recover.' },
  'CHORES': { label: 'CHORES', sub: 'Life admin', icon: Brush, color: 'text-gray-600 dark:text-gray-400', barColor: 'bg-gray-500', flexClass: 'flex-[3] min-h-[100px]', description: 'Maintenance, errands, and cleaning.' },
};

export const ROW_LABELS: GridRow[] = ['GOAL', 'FOCUS', 'WORK', 'LEISURE', 'CHORES'];
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];