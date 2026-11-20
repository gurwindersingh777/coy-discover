"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { ProfilePhoto } from "@/components/ProfilePhoto";
import type { Profile } from "@/types/discover";

interface MatchModalProps {
  profile: Profile;
  onClose: () => void;
  onViewMatches: () => void;
}

export function MatchModal({
  profile,
  onClose,
  onViewMatches,
}: MatchModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-title"
        initial={{ opacity: 0, scale: 0.85, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 22,
        }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border-2 border-black bg-white p-6 text-center shadow-[6px_6px_0_#000]"
      >
        <div className="flex items-center justify-center">
          <div className="flex size-24 items-center justify-center rounded-full border-2 border-black bg-violet-200 text-xl font-extrabold">
            You
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.25,
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
            className="z-10 -mx-4 flex size-10 items-center justify-center rounded-full border-2 border-black bg-pink-500 text-white"
          >
            <Heart size={18} fill="white" />
          </motion.div>

          <ProfilePhoto
            src={profile.photo_url}
            name={profile.name}
            className="size-24 rounded-full border-2 border-black text-3xl"
          />
        </div>

        <h2
          id="match-title"
          className="mt-6 text-4xl font-extrabold tracking-tight"
        >
          It&apos;s a <span className="text-pink-500">match!</span>
        </h2>

        <p className="mt-2 text-zinc-500">
          You and {profile.name} liked each other.
        </p>

        <button
          type="button"
          onClick={onViewMatches}
          autoFocus
          className="btn mt-6 w-full bg-pink-500 px-6 py-3 text-white"
        >
          View matches
        </button>

        <button
          type="button"
          onClick={onClose}
          className="btn mt-3 w-full bg-white px-6 py-3"
        >
          Keep swiping
        </button>
      </motion.div>
    </motion.div>
  );
}