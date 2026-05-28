export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
};

export type Gospel = {
  date: string;
  reference: string;
  title: string;
  text: string;
};

export type ReflectionTag = {
  id: string;
  label: string;
  emoji: string;
  group: number;
};

export type DiaryEntrySource = "own" | "community";

export type DiaryEntry = {
  id: number | string;
  text: string;
  date: string;
  time: string;
  gospelDate: string;
  gospelReference: string;
  gospelLink: string;
  shared: boolean;
  favorite: boolean;
  likes?: number;
  tags: ReflectionTag[];
  source: DiaryEntrySource;
  originalAuthor?: string;
};

export type CommunityPost = {
  id: number | string;
  author: User;
  text: string;
  date: string;
  time: string;
  createdAt: string;
  gospelDate: string;
  gospelReference: string;
  likes: number;
  comments: number;
  isLikedByMe: boolean;
  isSavedByMe: boolean;
  tags: ReflectionTag[];
  sourceDiaryEntryId: number | string;
};

export type CommunityComment = {
  id: string;
  reflectionId: string;
  author: User;
  text: string;
  date: string;
  time: string;
  createdAt: string;
};

export type Tab = "evangelio" | "diario" | "comunidad";;
export type ThemePreference = "auto" | "sunrise" | "day" | "sunset" | "night";