"use client";

type SkeletonTheme = {
  mode?: string;
};

export function SkeletonBlock({
  className = "",
  theme,
}: {
  className?: string;
  theme: SkeletonTheme;
}) {
  return (
    <div
      className={`animate-pulse rounded-full ${
        theme.mode === "night" ? "bg-[#d9e2cf]/10" : "bg-[#26351f]/10"
      } ${className}`}
    />
  );
}

export function SkeletonCard({
  children,
  theme,
  className = "",
}: {
  children: React.ReactNode;
  theme: SkeletonTheme;
  className?: string;
}) {
  return (
    <article
      className={`rounded-[2rem] border p-6 shadow-sm ${
        theme.mode === "night"
          ? "border-[#d9e2cf]/10 bg-[#263126]"
          : "border-[#d8d1c0] bg-[#f8f4ea]"
      } ${className}`}
    >
      {children}
    </article>
  );
}