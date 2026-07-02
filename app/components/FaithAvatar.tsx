import { faithAvatars } from "../data/faithAvatars";

type FaithAvatarId =
  | "cross" | "dove" | "rosary" | "bible"
  | "chalice" | "fish" | "light" | "olive";

type FaithAvatarProps = {
  avatarId?: string;
  fallbackName: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-16 w-16",
};

const iconSizes = { sm: 18, md: 22, lg: 32 };

type SvgProps = { sz: number };

function CrossSvg({ sz }: SvgProps) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="5" y1="8" x2="19" y2="8" />
    </svg>
  );
}

function DoveSvg({ sz }: SvgProps) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="11" cy="14.5" rx="5.5" ry="4" fill="currentColor"/>
      <path d="M10 12 Q13 5 20 3 Q20 8 16 12Z" fill="currentColor"/>
      <path d="M14 12 Q17 9 20 10 Q19 13 15 13Z" fill="currentColor"/>
      <circle cx="6.5" cy="10" r="2.8" fill="currentColor"/>
      <path d="M6.5 12.5 Q7 14 9 14.5 Q8 12 6.5 12.5Z" fill="currentColor"/>
      <path d="M4 9.5 L1.5 8.5 L4 11Z" fill="currentColor"/>
      <path d="M16 15.5 Q20 14 22 17 Q19 18 16 16Z" fill="currentColor"/>
      <path d="M16 16.5 Q20 17 21 20 Q18 20 16 17.5Z" fill="currentColor"/>
      <path d="M9 18 L8.5 21 M7.5 21 L10 21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <path d="M12 18.5 L12 21 M10.5 21 L13.5 21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <path d="M1.5 8.5 Q0 6 1 4" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <ellipse cx="0.8" cy="4" rx="1.3" ry="0.8" transform="rotate(-40 0.8 4)" fill="currentColor"/>
      <ellipse cx="1.5" cy="6" rx="1.2" ry="0.7" transform="rotate(-20 1.5 6)" fill="currentColor"/>
    </svg>
  );
}

function RosarySvg({ sz }: SvgProps) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="9" r="6.5" strokeDasharray="2.2 2.6" />
      <line x1="12" y1="15.5" x2="12" y2="21" />
      <line x1="9.5" y1="18.5" x2="14.5" y2="18.5" />
    </svg>
  );
}

function BibleSvg({ sz }: SvgProps) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Libro cerrado */}
      <rect x="4" y="3" width="16" height="18" rx="2" />
      {/* Lomo */}
      <line x1="8" y1="3" x2="8" y2="21" />
      {/* Cruz en cubierta */}
      <line x1="14.5" y1="9" x2="14.5" y2="16" />
      <line x1="11.5" y1="12.5" x2="17.5" y2="12.5" />
    </svg>
  );
}

function ChaliceSvg({ sz }: SvgProps) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h10l-3 9a4 4 0 0 1-4 0L7 3z" />
      <line x1="12" y1="12" x2="12" y2="19" />
      <line x1="7.5" y1="19" x2="16.5" y2="19" />
    </svg>
  );
}

function FishSvg({ sz }: SvgProps) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="13" cy="12" rx="8" ry="5.5" />
      <line x1="5" y1="12" x2="2" y2="8" />
      <line x1="5" y1="12" x2="2" y2="16" />
      <circle cx="18" cy="10" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LightSvg({ sz }: SvgProps) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c-1.5 3-3 4.5-3 7a3 3 0 0 0 6 0c0-2.5-1.5-4-3-7z" />
      <rect x="9.5" y="12" width="5" height="7" rx="0.5" />
      <line x1="7" y1="21" x2="17" y2="21" />
    </svg>
  );
}

function OliveSvg({ sz }: SvgProps) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Rama */}
      <path d="M6 21 Q10 16 14 10 Q17 6 19 3" />
      {/* Hoja derecha */}
      <path d="M14 10 Q16 7 19 8 Q18 11 14 10z" />
      {/* Hoja izquierda */}
      <path d="M11 14 Q8 12 8 9 Q11 9 11 14z" />
      {/* Olivas */}
      <circle cx="16" cy="13" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="10" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const AVATAR_SVGS: Record<FaithAvatarId, (sz: number) => React.ReactElement> = {
  cross:       (sz) => <CrossSvg sz={sz} />,
  dove:        (sz) => <DoveSvg sz={sz} />,
  rosary:      (sz) => <RosarySvg sz={sz} />,
  bible:       (sz) => <BibleSvg sz={sz} />,
  chalice:     (sz) => <ChaliceSvg sz={sz} />,
  fish:        (sz) => <FishSvg sz={sz} />,
  light:       (sz) => <LightSvg sz={sz} />,
  olive:       (sz) => <OliveSvg sz={sz} />,
};

export default function FaithAvatar({
  avatarId,
  fallbackName,
  size = "md",
}: FaithAvatarProps) {
  const avatar = faithAvatars.find((item) => item.id === avatarId);
  const iconSize = iconSizes[size];
  const renderSvg = avatar ? AVATAR_SVGS[avatar.id as FaithAvatarId] : null;

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-[#5f6f52]/25 bg-[#f4f1e8] font-bold text-[#26351f] shadow-sm ${sizeClasses[size]}`}
      title={avatar?.label ?? fallbackName}
    >
      {renderSvg ? renderSvg(iconSize) : fallbackName.charAt(0).toUpperCase()}
    </span>
  );
}
