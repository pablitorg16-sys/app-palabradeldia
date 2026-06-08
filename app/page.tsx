"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import AuthModal from "./components/AuthModal";
import AuthRequiredCard from "./components/AuthRequiredCard";
import CommunitySection from "./components/CommunitySection";
import DailyReminderCard from "./components/DailyReminderCard";
import DiarySection from "./components/DiarySection";
import DiaryStats from "./components/DiaryStats";
import EditProfileModal from "./components/EditProfileModal";
import GospelSection from "./components/GospelSection";
import GuidedGuestTour from "./components/GuidedGuestTour";
import Header from "./components/Header";
import InstallAppButton from "./components/InstallAppButton";
import TabsNav from "./components/TabsNav";

import { gospels } from "./data/gospels";

import { useAuth } from "./hooks/useAuth";
import { useCommunityActions } from "./hooks/useCommunityActions";
import { useCommunityPosts } from "./hooks/useCommunityPosts";
import { useDiaryActions } from "./hooks/useDiaryActions";
import { useDiaryEntries } from "./hooks/useDiaryEntries";
import { useReflectionForm } from "./hooks/useReflectionForm";
import { useSaveFeedback } from "./hooks/useSaveFeedback";
import { useTodayGospel } from "./hooks/useTodayGospel";
import { useUserProfile } from "./hooks/useUserProfile";
import { useTheme } from "./context/ThemeContext";

import type { CommunityPost, Tab } from "./types";
import { getThemeClasses } from "./utils/theme";

