import type { Tab } from "../types";

type TabsNavProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  theme: {
    softCard: string;
    button: string;
  };
};

export default function TabsNav({
  activeTab,
  onTabChange,
  theme,
}: TabsNavProps) {
  return (
    <>
      <nav
        className={`mb-8 hidden rounded-2xl border p-3 shadow-sm backdrop-blur sm:sticky sm:top-4 sm:z-50 sm:block ${theme.softCard}`}
      >
        <div className="grid w-full grid-cols-3 gap-3">
          <TabButton
            label="Evangelio"
            active={activeTab === "evangelio"}
            onClick={() => onTabChange("evangelio")}
            theme={theme}
          />

          <TabButton
            label="Diario"
            active={activeTab === "diario"}
            onClick={() => onTabChange("diario")}
            theme={theme}
          />

          <TabButton
            label="Comunidad"
            active={activeTab === "comunidad"}
            onClick={() => onTabChange("comunidad")}
            theme={theme}
          />
        </div>
      </nav>

      <nav
        className={`fixed bottom-2 left-4 right-4 z-[120] rounded-3xl border p-1.5 shadow-2xl backdrop-blur sm:hidden ${theme.softCard}`}
      >
        <div className="grid grid-cols-3 gap-2">
          <TabButton
            label="Evangelio"
            icon="✦"
            active={activeTab === "evangelio"}
            onClick={() => onTabChange("evangelio")}
            theme={theme}
          />

          <TabButton
            label="Diario"
            icon="✍️"
            active={activeTab === "diario"}
            onClick={() => onTabChange("diario")}
            theme={theme}
          />

          <TabButton
            label="Comunidad"
            icon="☷"
            active={activeTab === "comunidad"}
            onClick={() => onTabChange("comunidad")}
            theme={theme}
          />
        </div>
      </nav>
    </>
  );
}

function TabButton({
  label,
  icon,
  active,
  onClick,
  theme,
}: {
  label: string;
  icon?: string;
  active: boolean;
  onClick: () => void;
  theme: {
    button: string;
  };
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-full w-full flex-col items-center justify-center rounded-2xl px-2 py-1.5 text-center text-[10px] font-semibold transition active:scale-[0.98] sm:flex-row sm:px-5 sm:py-3 sm:text-sm ${
        active ? theme.button : "bg-white/45 text-[#26351f] hover:bg-white"
      }`}
    >
      {icon && <span className="mb-0.5 text-base leading-none">{icon}</span>}
      {label}
    </button>
  );
}