"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const THRESHOLD = 72;

type Props = {
  onRefresh: () => Promise<void> | void;
};

export default function PullToRefresh({ onRefresh }: Props) {
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef<number | null>(null);
  const pullYRef = useRef(0);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      if (window.scrollY === 0) {
        startYRef.current = e.touches[0].clientY;
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (startYRef.current === null) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta > 0) {
        const clamped = Math.min(delta, THRESHOLD + 24);
        pullYRef.current = clamped;
        setPullY(clamped);
      }
    }

    function onTouchEnd() {
      if (startYRef.current === null) return;
      const pulled = pullYRef.current;
      startYRef.current = null;
      pullYRef.current = 0;
      setPullY(0);
      if (pulled >= THRESHOLD) void handleRefresh();
    }

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleRefresh]);

  const visible = pullY > 8 || isRefreshing;
  if (!visible) return null;

  const progress = Math.min(pullY / THRESHOLD, 1);
  const translateY = isRefreshing ? 12 : pullY * 0.45;

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[300] flex justify-center"
      style={{ transform: `translateY(${translateY}px)` }}
    >
      <div className="mt-2 rounded-full border border-[var(--divider)] bg-[var(--card-bg)] p-2 shadow-md">
        {isRefreshing ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        ) : (
          <div
            className="h-5 w-5 rounded-full border-2 border-[var(--accent)]"
            style={{
              opacity: progress,
              transform: `rotate(${progress * 180}deg)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
