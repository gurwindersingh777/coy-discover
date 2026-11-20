"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import { Compass, House } from "lucide-react";
import { Discover } from "@/components/Discover";

type Tab = "home" | "discover";

const TABS = [
  { id: "home", label: "Home", Icon: House },
  { id: "discover", label: "Discover", Icon: Compass },
] as const;

export default function Page() {
  const [tab, setTab] = useState<Tab>("discover");

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col ">
        <header className="px-5 py-4 text-3xl font-extrabold tracking-tighter">
          coy<span className="text-pink-500">.</span>
        </header>

        <main className="flex-1 px-5 pb-28">
          {tab === "discover" && <Discover />}
        </main>

        <nav
          aria-label="Main navigation"
          className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-lg border-t-2 border-black bg-white pb-[env(safe-area-inset-bottom)]"
        >
          {TABS.map(({ id, label, Icon }) => {
            const active = tab === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-current={active ? "page" : undefined}
                className="flex flex-1 flex-col items-center gap-1 py-2 text-xs font-bold"
              >
                <span
                  className={`flex h-9 w-14 items-center justify-center rounded-full border-2 transition-colors ${
                    active
                      ? "border-black bg-pink-500 text-white shadow-[2px_2px_0_#000]"
                      : "border-transparent text-zinc-500"
                  }`}
                >
                  <Icon size={20} strokeWidth={2.4} />
                </span>

                <span className={active ? "text-black" : "text-zinc-500"}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </MotionConfig>
  );
}