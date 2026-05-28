"use client";

import { useState } from "react";

export function useSaveFeedback() {
  const [saveMessage, setSaveMessage] = useState("");

  function showSaveMessage(message: string) {
    setSaveMessage(message);

    setTimeout(() => {
      setSaveMessage("");
    }, 2500);
  }

  return {
    saveMessage,
    showSaveMessage,
  };
}