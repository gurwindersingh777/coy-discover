
"use client";

import { useMatches } from "@/hooks/useMatches";

interface MatchesProps {
  onExplore: () => void;
}

export function Matches({ onExplore }: MatchesProps) {
  const { matches, loading, error, refreshMatches } = useMatches();

  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Matches
        </h1>

        {matches !== null && (
          <span className="mb-2 rounded-full bg-zinc-100 px-3 py-1 text-sm font-bold text-zinc-500">
            {matches.length}
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
            onClick={() => void refreshMatches()}
            className="font-extrabold underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading && (
        <p className="py-16 text-center font-semibold text-zinc-500">
          Loading…
        </p>
      )}

      {!loading && matches && matches.length > 0 && (
        <ul className="space-y-3">
          {matches.map((match) => (
            <li
              key={match.id}
              className="flex items-center gap-4 rounded-3xl bg-pink-100 p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={match.photo_url}
                alt={match.name}
                className="size-16 shrink-0 rounded-full border-2 border-black object-cover"
              />

              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold">
                  {match.name}, {match.age}
                </p>

                <p className="text-sm font-semibold text-zinc-500">
                  Matched · {match.city}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && matches?.length === 0 && !error && (
        <div className="rounded-3xl border-2 border-black p-6 shadow-[6px_6px_0_#000]">
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
