"use client";

import { useCallback, useEffect, useState } from "react";
import { getMatches } from "@/services/discoverApi";
import type { Match } from "@/types/discover";

export function useMatches() {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMatches();
      setMatches(data.matches);
    } catch {
      setError("Could not load matches.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchInitialMatches() {
      setLoading(true);
      setError(null);

      try {
        const data = await getMatches();
        if (!ignore) {
          setMatches(data.matches);
        }
      } catch {
        if (!ignore) {
          setError("Could not load matches.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void fetchInitialMatches();

    return () => {
      ignore = true;
    };
  }, []);

  return {
    matches,
    loading,
    error,
    refreshMatches: loadMatches,
  };
}