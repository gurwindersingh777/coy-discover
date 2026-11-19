import type { FeedResponse, MatchesResponse, SwipeAction, SwipeResponse } from "@/types/discover";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data && typeof data.message === "string"
        ? data.message
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data as T;
}

export const getFeed = () => request<FeedResponse>("/api/feed");

export const getMatches = () => request<MatchesResponse>("/api/matches");

export const submitSwipe = (profileId: string, action: SwipeAction) =>
  request<SwipeResponse>("/api/swipe", {
    method: "POST",
    body: JSON.stringify({ profileId, action }),
  });