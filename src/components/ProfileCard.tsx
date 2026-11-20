"use client";

import { motion, useMotionValue, useTransform, type Variants } from "framer-motion";
import { MapPin } from "lucide-react";
import { ProfilePhoto } from "@/components/ProfilePhoto";
import type { Profile, SwipeAction, SwipeDirection } from "@/types/discover";

const SWIPE_DISTANCE = 110;
const SWIPE_VELOCITY = 650;

const TAG_COLOURS = [
  "bg-violet-100",
  "bg-emerald-100",
  "bg-sky-100",
  "bg-orange-100",
];

const tagColour = (tag: string) =>
  TAG_COLOURS[
  Array.from(tag).reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  ) % TAG_COLOURS.length
  ];

const variants: Variants = {
  enter: { opacity: 0, scale: 0.95 },
  center: { opacity: 1, scale: 1 },
  exit: (direction: SwipeDirection) => ({
    x: direction === "right" ? 520 : -520,
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

  const rotate = useTransform(x, [-200, 200], [-8, 8]);
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
        if (
          info.offset.x > SWIPE_DISTANCE ||
          info.velocity.x > SWIPE_VELOCITY
        ) {
          onSwipe("like");
        } else if (
          info.offset.x < -SWIPE_DISTANCE ||
          info.velocity.x < -SWIPE_VELOCITY
        ) {
          onSwipe("pass");
        }
      }}
      className="relative inset-0 flex h-120 w-full max-w-120 cursor-grab touch-pan-y select-none flex-col overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[6px_6px_0_#000] active:cursor-grabbing"
    >
      <div className="relative min-h-0 flex-1 border-b-2 border-black">
        <ProfilePhoto
          src={profile.photo_url}
          name={profile.name}
          className="absolute inset-0 h-full w-full text-8xl"
        />

        <motion.div
          style={{ opacity: likeOpacity }}
          className="pointer-events-none absolute left-4 top-6 -rotate-12 rounded-xl border-4 border-green-500 bg-white/85 px-4 py-1 text-3xl font-extrabold text-green-600"
        >
          LIKE
        </motion.div>

        <motion.div
          style={{ opacity: passOpacity }}
          className="pointer-events-none absolute right-4 top-6 rotate-12 rounded-xl border-4 border-pink-500 bg-white/85 px-4 py-1 text-3xl font-extrabold text-pink-600"
        >
          PASS
        </motion.div>
      </div>

      <div className="p-5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-extrabold tracking-tight">{profile.name}</h2>
          <span className="text-2xl font-semibold text-zinc-400">{profile.age}</span>
        </div>

        <p className="mt-1 flex items-center gap-1 text-sm font-bold text-zinc-500">
          <MapPin size={14} />
          {profile.city}
        </p>

        <p className="mt-2 line-clamp-2 text-[15px] leading-snug">{profile.bio}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {profile.interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className={`rounded-full border border-black px-3 py-1 text-xs font-bold ${tagColour(interest)}`}
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}