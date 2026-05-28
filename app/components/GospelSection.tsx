import type { Gospel, ReflectionTag } from "../types";
import GospelCard from "./GospelCard";
import ReflectionForm from "./ReflectionForm";
import GospelSkeleton from "./skeletons/GospelSkeleton";
type GospelSectionProps = {
  gospel: Gospel | null;
  theme: {
    mode?: string;
    card: string;
    button: string;
    innerCard: string;
    input: string;
    mutedButton: string;
    accentText: string;
    primaryText: string;
    bodyText: string;
    mutedText: string;
    divider: string;
    pill: string;
    isLoading?: boolean;
  };
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
  theme,
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
  if (isLoading || !gospel) {
  return <GospelSkeleton theme={theme} />;
}
  return (
    <div className="space-y-8 sm:space-y-10">
      <section id="evangelio-de-hoy" data-tour="gospel-section">
        <GospelCard gospel={gospel} theme={theme} />
      </section>

      <div data-tour="reflection-box">
      <ReflectionForm
        reflection={reflection}
        shareReflection={shareReflection}
        selectedTags={selectedTags}
        theme={theme}
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