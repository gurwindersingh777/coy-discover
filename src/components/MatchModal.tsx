"use client";

import { motion } from "framer-motion";
import type { Profile } from "@/types/discover";

interface MatchModalProps {
  profile: Profile;
  onClose: () => void;
  onViewMatches: () => void;
}

export function MatchModal({ profile, onClose, onViewMatches }: MatchModalProps) {
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
        aria-label="It's a match"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border-2 border-black bg-white p-6 text-center shadow-[6px_6px_0_#000]"
      >
        <h2 className="text-4xl font-extrabold tracking-tight">
          It&apos;s a <span className="text-pink-500">match!</span>
        </h2>
        <p className="mt-2 text-zinc-500">You and {profile.name} liked each other.</p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.photo_url}
          alt={profile.name}
          className="mx-auto mt-5 size-28 rounded-full border-2 border-black object-cover"
        />
        <p className="mt-3 text-lg font-extrabold">{profile.name}</p>

        <button type="button" onClick={onViewMatches} className="btn mt-6 w-full bg-pink-500 px-6 py-3 text-white">
          See your matches
        </button>

        <button type="button" onClick={onClose} className="mt-4 text-sm font-bold underline">
          Keep swiping
        </button>
      </motion.div>
    </motion.div>
  );
}