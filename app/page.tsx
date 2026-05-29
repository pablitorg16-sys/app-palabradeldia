"use client";

import { useEffect, useState } from "react";
import type { ThemePreference } from "./hooks/useDayPeriod";
import Header from "./components/Header";
import { AnimatePresence, motion } from "framer-motion";
import TabsNav from "./components/TabsNav";
import GospelSection from "./components/GospelSection";
import DiarySection from "./components/DiarySection";
import CommunitySection from "./components/CommunitySection";
import DiaryStats from "./components/DiaryStats";
import GuestDiaryNotice from "./components/GuestDiaryNotice";
import AuthRequiredCard from "./components/AuthRequiredCard";
import AuthModal from "./components/AuthModal";
import EditProfileModal from "./components/EditProfileModal";
import InstallAppButton from "./components/InstallAppButton";
import { gospels } from "./data/gospels";
import type { CommunityPost, Tab } from "./types";
import GuidedGuestTour from "./components/GuidedGuestTour";
import { useDiaryEntries } from "./hooks/useDiaryEntries";
import { useReflectionForm } from "./hooks/useReflectionForm";
import { useDiaryActions } from "./hooks/useDiaryActions";
import { useCommunityActions } from "./hooks/useCommunityActions";
import { useCommunityPosts } from "./hooks/useCommunityPosts";
import { useAuth } from "./hooks/useAuth";
import { useDayPeriod } from "./hooks/useDayPeriod";
import { useSaveFeedback } from "./hooks/useSaveFeedback";
import { useUserProfile } from "./hooks/useUserProfile";
import { useTodayGospel } from "./hooks/useTodayGospel";

import { getThemeClasses } from "./utils/theme";
import DailyReminderCard from "./components/DailyReminderCard";

