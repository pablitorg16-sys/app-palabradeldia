"use client";

import { getThemeClasses } from "../utils/theme";
import type { Gospel, ReflectionTag } from "../types";
import GospelCard from "./GospelCard";
import ReflectionForm from "./ReflectionForm";
import GospelSkeleton from "./skeletons/GospelSkeleton";

type GospelSectionProps = {
  gospel: Gospel | null;
  reflection: string;
  isLoading: boolean;
  shareReflection: boolean;
  selectedTags: ReflectionTag[];
  isAuthenticated: boolean;
  onReflectionChange: (value: string) => void;
  onShareChange: (value: boolean) => void;
  onTagsChange: (tags: ReflectionTag[]) => void;
  onSave: () => void;
};

export default function GospelSection({
  gospel,
  reflection,
  shareReflection,
  selectedTags,
  onReflectionChange,
  onShareChange,
  onTagsChange,
  onSave,
  isLoading,
  isAuthenticated,
}: GospelSectionProps) {
  const theme = getThemeClasses();

  if (isLoading || !gospel) {
    return <GospelSkeleton />;
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <section id="evangelio-de-hoy" data-tour="gospel-section">
        <GospelCard gospel={gospel} />
      </section>

      <div data-tour="reflection-box">
        <ReflectionForm
          reflection={reflection}
          shareReflection={shareReflection}
          selectedTags={selectedTags}
          onReflectionChange={onReflectionChange}
          onShareChange={onShareChange}
          onTagsChange={onTagsChange}
          onSave={onSave}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
}