"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { ProfilePhoto } from "@/components/ProfilePhoto";
import type { Match } from "@/types/discover";

interface MatchesProps {
  matches: Match[] | null;
  error: string | null;
  onRetry: () => void;
  onExplore: () => void;
}

function timeAgo(value: string): string {
  const minutes = Math.floor(
    (Date.now() -
      new Date(`${value.replace(" ", "T")}Z`).getTime()) /
      60_000
  );

  if (Number.isNaN(minutes) || minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} h ago`;

  return `${Math.floor(hours / 24)} d ago`;
}

export function Matches({
  matches,
  error,
  onRetry,
  onExplore,
}: MatchesProps) {
  return (
    <section>
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-pink-100 p-4 text-sm font-semibold"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={onRetry}
            className="font-extrabold underline"
          >
            Retry
          </button>
        </div>
      )}

      {matches === null && !error && (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="h-24 animate-pulse rounded-2xl border-2 border-black/10 bg-white"
            />
          ))}
        </div>
      )}

      {matches !== null && matches.length > 0 && (
        <ul className="space-y-4">
          {matches.map((match, index) => (
            <motion.li
              key={match.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="flex items-center gap-4 rounded-2xl border-2 border-black bg-white p-3 shadow-[4px_4px_0_#000]"
            >
              <ProfilePhoto
                src={match.photo_url}
                name={match.name}
                className="size-16 shrink-0 rounded-full border-2 border-black text-2xl"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-extrabold">
                  {match.name}, {match.age}
                </p>

                <p className="flex items-center gap-1 text-sm font-bold text-zinc-500">
                  <MapPin size={13} />
                  {match.city}
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-black bg-emerald-100 px-3 py-1 text-xs font-bold">
                {timeAgo(match.matched_at)}
              </span>
            </motion.li>
          ))}
        </ul>
      )}

      {matches !== null && matches.length === 0 && !error && (
        <div className="rounded-3xl border-2 border-black bg-white p-6 shadow-[6px_6px_0_#000]">
          <h2 className="text-3xl font-extrabold tracking-tight">
            No matches yet
          </h2>

          <p className="mt-2 text-zinc-500">
            When you and someone else like each other, they show up here.
            Nobody sees who liked them until it&apos;s mutual.
          </p>

          <button
            type="button"
            onClick={onExplore}
            className="btn mt-6 w-full bg-pink-500 px-6 py-3 text-white"
          >
            Start swiping
          </button>
        </div>
      )}
    </section>
  );
}