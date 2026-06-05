"use client";

import { useEffect, useRef } from "react";
import type { ReflectionTag } from "../types";
import { reflectionTags } from "../data/reflectionTags";
import { useTheme } from "../context/ThemeContext";
import { getThemeClasses } from "../utils/theme";

type ReflectionFormProps = {
  reflection: string;
  shareReflection: boolean;
  selectedTags: ReflectionTag[];
  isAuthenticated: boolean;
  onReflectionChange: (value: string) => void;
  onShareChange: (value: boolean) => void;
  onTagsChange: (tags: ReflectionTag[]) => void;
  onSave: () => void;
};

export default function ReflectionForm({
  reflection,
  shareReflection,
  selectedTags,
  isAuthenticated,
  onReflectionChange,
  onShareChange,
  onTagsChange,
  onSave,
}: ReflectionFormProps) {
  const theme = getThemeClasses();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const groupOneSelected = selectedTags.some((tag) => tag.group === 1);
  const groupTwoSelected = selectedTags.some((tag) => tag.group === 2);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [reflection]);

  function toggleTag(tag: ReflectionTag) {
    const alreadySelected = selectedTags.some((t) => t.id === tag.id);
    if (alreadySelected) {
      onTagsChange(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  }

  function getTagsByGroup(group: number) {
    return reflectionTags.filter((tag) => tag.group === group);
  }

  return (
    <section className={`rounded-[1.8rem] border p-5 shadow-sm backdrop-blur sm:rounded-[2rem] sm:p-7 ${theme.card}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.24em] ${theme.accentText}`}>
            Diario personal
          </p>
          <h2 className={`text-2xl font-bold ${theme.primaryText}`}>Tu reflexión</h2>
        </div>
        <p className={`text-xs font-semibold ${theme.accentText}`}>{reflection.length}/500</p>
      </div>

      <textarea
        ref={textareaRef}
        value={reflection}
        onChange={(e) => onReflectionChange(e.target.value)}
        maxLength={500}
        rows={5}
        className={`min-h-32 w-full resize-none overflow-hidden rounded-3xl border p-4 text-[0.95rem] leading-7 outline-none transition focus:ring-2 focus:ring-[#9aa58f]/25 sm:min-h-40 sm:p-5 ${theme.input}`}
        placeholder="Hoy este Evangelio me invita a..."
      />

      <div className="mt-5 space-y-4">
        <TagGroup
          title="Hoy esta Palabra me habla de..."
          tags={getTagsByGroup(1)}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
        />
        {groupOneSelected && (
          <TagGroup
            title="¿Dónde sientes esto en tu vida?"
            tags={getTagsByGroup(2)}
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
          />
        )}
        {groupTwoSelected && (
          <TagGroup
            title="¿Hacia dónde te impulsa esta reflexión?"
            tags={getTagsByGroup(3)}
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
          />
        )}
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {isAuthenticated && (
          <label className={`flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-sm font-medium ${theme.innerCard} ${theme.primaryText}`}>
            <input
              type="checkbox"
              checked={shareReflection}
              onChange={(e) => onShareChange(e.target.checked)}
              className="h-4 w-4 rounded border-[#5f6f52]"
            />
            Compartir también en comunidad
          </label>
        )}
        <button
          onClick={onSave}
          disabled={!reflection.trim()}
          className={`w-full rounded-2xl px-6 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${theme.button}`}
        >
          Guardar reflexión
        </button>
      </div>
    </section>
  );
}

function TagGroup({
  title,
  tags,
  selectedTags,
  onToggleTag,
}: {
  title: string;
  tags: ReflectionTag[];
  selectedTags: ReflectionTag[];
  onToggleTag: (tag: ReflectionTag) => void;
}) {
  const { theme: dayPeriod } = useTheme();
  const theme = getThemeClasses();
  const isNight = dayPeriod === "night";

  const selectedClass = isNight
    ? "border-[#d9e2cf]/55 bg-[#d9e2cf] text-[#202822] shadow-sm"
    : "border-[#26351f] bg-[#26351f] text-white shadow-sm";

  return (
    <div>
      <p className={`mb-3 text-sm font-semibold ${theme.accentText}`}>{title}</p>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.some((t) => t.id === tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggleTag(tag)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm ${
                isSelected ? selectedClass : `${theme.mutedButton} ${theme.accentText}`
              }`}
            >
              <span className="mr-1">{tag.emoji}</span>
              {tag.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}