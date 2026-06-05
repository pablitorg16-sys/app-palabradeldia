"use client";

import { useTheme } from "../../context/ThemeContext";

export function SkeletonBlock({ className = "" }: { className?: string }) {
  const { theme: dayPeriod } = useTheme();
  const isNight = dayPeriod === "night";

  return (
    <div
      className={`animate-pulse rounded-full ${
        isNight ? "bg-[#d9e2cf]/10" : "bg-[#26351f]/10"
      } ${className}`}
    />
  );
}

export function SkeletonCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { theme: dayPeriod } = useTheme();
  const isNight = dayPeriod === "night";

  return (
    <article
      className={`rounded-[2rem] border p-6 shadow-sm ${
        isNight
          ? "border-[#d9e2cf]/10 bg-[#263126]"
          : "border-[#d8d1c0] bg-[#f8f4ea]"
      } ${className}`}
    >
      {children}
    </article>
  );
}