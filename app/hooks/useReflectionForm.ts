"use client";

import { useState } from "react";
import type { ReflectionTag } from "../types";

export function useReflectionForm() {
  const [reflection, setReflection] = useState("");
  const [shareReflection, setShareReflection] = useState(false);
  const [selectedTags, setSelectedTags] = useState<ReflectionTag[]>([]);

  function resetReflectionForm() {
    setReflection("");
    setShareReflection(false);
    setSelectedTags([]);
  }

  return {
    reflection,
    setReflection,
    shareReflection,
    setShareReflection,
    selectedTags,
    setSelectedTags,
    resetReflectionForm,
  };
}