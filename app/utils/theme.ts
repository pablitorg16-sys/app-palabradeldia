export function getThemeClasses() {
  return {
    page:        "bg-[var(--page-bg)] text-[var(--primary)]",
    card:        "border-[var(--card-border)]/35 bg-[var(--card-bg)]/95",
    softCard:    "border-[var(--card-border)]/25 bg-[var(--soft-bg)]/95",
    innerCard:   "border-[var(--card-border)]/20 bg-[var(--inner-bg)]",
    input:       "border-[var(--card-border)]/25 bg-[var(--input-bg)] text-[var(--primary)] placeholder:text-[var(--muted)]",
    mutedButton: "border-[var(--card-border)]/20 bg-[var(--muted-btn)] text-[var(--primary)] hover:bg-white/70",
    accentText:  "text-[var(--accent)]",
    primaryText: "text-[var(--primary)]",
    bodyText:    "text-[var(--body)]",
    mutedText:   "text-[var(--muted)]",
    divider:     "bg-[var(--divider)]",
    pill:        "border-[var(--card-border)]/30 bg-[var(--pill-bg)] text-[var(--accent)]",
    button:      "bg-[var(--btn-bg)] hover:bg-[var(--btn-hover)] text-[var(--btn-text)]",
  };
}