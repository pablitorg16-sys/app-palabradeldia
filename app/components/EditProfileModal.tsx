"use client";

import { useState } from "react";
import type { User } from "../types";
import { faithAvatars } from "../data/faithAvatars";
import FaithAvatar from "./FaithAvatar";
import {
  updateUserProfile,
  usernameExistsForAnotherUser,
} from "../utils/profileSettings";
import type { ThemePreference } from "../hooks/useDayPeriod";

type EditProfileTheme = {
  mode?: string;
  card: string;
  innerCard: string;
  input: string;
  mutedButton: string;
  accentText: string;
  primaryText: string;
  bodyText: string;
  mutedText: string;
  button: string;
};

type EditProfileModalProps = {
  user: User;
  theme: EditProfileTheme;
  themePreference: ThemePreference;
  onThemePreferenceChange: (preference: ThemePreference) => void;
  onClose: () => void;
  onProfileUpdated: () => void;
};

export default function EditProfileModal({
  user,
  theme,
  themePreference,
  onThemePreferenceChange,
  onClose,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? "cross");

  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function normalizeUsername(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9._]/g, "");
  }

  async function handleSave() {
    setMessage("");

    const cleanName = name.trim();
    const cleanUsername = normalizeUsername(username);

    if (!cleanName || !cleanUsername) {
      setMessage("Nombre y usuario son obligatorios.");
      return;
    }

    if (cleanUsername.length < 3) {
      setMessage("El usuario debe tener al menos 3 caracteres.");
      return;
    }

    setIsSaving(true);

    const { exists, error: usernameError } = await usernameExistsForAnotherUser({
      username: cleanUsername,
      currentUserId: user.id,
    });

    if (usernameError) {
      setMessage(usernameError.message);
      setIsSaving(false);
      return;
    }

    if (exists) {
      setMessage("Ese usuario ya está en uso.");
      setIsSaving(false);
      return;
    }

    const { error } = await updateUserProfile({
      id: user.id,
      name: cleanName,
      username: cleanUsername,
      bio: bio.trim(),
      avatarUrl,
    });

    setIsSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    await onProfileUpdated();
    onClose();
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[160] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <section
        onClick={(event) => event.stopPropagation()}
        className={`max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border p-6 shadow-2xl ${theme.card}`}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className={`mb-2 text-sm font-semibold uppercase tracking-[0.25em] ${theme.accentText}`}>
              Perfil
            </p>

            <h2 className={`text-2xl font-bold ${theme.primaryText}`}>
              Editar perfil
            </h2>
          </div>

          <button
            onClick={onClose}
            className={`rounded-full px-3 py-1 text-sm font-bold ${theme.mutedButton}`}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`mb-2 block text-sm font-semibold ${theme.accentText}`}>
              Nombre visible
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#9aa58f]/25 ${theme.input}`}
              placeholder="Pablo"
            />
          </div>

          <div>
            <label className={`mb-2 block text-sm font-semibold ${theme.accentText}`}>
              Usuario
            </label>

            <input
              value={username}
              onChange={(event) =>
                setUsername(normalizeUsername(event.target.value))
              }
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#9aa58f]/25 ${theme.input}`}
              placeholder="pablorgalvan"
            />

            <p className={`mt-2 text-xs ${theme.mutedText}`}>
              Solo letras, números, punto y guion bajo. Debe ser único.
            </p>
          </div>

          <div>
            <label className={`mb-2 block text-sm font-semibold ${theme.accentText}`}>
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              maxLength={160}
              className={`h-28 w-full resize-none rounded-xl border px-4 py-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-[#9aa58f]/25 ${theme.input}`}
              placeholder="Una breve frase sobre ti..."
            />

            <p className={`mt-2 text-xs ${theme.mutedText}`}>{bio.length}/160</p>
          </div>

          <div>
            <label className={`mb-3 block text-sm font-semibold ${theme.accentText}`}>
              Avatar
            </label>

            <div className="grid grid-cols-4 gap-3">
              {faithAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setAvatarUrl(avatar.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-xs font-semibold transition ${
                    avatarUrl === avatar.id
                      ? theme.mode === "night"
                        ? "border-[#d9e2cf]/55 bg-[#d9e2cf] text-[#202822]"
                        : "border-[#26351f] bg-[#dfe6d2] text-[#26351f]"
                      : theme.mutedButton
                  }`}
                >
                  <FaithAvatar
                    avatarId={avatar.id}
                    fallbackName={avatar.label}
                    size="md"
                  />

                  {avatar.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={`mb-3 block text-sm font-semibold ${theme.accentText}`}>
              Tema de la app
            </label>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {[
                { id: "auto", label: "Auto" },
                { id: "sunrise", label: "Amanecer" },
                { id: "day", label: "Día" },
                { id: "sunset", label: "Atardecer" },
                { id: "night", label: "Noche" },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    onThemePreferenceChange(option.id as ThemePreference)
                  }
                  className={`rounded-2xl border px-3 py-3 text-xs font-semibold transition ${
                    themePreference === option.id
                      ? theme.mode === "night"
                        ? "border-[#d9e2cf]/60 bg-[#d9e2cf] text-[#202822]"
                        : "border-[#26351f] bg-[#dfe6d2] text-[#26351f]"
                      : theme.mutedButton
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {message && (
            <p className={`rounded-xl p-3 text-sm ${theme.innerCard} ${theme.primaryText}`}>
              {message}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${theme.button}`}
          >
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </section>
    </div>
  );
}