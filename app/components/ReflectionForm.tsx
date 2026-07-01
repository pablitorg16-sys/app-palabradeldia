"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Feather, Sun, HelpCircle, Heart, Home,
  Briefcase, Compass, Users, Moon, Flame,
  Leaf, RefreshCw, Sprout, Mountain, Handshake,
  PenLine, ChevronDown, ChevronUp,
} from "lucide-react";
import type { ReflectionTag } from "../types";
import { reflectionTags } from "../data/reflectionTags";
import { useTheme } from "../context/ThemeContext";
import { getThemeClasses } from "../utils/theme";

const TAG_ICONS: Record<string, LucideIcon> = {
  paz: Feather,
  esperanza: Sun,
  duda: HelpCircle,
  perdon: Handshake,
  amor: Heart,
  familia: Home,
  trabajo: Briefcase,
  vocacion: Compass,
  relaciones: Users,
  soledad: Moon,
  oracion: Flame,
  confianza: Leaf,
  cambio: RefreshCw,
  servicio: Sprout,
  perseverancia: Mountain,
};

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
  const [isOpen, setIsOpen] = useState(false);

  const hasContent = reflection.length > 0 || selectedTags.length > 0;
  const groupOneSelected = selectedTags.some((tag) => tag.group === 1);
  const groupTwoSelected = selectedTags.some((tag) => tag.group === 2);

  // Auto-open when the user already has content
  useEffect(() => {
    if (hasContent) setIsOpen(true);
  }, [hasContent]);

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
    <section className={`overflow-hidden rounded-[var(--radius-card)] border shadow-sm ${theme.card}`}>
      {/* CTA — siempre visible, toggle abre/cierra el formulario */}
      <button
        type="button"
        onClick={() => setIsOpen((c) => !c)}
        className={`flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-[var(--soft-bg)] sm:px-7 sm:py-5`}
      >
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${theme.innerCard}`}>
          <PenLine size={15} className={theme.accentText} />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`text-[0.95rem] font-medium ${theme.primaryText}`}
            style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
          >
            Escribe tu reflexi&#243;n
          </p>
          <p className={`mt-0.5 text-xs leading-4 ${theme.mutedText}`}>
            &#191;Qu&#233; te inspira el Evangelio de hoy?
          </p>
        </div>
        {isOpen ? (
          <ChevronUp size={16} className={`shrink-0 ${theme.mutedText}`} />
        ) : (
          <ChevronDown size={16} className={`shrink-0 ${theme.mutedText}`} />
        )}
      </button>

      {/* Formulario expandido */}
      {isOpen && (
        <div className={`border-t border-[var(--card-border)]/20 px-5 pb-5 pt-4 sm:px-7 sm:pb-7`}>
          <div className="mb-2 flex justify-end">
            <p className={`text-xs font-semibold ${theme.accentText}`}>{reflection.length}/500</p>
          </div>

          <textarea
            ref={textareaRef}
            value={reflection}
            onChange={(e) => onReflectionChange(e.target.value)}
            maxLength={500}
            rows={5}
            className={`min-h-32 w-full resize-none overflow-hidden rounded-[var(--radius-panel)] border p-4 text-[0.95rem] leading-7 outline-none transition focus:ring-2 focus:ring-[#9aa58f]/25 sm:min-h-40 sm:p-5 ${theme.input}`}
            style={{ fontFamily: "var(--font-body, Georgia, serif)" }}
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
                title="&#191;D&#243;nde sientes esto en tu vida?"
                tags={getTagsByGroup(2)}
                selectedTags={selectedTags}
                onToggleTag={toggleTag}
              />
            )}
            {groupTwoSelected && (
              <TagGroup
                title="&#191;Hacia d&#243;nde te impulsa esta reflexi&#243;n?"
                tags={getTagsByGroup(3)}
                selectedTags={selectedTags}
                onToggleTag={toggleTag}
              />
            )}
          </div>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {isAuthenticated && (
              <label
                className={`flex items-center gap-3 rounded-[var(--radius-panel)] border px-4 py-2.5 text-sm font-medium ${theme.innerCard} ${theme.primaryText}`}
              >
                <input
                  type="checkbox"
                  checked={shareReflection}
                  onChange={(e) => onShareChange(e.target.checked)}
                  className="h-4 w-4 rounded border-[#5f6f52]"
                />
                Compartir tambi&#233;n en comunidad
              </label>
            )}
            <button
              onClick={onSave}
              disabled={!reflection.trim()}
              className={`w-full rounded-[var(--radius-panel)] px-6 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${theme.button}`}
            >
              Guardar reflexi&#243;n
            </button>
          </div>
        </div>
      )}
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
          const Icon = TAG_ICONS[tag.id];
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggleTag(tag)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm ${
                isSelected ? selectedClass : `${theme.mutedButton} ${theme.accentText}`
              }`}
            >
              {Icon && <Icon size={11} />}
              {tag.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
