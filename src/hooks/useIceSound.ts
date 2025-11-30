import { useCallback, useRef } from 'react';

export function useIceSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/ice-crack.mp3');
      }
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch {
      // ignore audio errors
    }
  }, []);

  return { play };
}
