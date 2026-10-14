import { useCallback, useEffect, useRef, useState } from 'react';

type UsePlaybackOptions = {
  count: number;
  intervalMs: number;
  autoPlay?: boolean;
};

export function usePlayback({ count, intervalMs, autoPlay = false }: UsePlaybackOptions) {
  const itemCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoPlay && itemCount > 1);
  const indexRef = useRef(0);
  const playingRef = useRef(playing);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const seek = useCallback(
    (nextIndex: number) => {
      const next =
        itemCount === 0
          ? 0
          : Math.min(
              itemCount - 1,
              Math.max(0, Math.floor(Number.isFinite(nextIndex) ? nextIndex : 0)),
            );
      indexRef.current = next;
      setIndex(next);
      pause();
    },
    [itemCount, pause],
  );

  const toggle = useCallback(() => {
    if (playingRef.current) {
      pause();
      return;
    }

    if (itemCount <= 1) return;
    if (indexRef.current >= itemCount - 1) {
      indexRef.current = 0;
      setIndex(0);
    }
    playingRef.current = true;
    setPlaying(true);
  }, [itemCount, pause]);

  useEffect(() => {
    if (!playing || itemCount <= 1) {
      clearTimer();
      return;
    }

    timerRef.current = setInterval(
      () => {
        if (!playingRef.current) return;

        const next = Math.min(indexRef.current + 1, itemCount - 1);
        indexRef.current = next;
        setIndex(next);

        if (next === itemCount - 1) {
          playingRef.current = false;
          setPlaying(false);
          clearTimer();
        }
      },
      Math.max(1, intervalMs),
    );

    return clearTimer;
  }, [clearTimer, intervalMs, itemCount, playing]);

  return {
    index: itemCount === 0 ? 0 : Math.min(index, itemCount - 1),
    playing,
    seek,
    toggle,
  };
}
