"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import type { CommunityComment } from "../types";

import {
  createComment,
  deleteComment,
  getCommentsForReflection,
} from "../utils/comments";

import { createNotification } from "../utils/notifications";

import FaithAvatar from "./FaithAvatar";

type Theme = {
  mode?: string;
  innerCard: string;
  mutedButton: string;
  input: string;
  accentText: string;
  primaryText: string;
  bodyText: string;
  mutedText: string;
  button: string;
};

type CommentsPanelProps = {
  theme: Theme;
  reflectionId: string | number;
  postAuthorId: string;
  currentUserId?: string;
  onCommentChange?: () => void;
};

export default function CommentsPanel({
  theme,
  reflectionId,
  postAuthorId,
  currentUserId,
  onCommentChange,
}: CommentsPanelProps) {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const loadComments = useCallback(async () => {
    setIsLoading(true);

    const loadedComments = await getCommentsForReflection(reflectionId);

    setComments(loadedComments);
    setIsLoading(false);
  }, [reflectionId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadComments();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadComments]);

  async function handleCreateComment() {
    const cleanText = text.trim();

    if (!currentUserId || !cleanText) return;

    setIsSending(true);

    const { error } = await createComment({
      reflectionId,
      userId: currentUserId,
      text: cleanText,
    });

    setIsSending(false);

    if (error) {
      console.error("Error creating comment:", error.message);
      return;
    }

    await createNotification({
      recipientId: postAuthorId,
      actorId: currentUserId,
      type: "comment",
      reflectionId,
    });

    setText("");
    await loadComments();
    onCommentChange?.();
  }

  async function handleDeleteComment(commentId: string) {
    const { error } = await deleteComment(commentId);

    if (error) {
      console.error("Error deleting comment:", error.message);
      return;
    }

    await loadComments();
    onCommentChange?.();
  }

  return (
    <div
      className={`mt-5 rounded-[1.7rem] border p-4 ${
        theme.mode === "night"
          ? "border-[#d9e2cf]/10 bg-[#151b17]/55"
          : "border-[#d8d1c0] bg-[#fffaf0]/70"
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p
            className={`text-xs font-semibold uppercase tracking-[0.24em] ${theme.accentText}`}
          >
            Conversación
          </p>

          <p className={`mt-1 text-xs ${theme.mutedText}`}>
            {comments.length === 1
              ? "1 comentario"
              : `${comments.length} comentarios`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            theme.mode === "night"
              ? "border-[#d9e2cf]/10 bg-[#d9e2cf]/5 text-[#d9e2cf]/70"
              : "border-[#d8d1c0] bg-white/55 text-[#5f6f52]"
          }`}
        >
          Cargando comentarios...
        </div>
      ) : comments.length === 0 ? (
        <div
          className={`rounded-2xl border p-4 ${
            theme.mode === "night"
              ? "border-[#d9e2cf]/10 bg-[#d9e2cf]/5"
              : "border-[#d8d1c0] bg-white/55"
          }`}
        >
          <p className={`text-sm font-semibold ${theme.primaryText}`}>
            Todavía no hay comentarios
          </p>

          <p className={`mt-1 text-sm leading-6 ${theme.mutedText}`}>
            Puedes abrir la conversación compartiendo una idea breve.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {comments.map((comment) => {
              const isOwnComment = comment.author.id === currentUserId;

              return (
                <motion.article
                  key={comment.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className={`rounded-2xl border px-3.5 py-3 ${
                    theme.mode === "night"
                      ? "border-[#d9e2cf]/10 bg-[#d9e2cf]/5"
                      : "border-[#d8d1c0] bg-white/55"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <FaithAvatar
                      avatarId={comment.author.avatarUrl}
                      fallbackName={comment.author.name}
                      size="sm"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <p
                          className={`truncate text-sm font-bold ${theme.primaryText}`}
                        >
                          {comment.author.name}
                        </p>

                        <p
                          className={`shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.12em] ${theme.mutedText}`}
                        >
                          {comment.time}
                        </p>
                      </div>

                      <p
                        className={`mt-0.5 truncate text-[0.68rem] font-semibold uppercase tracking-[0.12em] ${theme.accentText}`}
                      >
                        @{comment.author.username} · {comment.date}
                      </p>

                      <p
                        className={`mt-2 text-sm leading-6 ${theme.bodyText}`}
                      >
                        {comment.text}
                      </p>
                    </div>

                    {isOwnComment && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold transition ${
                          theme.mode === "night"
                            ? "border-red-300/20 bg-red-300/10 text-red-200 hover:bg-red-300/20"
                            : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        Borrar
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={240}
          placeholder={
            currentUserId
              ? "Escribe un comentario breve..."
              : "Inicia sesión para comentar"
          }
          disabled={!currentUserId || isSending}
          className={`min-w-0 flex-1 rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#9aa58f]/25 disabled:cursor-not-allowed disabled:opacity-60 ${theme.input}`}
        />

        <button
          type="button"
          onClick={handleCreateComment}
          disabled={!text.trim() || isSending || !currentUserId}
          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${theme.button}`}
        >
          {isSending ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}