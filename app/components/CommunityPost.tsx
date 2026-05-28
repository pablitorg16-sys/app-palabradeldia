"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { CommunityPost, Gospel } from "../types";

import CommentsPanel from "./CommentsPanel";
import FaithAvatar from "./FaithAvatar";
import GospelPreview from "./GospelPreview";
import ProfileModal from "./ProfileModal";

type Theme = {
  mode?: string;
  card: string;
  innerCard: string;
  mutedButton: string;
  input: string;
  accentText: string;
  primaryText: string;
  bodyText: string;
  mutedText: string;
  pill: string;
  button: string;
};

type CommunityPostProps = {
  post: CommunityPost;
  gospels: Gospel[];
  theme: Theme;
  currentUserId?: string;
  isOwnPost: boolean;
  onToggleLike: (post: CommunityPost) => void;
  onSaveToDiary: (post: CommunityPost) => void;
  onFollowChange: () => void;
  onCommentChange: () => void;
};

export default function CommunityPostCard({
  post,
  gospels,
  currentUserId,
  isOwnPost,
  theme,
  onToggleLike,
  onSaveToDiary,
  onFollowChange,
  onCommentChange,
}: CommunityPostProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [areCommentsOpen, setAreCommentsOpen] = useState(false);
  const [isGospelOpen, setIsGospelOpen] = useState(false);
  const [showTags, setShowTags] = useState(false);

  function normalizeDate(date: string) {
    if (!date) return "";

    if (date.includes("-")) return date;

    const [day, month, year] = date.split("/");

    if (!day || !month || !year) return date;

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const linkedGospel = gospels.find(
    (gospel) => normalizeDate(gospel.date) === normalizeDate(post.gospelDate)
  );

  return (
    <>
      <article
        id={`reflection-${post.id}`}
        className={`rounded-[2rem] border px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-[1px] ${theme.innerCard}`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <FaithAvatar
              avatarId={post.author.avatarUrl}
              fallbackName={post.author.name}
              size="sm"
            />

            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="min-w-0 text-left transition hover:opacity-80"
            >
              <p className={`truncate text-sm font-bold ${theme.primaryText}`}>
                {post.author.name}
              </p>

              <p
                className={`truncate text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${theme.mutedText}`}
              >
                @{post.author.username} · {post.date}
              </p>
            </button>
          </div>

          {!isOwnPost && (
            <button
              type="button"
              onClick={() => onSaveToDiary(post)}
              disabled={post.isSavedByMe}
              className={`shrink-0 rounded-full border px-3 py-1 text-[0.7rem] font-semibold transition ${
                post.isSavedByMe
                  ? theme.mode === "night"
                    ? "border-[#d9e2cf]/30 bg-[#d9e2cf] text-[#202822]"
                    : "border-emerald-200 bg-emerald-100 text-emerald-700"
                  : theme.mutedButton
              }`}
            >
              {post.isSavedByMe ? "Guardada" : "Guardar"}
            </button>
          )}
        </div>

        <p
          className={`text-justify text-[0.97rem] leading-[1.9] sm:text-left ${theme.bodyText}`}
        >
          {post.text}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsGospelOpen((current) => !current)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${theme.pill}`}
          >
            {isGospelOpen ? "Ocultar Evangelio" : post.gospelReference}
          </button>

          {post.tags.length > 0 && (
            <button
              type="button"
              onClick={() => setShowTags((current) => !current)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${theme.mutedButton}`}
            >
              {showTags ? "Ocultar etiquetas" : `Etiquetas · ${post.tags.length}`}
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            {!isOwnPost && (
              <button
                type="button"
                onClick={() => onToggleLike(post)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  post.isLikedByMe
                    ? theme.mode === "night"
                      ? "border-[#d9e2cf]/30 bg-[#d9e2cf] text-[#202822]"
                      : "border-emerald-200 bg-emerald-100 text-emerald-800"
                    : theme.mutedButton
                }`}
              >
                {post.isLikedByMe ? "💚" : "♡"} {post.likes}
              </button>
            )}

            <button
              type="button"
              onClick={() => setAreCommentsOpen((current) => !current)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                areCommentsOpen
                  ? theme.mode === "night"
                    ? "border-[#d9e2cf]/30 bg-[#d9e2cf] text-[#202822]"
                    : "border-[#26351f] bg-[#26351f] text-white"
                  : theme.mutedButton
              }`}
            >
              Comentarios · {post.comments}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showTags && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-4 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${theme.pill}`}
                  >
                    <span className="mr-1">{tag.emoji}</span>
                    {tag.label}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isGospelOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <GospelPreview gospel={linkedGospel} theme={theme} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {areCommentsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <CommentsPanel
                theme={theme}
                reflectionId={post.id}
                postAuthorId={post.author.id}
                currentUserId={currentUserId}
                onCommentChange={onCommentChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </article>

      {isProfileOpen && (
        <ProfileModal
          user={post.author}
          currentUserId={currentUserId}
          onFollowChange={onFollowChange}
          theme={theme}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </>
  );
}