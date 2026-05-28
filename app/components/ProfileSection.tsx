import type { DiaryEntry, User } from "../types";

type ProfileSectionProps = {
  user: User;
  diaryEntries: DiaryEntry[];
};

export default function ProfileSection({ user, diaryEntries }: ProfileSectionProps) {
  const ownEntries = diaryEntries.filter((entry) => entry.source === "own");
  const sharedEntries = diaryEntries.filter((entry) => entry.shared);
  const favoriteEntries = diaryEntries.filter((entry) => entry.favorite);
  const communitySavedEntries = diaryEntries.filter(
    (entry) => entry.source === "community"
  );

  return (
    <section className="rounded-3xl border border-[#5f6f52]/35 bg-white/65 p-6 shadow-sm backdrop-blur">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#26351f] text-3xl font-bold text-white">
          {user.name.charAt(0)}
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#4f6740]">
            Perfil
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#26351f]">
            {user.name}
          </h2>

          <p className="mt-1 text-sm font-semibold text-[#4f6740]">
            @{user.username}
          </p>

          {user.bio && (
            <p className="mt-3 max-w-2xl leading-7 text-stone-600">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ProfileStat label="Reflexiones" value={ownEntries.length} />
        <ProfileStat label="Compartidas" value={sharedEntries.length} />
        <ProfileStat label="Favoritas" value={favoriteEntries.length} />
        <ProfileStat label="Guardadas" value={communitySavedEntries.length} />
      </div>
    </section>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-2xl border border-[#5f6f52]/25 bg-[#f4f1e8]/80 p-5 text-center">
      <p className="text-3xl font-bold text-[#26351f]">{value}</p>
      <p className="mt-1 text-sm font-semibold text-[#4f6740]">{label}</p>
    </article>
  );
}