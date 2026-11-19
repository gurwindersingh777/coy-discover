
"use client";

import { AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";
import { MatchModal } from "@/components/MatchModal";
import { ProfileCard } from "@/components/ProfileCard";
import { useDiscover } from "@/hooks/useDiscover";

interface DiscoverProps {
  onOpenMatches: () => void;
}

export function Discover({ onOpenMatches }: DiscoverProps) {
  const { profiles, currentProfile, nextProfile, error, isSwiping, direction, match, swipe, refreshFeed, closeMatch
  } = useDiscover();

  const showEmpty = profiles !== null && profiles.length === 0 && !error;

  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-5xl font-extrabold tracking-tight"> Discover</h1>

        {profiles !== null && (
          <span className="mb-2 rounded-full bg-zinc-100 px-3 py-1 text-sm font-bold text-zinc-500">
            {profiles.length} left
          </span>
        )}
      </div>

      {error && (
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

      {profiles === null && (
        <div className="mx-auto h-[min(60svh,560px)] min-h-96 w-full max-w-sm animate-pulse rounded-3xl bg-zinc-100" />
      )}

      {profiles !== null && currentProfile && (
        <>
          <div className="relative mx-auto h-[min(60svh,560px)] min-h-96 w-full max-w-sm">
            {nextProfile && (
              <div
                aria-hidden
                className="absolute inset-0 translate-y-3 scale-95 rounded-3xl border-2 border-black/20 bg-violet-100"
              />
            )}

            <AnimatePresence mode="wait" custom={direction}>
              <ProfileCard
                key={currentProfile.id}
                profile={currentProfile}
                onSwipe={swipe}
                disabled={isSwiping}
              />
            </AnimatePresence>
          </div>

          <p className="mt-6 text-center text-xs font-semibold text-zinc-500">
            Swipe right to like · left to pass
          </p>

          <div className="mt-4 flex items-center justify-center gap-8">
            <button
              type="button"
              aria-label="Pass on this profile"
              onClick={() => void swipe("pass")}
              disabled={isSwiping}
              className="btn flex size-16 items-center justify-center bg-white hover:bg-neutral-100 disabled:opacity-50"
            >
              <X size={30} strokeWidth={3} />
            </button>

            <button
              type="button"
              aria-label="Like this profile"
              onClick={() => void swipe("like")}
              disabled={isSwiping}
              className="btn flex size-16 items-center justify-center bg-pink-500 text-white hover:bg-pink-400 disabled:opacity-50"
            >
              <Heart size={28} fill="white" />
            </button>
          </div>
        </>
      )}

      {showEmpty && (
        <div className="rounded-3xl border-2 border-black p-6 shadow-[6px_6px_0_#000]">
          <h2 className="text-3xl font-extrabold tracking-tight">
            You&apos;re all caught up!
          </h2>

          <p className="mt-2 text-zinc-500">
            You&apos;ve seen everyone for now. Check back when more people join.
          </p>

          <button
            type="button"
            onClick={refreshFeed}
            className="btn mt-6 w-full bg-pink-500 px-6 py-3 text-white"
          >
            Refresh feed
          </button>
        </div>
      )}

      <AnimatePresence>
        {match && (
          <MatchModal
            key={match.id}
            profile={match}
            onClose={closeMatch}
            onViewMatches={() => {
              closeMatch();
              onOpenMatches();
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
