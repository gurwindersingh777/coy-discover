
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDiscoverFeed, submitSwipe } from "@/services/discoverApi";
import type { Profile, SwipeAction, SwipeDirection } from "@/types/discover";

export function useDiscover() {
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [direction, setDirection] = useState<SwipeDirection>("right");
  const [match, setMatch] = useState<Profile | null>(null);

  // Prevents two swipe requests from starting at the same time.
  const swipeLock = useRef(false);

  const loadFeed = useCallback(async () => {
    try {
      const data = await getDiscoverFeed();

      setProfiles(data.profiles);
      setError(null);
    } catch {
      setProfiles((previous) => previous ?? []);
      setError("Could not load profiles. Please try again.");
    }
  }, []);

  useEffect(() => {
    void loadFeed();
  }, [loadFeed]);

  const refreshFeed = useCallback(() => {
    setProfiles(null);
    setError(null);
    void loadFeed();
  }, [loadFeed]);

  const swipe = useCallback(
    async (action: SwipeAction) => {
      const currentProfile = profiles?.[0];

      if (!currentProfile || swipeLock.current) return;

      swipeLock.current = true;
      setIsSwiping(true);
      setError(null);
      setDirection(action === "like" ? "right" : "left");

      // Remove the card immediately for a responsive experience.
      setProfiles((previous) =>
        previous
          ? previous.filter((profile) => profile.id !== currentProfile.id)
          : previous
      );

      try {
        const data = await submitSwipe(currentProfile.id, action);

        if (data.matched) {
          setMatch(data.match ?? currentProfile);
        }
      } catch {
        setProfiles((previous) => {
          if (!previous) return [currentProfile];

          const alreadyExists = previous.some(
            (profile) => profile.id === currentProfile.id
          );

          return alreadyExists
            ? previous
            : [currentProfile, ...previous];
        });

        setError("Could not save your swipe. Please try again.");
      } finally {
        swipeLock.current = false;
        setIsSwiping(false);
      }
    },
    [profiles]
  );

  const closeMatch = useCallback(() => {
    setMatch(null);
  }, []);

  return {
    profiles,
    currentProfile: profiles?.[0],
    nextProfile: profiles?.[1],
    error,
    isSwiping,
    direction,
    match,
    swipe,
    refreshFeed,
    closeMatch,
  };
}
