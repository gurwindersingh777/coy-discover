"use client";

import { useState } from "react";

const TILES = [
  "bg-violet-200",
  "bg-emerald-200",
  "bg-sky-200",
  "bg-orange-200",
  "bg-pink-200",
];

function tileFor(name: string) {
  const sum = Array.from(name).reduce((total, char) => total + char.charCodeAt(0), 0);
  return TILES[sum % TILES.length];
}

interface ProfilePhotoProps {
  src: string;
  name: string;
  className?: string;
}

export function ProfilePhoto({ src, name, className = "" }: ProfilePhotoProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={name}
        className={`flex items-center justify-center font-extrabold text-black/70 ${tileFor(name)} ${className}`}
      >
        {name.charAt(0)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      draggable={false}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}