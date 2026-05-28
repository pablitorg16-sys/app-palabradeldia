export type FaithAvatarId =
  | "cross"
  | "dove"
  | "rosary"
  | "bible"
  | "chalice"
  | "fish"
  | "light"
  | "olive";

export const faithAvatars = [
  { id: "cross", label: "Cruz", symbol: "✝️" },
  { id: "dove", label: "Paloma", symbol: "🕊️" },
  { id: "rosary", label: "Rosario", symbol: "📿" },
  { id: "bible", label: "Biblia", symbol: "📖" },
  { id: "chalice", label: "Cáliz", symbol: "🍷" },
  { id: "fish", label: "Pez", symbol: "🐟" },
  { id: "light", label: "Luz", symbol: "✨" },
  { id: "olive", label: "Olivo", symbol: "🌿" },
] as const;