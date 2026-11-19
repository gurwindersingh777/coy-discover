'use client'

import { useState } from "react";
import { Compass, Heart, House } from "lucide-react";
import { Discover } from "@/components/Discover";
import { Matches } from "@/components/Matches";

type Tab = "home" | "discover" | "matches";

const TABS = [
  { id: "home", label: "Home", Icon: House },
  { id: "discover", label: "Discover", Icon: Compass },
  { id: "matches", label: "Matches", Icon: Heart },
] as const;


export default function Page() {
  const [tab, setTab] = useState<Tab>("discover");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white">
      <header className="px-5 py-4 text-3xl font-extrabold tracking-tighter mb-4">
        coy<span className="text-pink-500">.</span>
      </header>

      <main className="flex-1 px-5 pb-28">
        {/* "home" renders nothing on purpose*/}
        {tab === "discover" && <Discover onOpenMatches={() => setTab("matches")} />}
        {tab === "matches" && <Matches onExplore={() => setTab("discover")} />}
      </main>

      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-md border-t-2 border-black bg-white pb-[env(safe-area-inset-bottom)]"
      >
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-current={tab === id ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-bold ${tab === id ? "text-pink-500" : "text-zinc-500"
              }`}
          >
            <Icon size={22} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}