export default function Home() {
  const { todayGospel, isLoadingGospel } = useTodayGospel();
  const theme = getThemeClasses();

  const [openGospelEntryId, setOpenGospelEntryId] = useState<string | null>(null);

  const { user: authUser, isAuthenticated, signOut } = useAuth();
  const { currentUser, refreshProfile } = useUserProfile(authUser);

  const [activeTab, setActiveTab] = useState<Tab>("evangelio");
  const [authMode, setAuthMode] = useState<"signup" | "login" | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const { diaryEntries, setDiaryEntries, syncMessage } = useDiaryEntries(authUser?.id);

  const {
    communityPosts,
    followingIds,
    isLoadingCommunity,
    isLoadingMore,
    hasMore,
    loadMorePosts,
    refreshCommunityPosts,
  } = useCommunityPosts(isAuthenticated, authUser?.id);

  const { reflection, setReflection, shareReflection, setShareReflection,
    selectedTags, setSelectedTags, resetReflectionForm } = useReflectionForm();

  const { saveReflection, saveCommunityPostToDiary, deleteEntry, toggleShared, toggleFavorite } =
    useDiaryActions({ diaryEntries, setDiaryEntries, userId: authUser?.id, onCommunityChange: refreshCommunityPosts });

  const { toggleLike } = useCommunityActions({ userId: authUser?.id, onAfterChange: refreshCommunityPosts });

  const { saveMessage, showSaveMessage } = useSaveFeedback();

  function handleSaveReflection() {
    saveReflection({
      reflection, shareReflection, selectedTags,
      selectedGospel: todayGospel,
      onAfterSave: () => {
        resetReflectionForm();
        showSaveMessage("Reflexión guardada");
      },
    });
  }

  function toggleGospel(id: string) {
    setOpenGospelEntryId((current) => (current === id ? null : id));
  }

  useEffect(() => {
    function handleOpenReflection(event: Event) {
      const customEvent = event as CustomEvent<{ reflectionId?: string }>;
      const reflectionId = customEvent.detail?.reflectionId;
      if (!reflectionId) return;
      setActiveTab("comunidad");
      window.setTimeout(() => {
        document.getElementById(`reflection-${reflectionId}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 120);
    }

    window.addEventListener("palabradeldia:open-reflection", handleOpenReflection);
    return () => window.removeEventListener("palabradeldia:open-reflection", handleOpenReflection);
  }, []);

  async function handleProfileUpdated() {
    await refreshProfile();
    refreshCommunityPosts();
  }

  async function handleSaveCommunityPostToDiary(post: CommunityPost) {
    await saveCommunityPostToDiary(post);
    showSaveMessage("Reflexión guardada en tu diario");
    refreshCommunityPosts();
  }

  const allGospels = [
    todayGospel,
    ...gospels.filter((g) => g.date !== todayGospel?.date),
  ].filter(Boolean);

  return (
    <main className={`min-h-screen px-4 pb-24 pt-3 sm:px-6 sm:py-8 ${theme.page}`}>
      <section className="mx-auto max-w-4xl">
        <Header
          user={currentUser}
          diaryEntries={diaryEntries}
          isAuthenticated={isAuthenticated}
          onOpenAuth={setAuthMode}
          onOpenProfileSettings={() => setIsEditProfileOpen(true)}
          onSignOut={signOut}
        />

        <TabsNav activeTab={activeTab} onTabChange={setActiveTab} />

        {isLoadingGospel && (
          <div className={`mb-6 rounded-2xl border px-5 py-4 text-sm font-semibold shadow-sm backdrop-blur ${theme.innerCard} ${theme.primaryText}`}>
            Cargando Evangelio del día...
          </div>
        )}

        {saveMessage && (
          <div className="fixed left-1/2 top-24 z-[200] w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2">
            <div className={`rounded-2xl border px-5 py-4 text-center text-sm font-semibold shadow-2xl backdrop-blur ${theme.card} ${theme.primaryText}`}>
              {saveMessage}
            </div>
          </div>
        )}

        {syncMessage && (
          <div className={`mb-6 rounded-2xl border px-5 py-4 text-sm font-semibold shadow-sm backdrop-blur ${theme.innerCard} ${theme.primaryText}`}>
            {syncMessage}
          </div>
        )}

        <div className="space-y-8">
          {activeTab === "evangelio" && (
            <GospelSection
              gospel={todayGospel}
              reflection={reflection}
              shareReflection={shareReflection}
              selectedTags={selectedTags}
              isAuthenticated={isAuthenticated}
              isLoading={!todayGospel}
              onReflectionChange={setReflection}
              onShareChange={setShareReflection}
              onTagsChange={setSelectedTags}
              onSave={handleSaveReflection}
            />
          )}

          {activeTab === "diario" && (
            <motion.div
              key="diario"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <DiarySection
                diaryEntries={diaryEntries}
                gospels={allGospels}
                onDelete={deleteEntry}
                onToggleShared={toggleShared}
                onToggleFavorite={toggleFavorite}
                openGospelEntryId={openGospelEntryId}
                onToggleGospel={toggleGospel}
                onGoToGospel={() => setActiveTab("evangelio")}
                footer={<DiaryStats diaryEntries={diaryEntries} />}
              />
            </motion.div>
          )}

          {activeTab === "comunidad" && (
            isAuthenticated ? (
              isLoadingCommunity ? (
                <div className={`rounded-2xl border px-5 py-4 text-sm font-semibold shadow-sm backdrop-blur ${theme.innerCard} ${theme.primaryText}`}>
                  Cargando comunidad...
                </div>
              ) : (
                <CommunitySection
                  posts={communityPosts}
                  gospels={allGospels}
                  currentUser={currentUser}
                  followingIds={followingIds}
                  onToggleLike={toggleLike}
                  onSaveToDiary={handleSaveCommunityPostToDiary}
                  onFollowChange={refreshCommunityPosts}
                  onCommentChange={refreshCommunityPosts}
                  onGoToGospel={() => setActiveTab("evangelio")}
                  hasMore={hasMore}
                  isLoadingMore={isLoadingMore}
                  onLoadMore={loadMorePosts}
                />
              )
            ) : (
              <AuthRequiredCard onOpenAuth={setAuthMode} />
            )
          )}
        </div>

        <div className="my-10 border-t border-[var(--divider)]" />
        <DailyReminderCard />
        <div className="my-10" />
        <InstallAppButton />
      </section>

      {authMode && (
        <AuthModal
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setAuthMode(null)}
        />
      )}

      {isEditProfileOpen && (
        <EditProfileModal
          user={currentUser}
          onProfileUpdated={handleProfileUpdated}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}

      <GuidedGuestTour
        isAuthenticated={isAuthenticated}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </main>
  );
}