"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Lock, Sparkles, X } from "lucide-react";
import { MatchModal } from "@/components/MatchModal";
import { Matches } from "@/components/Matches";
import { ProfileCard } from "@/components/ProfileCard";
import { useDiscover } from "@/hooks/useDiscover";
import { useMatches } from "@/hooks/useMatches";

type View = "swipe" | "matches";

const switchClass = (active: boolean) =>
  `flex items-center rounded-full px-4 py-1.5 text-sm font-extrabold transition-colors ${active
    ? "bg-black text-white"
    : "text-zinc-500 hover:text-black"
  }`;

export function Discover() {
  const [view, setView] = useState<View>("swipe");

  const { profiles, currentProfile, error, isSwiping, direction, match, swipe, refreshFeed, closeMatch } = useDiscover();

  const { matches, error: matchesError, refreshMatches } = useMatches();

  useEffect(() => {
    if (match) {
      void refreshMatches();
    }
  }, [match, refreshMatches]);

  useEffect(() => {
    if (view !== "swipe" || match) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        void swipe("like");
      }

      if (event.key === "ArrowLeft") {
        void swipe("pass");
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [view, match, swipe]);

  const showDeck = profiles !== null && (currentProfile !== undefined || isSwiping);

  const showEmpty = profiles !== null && !currentProfile && !isSwiping && !error;

  const matchCount = matches?.length ?? 0;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-4xl font-extrabold tracking-tight">Discover</h1>

        <div className="flex rounded-full border-2 border-black bg-white p-1">
          <button
            type="button"
            aria-pressed={view === "swipe"}
            onClick={() => setView("swipe")}
            className={switchClass(view === "swipe")}
          >
            Swipe
          </button>

          <button
            type="button"
            aria-pressed={view === "matches"}
            onClick={() => setView("matches")}
            className={switchClass(view === "matches")}
          >
            Matches

            {matchCount > 0 && (
              <motion.span
                key={matchCount}
                initial={{ scale: 1.7 }}
                animate={{ scale: 1 }}
                className="ml-2 inline-flex size-5 items-center justify-center rounded-full bg-pink-500 text-xs font-extrabold text-white"
              >
                {matchCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      <p className="mb-5 inline-flex -rotate-1 items-center gap-2 rounded-xl border-2 border-black bg-orange-200 px-3 py-1.5 text-sm font-extrabold shadow-[3px_3px_0_#000]">
        <Lock size={14} />
        Nobody sees your likes unless it&apos;s mutual
      </p>

      {error && view === "swipe" && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-pink-100 p-4 text-sm font-semibold"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={refreshFeed}
            className="font-extrabold underline"
          >
            Retry
          </button>
        </div>
      )}

      {view === "swipe" && (
        <>
          {profiles === null && (
            <div
              aria-busy="true"
              className="mx-auto h-[min(64svh,600px)] min-h-112 w-full max-w-sm animate-pulse rounded-3xl border-2 border-black/10 bg-white"
            />
          )}

          {showDeck && (
            <>
              <div className="relative mx-auto h-120 w-full max-w-100">
                <AnimatePresence mode="wait" custom={direction}>
                  {currentProfile && (
                    <ProfileCard
                      key={currentProfile.id}
                      profile={currentProfile}
                      onSwipe={swipe}
                      disabled={isSwiping}
                    />
                  )}
                </AnimatePresence>
              </div>

              <p className="mt-5 text-center text-xs font-semibold text-zinc-500">
                Swipe right to like • left to pass
              </p>

              <div className="mt-6 flex items-start justify-center gap-10">
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    aria-label="Pass on this profile"
                    onClick={() => void swipe("pass")}
                    disabled={isSwiping || !currentProfile}
                    className="btn flex size-16 items-center justify-center bg-white disabled:opacity-50"
                  >
                    <X size={30} strokeWidth={3} />
                  </button>

                  <span className="text-xs font-bold text-zinc-500">Pass</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    aria-label="Like this profile"
                    onClick={() => void swipe("like")}
                    disabled={isSwiping || !currentProfile}
                    className="btn flex size-16 items-center justify-center bg-pink-500 text-white disabled:opacity-50"
                  >
                    <Heart size={28} fill="white" />
                  </button>

                  <span className="text-xs font-bold text-zinc-500">Like</span>
                </div>
              </div>


            </>
          )}

          {showEmpty && (
            <div className="rounded-3xl border-2 border-black bg-white p-6 text-center shadow-[6px_6px_0_#000]">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full border-2 border-black bg-violet-200 shadow-[3px_3px_0_#000]">
                <Sparkles size={34} />
              </div>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight">
                You&apos;ve seen everyone for now
              </h2>

              <p className="mt-2 text-zinc-500">
                Anyone you liked stays private unless they liked you back.
              </p>

              <button
                type="button"
                onClick={() => setView("matches")}
                className="btn mt-6 w-full bg-pink-500 px-6 py-3 text-white"
              >
                See your matches
              </button>

              <button
                type="button"
                onClick={() => void refreshFeed()}
                className="mt-4 text-sm font-bold text-zinc-500 underline"
              >
                Refresh feed
              </button>
            </div>
          )}
        </>
      )}

      {view === "matches" && (
        <Matches
          matches={matches}
          error={matchesError}
          onRetry={() => void refreshMatches()}
          onExplore={() => setView("swipe")}
        />
      )}

      <AnimatePresence>
        {match && (
          <MatchModal
            key={match.id}
            profile={match}
            onClose={closeMatch}
            onViewMatches={() => {
              closeMatch();
              setView("matches");
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}