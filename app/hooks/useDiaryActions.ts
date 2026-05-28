"use client";

import type { Dispatch, SetStateAction } from "react";
import type { CommunityPost, DiaryEntry, Gospel, ReflectionTag } from "../types";
import { getSpanishDate, getSpanishTime } from "../utils/date";
import {
  deleteReflection,
  insertReflection,
  updateReflection,
} from "../utils/reflections";

type UseDiaryActionsProps = {
  diaryEntries: DiaryEntry[];
  setDiaryEntries: Dispatch<SetStateAction<DiaryEntry[]>>;
  userId?: string;
  onCommunityChange?: () => void;
};

export function useDiaryActions({
  diaryEntries,
  setDiaryEntries,
  userId,
  onCommunityChange,
}: UseDiaryActionsProps) {
  async function saveReflection({
    reflection,
    shareReflection,
    selectedTags,
    selectedGospel,
    onAfterSave,
  }: {
    reflection: string;
    shareReflection: boolean;
    selectedTags: ReflectionTag[];
    selectedGospel: Gospel;
    onAfterSave: () => void;
  }) {
    const cleanReflection = reflection.trim();

    if (!cleanReflection) return;

    const now = new Date();

    const localEntry: DiaryEntry = {
      id: Date.now(),
      text: cleanReflection,
      date: getSpanishDate(now),
      time: getSpanishTime(now),
      gospelDate: selectedGospel.date,
      gospelReference: selectedGospel.reference,
      gospelLink: "#evangelio-de-hoy",
      shared: shareReflection,
      favorite: false,
      tags: selectedTags,
      source: "own",
    };

    if (userId) {
      const { entry, error } = await insertReflection(localEntry, userId);

      if (error) {
        console.error("Error saving reflection to Supabase:", error.message);
        return;
      }

      if (entry) {
        setDiaryEntries([entry, ...diaryEntries]);
      }
    } else {
      setDiaryEntries([localEntry, ...diaryEntries]);
    }

    onAfterSave();
  }

  async function saveCommunityPostToDiary(post: CommunityPost) {
    const alreadySaved = diaryEntries.some(
      (entry) =>
        entry.source === "community" &&
        entry.text === post.text &&
        entry.gospelDate === post.gospelDate &&
        entry.originalAuthor === post.author.name
    );

    if (alreadySaved) return;

    const now = new Date();

    const localEntry: DiaryEntry = {
      id: Date.now(),
      text: post.text,
      date: getSpanishDate(now),
      time: getSpanishTime(now),
      gospelDate: post.gospelDate,
      gospelReference: post.gospelReference,
      gospelLink: "#evangelio-de-hoy",
      shared: false,
      favorite: false,
      tags: post.tags,
      source: "community",
      originalAuthor: post.author.name,
    };

    if (userId) {
      const { entry, error } = await insertReflection(localEntry, userId);

      if (error) {
        console.error("Error saving community post to Supabase:", error.message);
        return;
      }

      if (entry) {
        setDiaryEntries([entry, ...diaryEntries]);
      }
    } else {
      setDiaryEntries([localEntry, ...diaryEntries]);
    }
  }

  async function deleteEntry(id: string | number) {
    setDiaryEntries(diaryEntries.filter((entry) => entry.id !== id));

    if (userId) {
      const { error } = await deleteReflection(id, userId);

      if (error) {
        console.error("Error deleting reflection from Supabase:", error.message);
      }
    }
  }

  async function toggleShared(id: string | number) {
    const entryToUpdate = diaryEntries.find((entry) => entry.id === id);
    if (!entryToUpdate) return;

    const newSharedValue = !entryToUpdate.shared;

    setDiaryEntries(
      diaryEntries.map((entry) =>
        entry.id === id ? { ...entry, shared: newSharedValue } : entry
      )
    );

    if (userId) {
      const { error } = await updateReflection(id, userId, {
        shared: newSharedValue,
      });

      if (error) {
        console.error("Error updating shared status:", error.message);
        return;
      }
      onCommunityChange?.();
    }
  }

  async function toggleFavorite(id: string | number) {
    const entryToUpdate = diaryEntries.find((entry) => entry.id === id);
    if (!entryToUpdate) return;

    const newFavoriteValue = !entryToUpdate.favorite;

    setDiaryEntries(
      diaryEntries.map((entry) =>
        entry.id === id ? { ...entry, favorite: newFavoriteValue } : entry
      )
    );

    if (userId) {
      const { error } = await updateReflection(id, userId, {
        favorite: newFavoriteValue,
      });

      if (error) {
        console.error("Error updating favorite status:", error.message);
      }
    }
  }

  return {
    saveReflection,
    saveCommunityPostToDiary,
    deleteEntry,
    toggleShared,
    toggleFavorite,
  };
}