export default function Home() {
  const { todayGospel, isLoadingGospel } = useTodayGospel();
  const [openGospelEntryId, setOpenGospelEntryId] = useState<
  number | string | null
  >(null);
  const { user: authUser, isAuthenticated, signOut } = useAuth();
  const { currentUser, refreshProfile } = useUserProfile(authUser);

  const [themePreference, setThemePreference] =
  useState<ThemePreference>("auto");

  useEffect(() => {
  const savedPreference = localStorage.getItem(
    "palabradeldia_theme_preference"
    ) as ThemePreference | null;

    if (
      savedPreference === "auto" ||
      savedPreference === "sunrise" ||
      savedPreference === "day" ||
      savedPreference === "sunset" ||
      savedPreference === "night"
    ) {
      setThemePreference(savedPreference);
    }
  }, []);

function handleThemePreferenceChange(nextPreference: ThemePreference) {
  localStorage.setItem("palabradeldia_theme_preference", nextPreference);

  setThemePreference((currentPreference) => {
    if (currentPreference === nextPreference) {
      return nextPreference;
    }

    return nextPreference;
  });
}

const dayPeriod = useDayPeriod(themePreference);
const theme = getThemeClasses(dayPeriod);

  const [activeTab, setActiveTab] = useState<Tab>("evangelio");
  const [authMode, setAuthMode] = useState<"signup" | "login" | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const {
    diaryEntries,
    setDiaryEntries,
    isLoadingDiary,
    syncMessage,
  } = useDiaryEntries(authUser?.id);

  const {
    communityPosts,
    followingIds,
    isLoadingCommunity,
    refreshCommunityPosts,
  } = useCommunityPosts(isAuthenticated, authUser?.id);

  const {
    reflection,
    setReflection,
    shareReflection,
    setShareReflection,
    selectedTags,
    setSelectedTags,
    resetReflectionForm,
  } = useReflectionForm();

  const {
    saveReflection,
    saveCommunityPostToDiary,
    deleteEntry,
    toggleShared,
    toggleFavorite,
  } = useDiaryActions({
    diaryEntries,
    setDiaryEntries,
    userId: authUser?.id,
    onCommunityChange: refreshCommunityPosts,
  });

  const { toggleLike } = useCommunityActions({
    userId: authUser?.id,
    onAfterChange: refreshCommunityPosts,
  });

  const { saveMessage, showSaveMessage } = useSaveFeedback();

  function handleSaveReflection() {
    saveReflection({
      reflection,
      shareReflection,
      selectedTags,
      selectedGospel: todayGospel,
      onAfterSave: () => {
        resetReflectionForm();
        showSaveMessage("Reflexión guardada");
      },
    });
  }

  function toggleGospel(id: number | string) {
    setOpenGospelEntryId((currentId) =>
    currentId === id ? null : id
    );
  }


  useEffect(() => {
    function handleOpenReflection(event: Event) {
      const customEvent = event as CustomEvent<{ reflectionId?: string }>;
      const reflectionId = customEvent.detail?.reflectionId;

      if (!reflectionId) return;

      setActiveTab("comunidad");

      window.setTimeout(() => {
        const target = document.getElementById(`reflection-${reflectionId}`);
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 120);
    }

    window.addEventListener("palabradeldia:open-reflection", handleOpenReflection);

    return () => {
      window.removeEventListener("palabradeldia:open-reflection", handleOpenReflection);
    };
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

  return (
    <main
      className={`min-h-screen px-4 pb-24 pt-3 transition-colors duration-700 sm:px-6 sm:py-8 ${theme.page}`}
    >
      <section className="mx-auto max-w-4xl">
        <Header
          user={currentUser}
          theme={theme}
          diaryEntries={diaryEntries}
          isAuthenticated={isAuthenticated}
          onOpenAuth={setAuthMode}
          onOpenProfileSettings={() => setIsEditProfileOpen(true)}
          onSignOut={signOut}
        />


        <TabsNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          theme={theme}
        />

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
              theme={theme}
              reflection={reflection}
              shareReflection={shareReflection}
              selectedTags={selectedTags}
              isAuthenticated={isAuthenticated}
              onReflectionChange={setReflection}
              onShareChange={setShareReflection}
              onTagsChange={setSelectedTags}
              onSave={handleSaveReflection}
              isLoading={!todayGospel}
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
            gospels={[
              todayGospel,
              ...gospels.filter((g) => g.date !== todayGospel?.date),
            ].filter(Boolean)}
            theme={theme}
            onDelete={deleteEntry}
            onToggleShared={toggleShared}
            onToggleFavorite={toggleFavorite}
            openGospelEntryId={openGospelEntryId}
            onToggleGospel={toggleGospel}
            onGoToGospel={() => setActiveTab("evangelio")}
            footer={<DiaryStats diaryEntries={diaryEntries} theme={theme} />}
          />
          </motion.div>
          )}

          {activeTab === "comunidad" &&
            (isAuthenticated ? (
              isLoadingCommunity ? (
                <div className={`rounded-2xl border px-5 py-4 text-sm font-semibold shadow-sm backdrop-blur ${theme.innerCard} ${theme.primaryText}`}>
                  Cargando comunidad...
                </div>
              ) : (
                <CommunitySection
                  posts={communityPosts}
                  gospels={[todayGospel, ...gospels.filter(g => g.date !== todayGospel?.date)]}
                  currentUser={currentUser}
                  followingIds={followingIds}
                  theme={theme}
                  onToggleLike={toggleLike}
                  onSaveToDiary={handleSaveCommunityPostToDiary}
                  onFollowChange={refreshCommunityPosts}
                  onCommentChange={refreshCommunityPosts}
                />
              )
            ) : (
              <AuthRequiredCard onOpenAuth={setAuthMode} theme={theme} />
            ))}
        </div>
        <div className="my-10 border-t border-[#5f6f52]/25" />
        <DailyReminderCard theme={theme}/>
        <div className="my-10" />
        <InstallAppButton theme={theme}/>
      </section>

      {authMode && (
        <AuthModal
          mode={authMode}
          theme={theme}
          onModeChange={setAuthMode}
          onClose={() => setAuthMode(null)}
        />
      )}

      {isEditProfileOpen && (
        <EditProfileModal
        user={currentUser}
        theme={theme}
        themePreference={themePreference}
        onThemePreferenceChange={handleThemePreferenceChange}
        onProfileUpdated={handleProfileUpdated}
        onClose={() => setIsEditProfileOpen(false)}
        />
      )}
      <GuidedGuestTour
      isAuthenticated={isAuthenticated}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      theme={theme}
      />
    </main>
  );
}