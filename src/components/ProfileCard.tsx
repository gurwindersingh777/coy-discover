"use client";

import { motion, useMotionValue, useTransform, type Variants } from "framer-motion";
import type { Profile, SwipeAction, SwipeDirection } from "@/types/discover";

const variants: Variants = {
  enter: { opacity: 0, scale: 0.95 },
  center: { opacity: 1, scale: 1 },
  exit: (direction: SwipeDirection) => ({
    x: direction === "right" ? 500 : -500,
    opacity: 0,
    transition: { duration: 0.25 },
  }),
};

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (action: SwipeAction) => void;
  disabled: boolean;
}

export function ProfileCard({ profile, onSwipe, disabled }: ProfileCardProps) {
  const x = useMotionValue(0);

  // The tilt and the LIKE / PASS stamps follow the finger.
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const passOpacity = useTransform(x, [-120, -20], [1, 0]);

  return (
    <motion.article
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      style={{ x, rotate }}
      drag={disabled ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (info.offset.x > 110) onSwipe("like");
        else if (info.offset.x < -110) onSwipe("pass");
      }}
      className="absolute inset-0 cursor-grab touch-pan-y select-none overflow-hidden rounded-3xl border-2 border-black bg-zinc-200 shadow-[6px_6px_0_#000] active:cursor-grabbing"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profile.photo_url}
        alt={`${profile.name}'s photo`}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

      <motion.div
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute left-5 top-8 -rotate-12 rounded-xl border-4 border-green-500 bg-white/80 px-4 py-1 text-3xl font-extrabold text-green-500"
      >
        LIKE
      </motion.div>

      <motion.div
        style={{ opacity: passOpacity }}
        className="pointer-events-none absolute right-5 top-8 rotate-12 rounded-xl border-4 border-pink-500 bg-white/80 px-4 py-1 text-3xl font-extrabold text-pink-500"
      >
        PASS
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <h2 className="text-4xl font-extrabold leading-none tracking-tight">
          {profile.name} <span className="text-2xl font-semibold">{profile.age}</span>
        </h2>
        <p className="mt-2 text-sm font-semibold text-white/85">{profile.city}</p>
        <p className="mt-2 line-clamp-3 text-sm text-white/90">{profile.bio}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {profile.interests.slice(0, 4).map((interest) => (
            <span key={interest} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}