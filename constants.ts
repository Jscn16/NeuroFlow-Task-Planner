import { TaskType } from './types';

// Updated to match specific request: Red, Orange, Yellow, Cyan, Grey, White
export const TYPE_COLORS: Record<TaskType, string> = {
  backlog: 'text-zinc-400 border-white/20', // Grey/Transparent
  high: 'text-red-200 border-white/20', // ASAP (Red)
  medium: 'text-orange-200 border-white/20', // SOON (Orange)
  low: 'text-yellow-200 border-white/20', // LATER (Yellow)
  leisure: 'text-cyan-200 border-white/20', // LEISURE (Cyan)
  chores: 'text-zinc-100 border-white/20', // BASICS (White)
};

// Solid colors for the vertical indicators
export const TYPE_INDICATOR_COLORS: Record<TaskType, string> = {
  backlog: 'bg-zinc-600', 
  high: 'bg-red-500', 
  medium: 'bg-orange-500', 
  low: 'bg-yellow-400', 
  leisure: 'bg-cyan-400', 
  chores: 'bg-white', 
};

// Colors for the left border of board task cards
export const TASK_CARD_BORDER_COLORS: Record<TaskType, string> = {
  backlog: 'border-l-zinc-600',
  high: 'border-l-rose-500',
  medium: 'border-l-orange-500',
  low: 'border-l-yellow-400',
  leisure: 'border-l-cyan-400',
  chores: 'border-l-slate-500', // Changed from white to slate for a more neutral grey/blue feel
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

export const TARGET_HOURS_PER_DAY = 6; // User-defined target for daily capacity

// --- Sound Utility ---
export const playSuccessSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const now = ctx.currentTime;

        // Create a pleasant "Major Chord" arpeggio (C6, E6, G6)
        const frequencies = [1046.50, 1318.51, 1567.98]; 
        
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            // Stagger start times slightly for an arpeggio effect
            const startTime = now + (i * 0.05);
            
            // Envelope: Fast attack, smooth decay
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);
            
            osc.start(startTime);
            osc.stop(startTime + 0.6);
        });
    } catch (e) {
        console.error("Audio play failed", e);
    }
};