import type { DayPeriod } from "../hooks/useDayPeriod";

export function getThemeClasses(dayPeriod: DayPeriod) {
  if (dayPeriod === "sunrise") {
    return {
      mode: "sunrise",
      page: "bg-[#efe5d6] text-stone-800",
      card: "border-[#b98b5e]/35 bg-[#fff7ed]/75",
      softCard: "border-[#b98b5e]/25 bg-[#f8ead8]/75",
      innerCard: "border-[#b98b5e]/20 bg-white/45",
      input: "border-[#b98b5e]/25 bg-white/70 text-[#3f2f22] placeholder:text-[#8a5a32]/60",
      mutedButton: "border-[#b98b5e]/20 bg-white/45 text-[#3f2f22] hover:bg-white/70",
      accentText: "text-[#8a5a32]",
      primaryText: "text-[#3f2f22]",
      bodyText: "text-stone-700",
      mutedText: "text-stone-500",
      divider: "bg-[#b98b5e]/35",
      pill: "border-[#b98b5e]/30 bg-white/55 text-[#8a5a32]",
      button: "bg-[#5a3b24] hover:bg-[#6f4a2e] text-white",
    };
  }

  if (dayPeriod === "sunset") {
    return {
      mode: "sunset",
      page: "bg-[#e8ddd2] text-stone-800",
      card: "border-[#9f7556]/35 bg-[#f7eadf]/75",
      softCard: "border-[#9f7556]/25 bg-[#ead5c2]/75",
      innerCard: "border-[#9f7556]/20 bg-white/40",
      input: "border-[#9f7556]/25 bg-white/70 text-[#3b2a22] placeholder:text-[#7a4f35]/60",
      mutedButton: "border-[#9f7556]/20 bg-white/45 text-[#3b2a22] hover:bg-white/70",
      accentText: "text-[#7a4f35]",
      primaryText: "text-[#3b2a22]",
      bodyText: "text-stone-700",
      mutedText: "text-stone-500",
      divider: "bg-[#9f7556]/35",
      pill: "border-[#9f7556]/30 bg-white/55 text-[#7a4f35]",
      button: "bg-[#4f3327] hover:bg-[#684434] text-white",
    };
  }

  if (dayPeriod === "night") {
    return {
      mode: "night",
      page: "bg-[#202822] text-[#f4f1e8]",
      card: "border-[#7d8a75]/35 bg-[#2d372f]/90",
      softCard: "border-[#7d8a75]/25 bg-[#334039]/80",
      innerCard: "border-[#9aa58f]/20 bg-[#3d493f]/45",
      input: "border-[#9aa58f]/25 bg-[#202822]/60 text-[#f4f1e8] placeholder:text-[#c8d2bf]/60",
      mutedButton: "border-[#9aa58f]/20 bg-[#3d493f]/55 text-[#f4f1e8] hover:bg-[#465348]/70",
      accentText: "text-[#c8d2bf]",
      primaryText: "text-[#f4f1e8]",
      bodyText: "text-[#e7eadf]",
      mutedText: "text-[#b9c2b0]",
      divider: "bg-[#9aa58f]/40",
      pill: "border-[#9aa58f]/35 bg-[#3d493f]/80 text-[#e7eadf]",
      button: "bg-[#e7eadf] hover:bg-white text-[#26351f]",
    };
  }

  return {
    mode: "day",
    page: "bg-[#e7eadf] text-stone-800",
    card: "border-[#5f6f52]/35 bg-[#f8faf2]/95",
    softCard: "border-[#5f6f52]/25 bg-[#f4f1e8]/95",
    innerCard: "border-[#5f6f52]/20 bg-[#fdfdf8]/90",
    input: "border-[#5f6f52]/25 bg-white/70 text-[#26351f] placeholder:text-[#5f6f52]/60",
    mutedButton: "border-[#5f6f52]/20 bg-white/45 text-[#26351f] hover:bg-white/70",
    accentText: "text-[#4f6740]",
    primaryText: "text-[#26351f]",
    bodyText: "text-stone-700",
    mutedText: "text-stone-500",
    divider: "bg-[#5f6f52]/35",
    pill: "border-[#5f6f52]/30 bg-white/55 text-[#4f6740]",
    button: "bg-[#26351f] hover:bg-[#34482a] text-white",
  };
}