
import type { FeedResponse, MatchesResponse, SwipeAction, SwipeResponse } from "@/types/discover";

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...options?.headers }
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data && typeof data === "object" && "message" in data &&
      typeof data.message === "string" ? data.message : `Request failed: ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

export function getDiscoverFeed(): Promise<FeedResponse> {
  return apiRequest<FeedResponse>("/api/feed");
}

export function getMatches(): Promise<MatchesResponse> {
  return apiRequest<MatchesResponse>("/api/matches");
}

export function submitSwipe(profileId: string, action: SwipeAction): Promise<SwipeResponse> {
  return apiRequest<SwipeResponse>("/api/swipe", {
    method: "POST",
    body: JSON.stringify({ profileId, action })
  });
}

