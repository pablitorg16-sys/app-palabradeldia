import { faithAvatars } from "../data/faithAvatars";

type FaithAvatarProps = {
  avatarId?: string;
  fallbackName: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-9 w-9 text-base",
  md: "h-11 w-11 text-xl",
  lg: "h-16 w-16 text-3xl",
};

export default function FaithAvatar({
  avatarId,
  fallbackName,
  size = "md",
}: FaithAvatarProps) {
  const avatar = faithAvatars.find((item) => item.id === avatarId);

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-[#5f6f52]/25 bg-[#f4f1e8] font-bold text-[#26351f] shadow-sm ${sizeClasses[size]}`}
      title={avatar?.label ?? fallbackName}
    >
      {avatar ? avatar.symbol : fallbackName.charAt(0).toUpperCase()}
    </span>
  );
}