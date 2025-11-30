import { useCallback, useRef } from 'react';

/**
 * useCompletionSound - lightweight Web Audio chime for task completion
 */
export function useCompletionSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const ensureContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const play = useCallback(() => {
    try {
      const ctx = ensureContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Swallow errors silently to avoid UX disruption
    }
  }, []);

  return { play };
}
