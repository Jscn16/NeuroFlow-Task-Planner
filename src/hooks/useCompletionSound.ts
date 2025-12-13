import { useCallback, useRef } from 'react';

/**
 * useCompletionSound - plays task completion sound from MP3 file
 */
export function useCompletionSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    try {
      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/task-complete.mp3');
        audioRef.current.volume = 0.5;
      }

      // Reset and play
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Swallow errors silently (e.g., autoplay restrictions)
      });
    } catch {
      // Swallow errors silently to avoid UX disruption
    }
  }, []);

  return { play };
}

