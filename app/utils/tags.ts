import type { DiaryEntry, ReflectionTag } from "../types";

export type UsedTag = ReflectionTag & {
  count: number;
};

export function getUsedTags(entries: DiaryEntry[]): UsedTag[] {
  const tagsMap = new Map<string, UsedTag>();

  entries.forEach((entry) => {
    entry.tags?.forEach((tag) => {
      const existingTag = tagsMap.get(tag.id);

      if (existingTag) {
        tagsMap.set(tag.id, {
          ...existingTag,
          count: existingTag.count + 1,
        });
      } else {
        tagsMap.set(tag.id, {
          ...tag,
          count: 1,
        });
      }
    });
  });

  return Array.from(tagsMap.values()).sort((a, b) => b.count - a.count);
}