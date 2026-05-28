"use client";

import { useState } from "react";
import type { ReflectionTag } from "../types";

type SourceFilter = "all" | "own" | "community";

type DiaryFiltersProps = {
  usedTags: ReflectionTag[];
  selectedTagId: string | null;
  showOnlyFavorites: boolean;
  sourceFilter: SourceFilter;
  onSelectTag: (tagId: string | null) => void;
  onShowOnlyFavoritesChange: (value: boolean) => void;
  onSourceFilterChange: (value: SourceFilter) => void;
  theme: {
    mode?: string;
    card: string;
    innerCard: string;
    mutedButton: string;
    accentText: string;
    primaryText: string;
    bodyText: string;
    mutedText: string;
    pill: string;
  };
};

export default function DiaryFilters({
  usedTags,
  selectedTagId,
  showOnlyFavorites,
  sourceFilter,
  onSelectTag,
  onShowOnlyFavoritesChange,
  onSourceFilterChange,
  theme,
}: DiaryFiltersProps) {
  const [areTagsOpen, setAreTagsOpen] = useState(false);

  const selectedTag = usedTags.find((tag) => tag.id === selectedTagId);

  return (
    <section className={`mb-5 rounded-[1.7rem] border p-3 shadow-sm backdrop-blur ${theme.innerCard}`}>
      <div className="grid grid-cols-2 justify-center gap-2 sm:flex sm:items-center sm:justify-center">
        <button
          type="button"
          onClick={() => onShowOnlyFavoritesChange(!showOnlyFavorites)}
          className={`flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
            showOnlyFavorites
              ? theme.mode === "night"
                ? "border-amber-100/40 bg-amber-100/20 text-amber-100"
                : "border-amber-200 bg-amber-100 text-amber-800"
              : theme.mutedButton
          }`}
        >
          ★ Favoritas
        </button>

        <button
          type="button"
          onClick={() => setAreTagsOpen(!areTagsOpen)}
          className={`flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition ${theme.mutedButton}`}
        >
          {selectedTag
            ? `Etiqueta: ${selectedTag.emoji} ${selectedTag.label}`
            : "Filtrar por etiquetas"}
        </button>

        <div className={`col-span-2 flex justify-center rounded-full border p-1 sm:col-span-1 ${theme.innerCard}`}>
          <SourceButton
            label="Todo"
            active={sourceFilter === "all"}
            onClick={() => onSourceFilterChange("all")}
            theme={theme}
          />
          <SourceButton
            label="Mías"
            active={sourceFilter === "own"}
            onClick={() => onSourceFilterChange("own")}
            theme={theme}
          />
          <SourceButton
            label="Comunidad"
            active={sourceFilter === "community"}
            onClick={() => onSourceFilterChange("community")}
            theme={theme}
          />
        </div>
      </div>

      {areTagsOpen && (
        <div className={`mt-3 flex flex-wrap gap-2 rounded-2xl border p-3 ${theme.innerCard}`}>
          <button
            type="button"
            onClick={() => onSelectTag(null)}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
              selectedTagId === null
                ? theme.mode === "night"
                  ? "border-[#d9e2cf]/55 bg-[#d9e2cf] text-[#202822]"
                  : "border-[#26351f] bg-[#26351f] text-white"
                : theme.mutedButton
            }`}
          >
            Todas
          </button>

          {usedTags.length === 0 ? (
            <p className={`px-2 py-1 text-sm ${theme.bodyText}`}>
              Aún no hay etiquetas usadas.
            </p>
          ) : (
            usedTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => onSelectTag(tag.id)}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                  selectedTagId === tag.id
                    ? theme.mode === "night"
                      ? "border-[#d9e2cf]/55 bg-[#d9e2cf] text-[#202822]"
                      : "border-[#26351f] bg-[#26351f] text-white"
                    : theme.mutedButton
                }`}
              >
                <span className="mr-1">{tag.emoji}</span>
                {tag.label}
              </button>
            ))
          )}
        </div>
      )}
    </section>
  );
}

function SourceButton({
  label,
  active,
  onClick,
  theme,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  theme: {
    mode?: string;
    primaryText: string;
    mutedButton: string;
  };
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
        active
          ? theme.mode === "night"
            ? "bg-[#d9e2cf] text-[#202822]"
            : "bg-[#26351f] text-white"
          : `bg-transparent ${theme.primaryText}`
      }`}
    >
      {label}
    </button>
  );
}