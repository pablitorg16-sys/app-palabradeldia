"use client";

import React from "react";
import { BookOpen, PenLine, Users } from "lucide-react";
import { getThemeClasses } from "../utils/theme";
import type { Tab } from "../types";

type TabsNavProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const TABS = [
  { id: "evangelio" as Tab, label: "Evangelio", Icon: BookOpen },
  { id: "diario"    as Tab, label: "Diario",    Icon: PenLine  },
  { id: "comunidad" as Tab, label: "Comunidad", Icon: Users    },
];

export default function TabsNav({ activeTab, onTabChange }: TabsNavProps) {
  const theme = getThemeClasses();

  return (
    <React.Fragment>
      {/* Desktop: underline tab strip */}
      <nav className="mb-8 hidden sm:sticky sm:top-0 sm:z-50 sm:block bg-[var(--page-bg)]">
        <div className="flex border-b border-[var(--divider)]">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
                activeTab === id
                  ? "border-[var(--accent)] text-[var(--primary)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--body)]"
              }`}
            >
              <Icon size={14}></Icon>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile: floating pill bar */}
      <nav
        className={`fixed bottom-2 left-4 right-4 z-[120] sm:hidden rounded-[var(--radius-modal)] border p-1.5 shadow-xl ${theme.softCard}`}
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.375rem)" }}
      >
        <div className="grid grid-cols-3 gap-1.5">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-[var(--radius-panel)] px-2 py-2 text-[10px] font-semibold transition active:scale-[0.97] ${
                activeTab === id ? theme.button : theme.mutedText
              }`}
            >
              <Icon size={16}></Icon>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </React.Fragment>
  );
}