export interface Profile {
  id: string;
  name: string;
  age: number;
  photo_url: string;
  bio: string;
  city: string;
  interests: string[];
}

export interface Match extends Profile {
  matched_at: string;
}

export type SwipeAction = "like" | "pass";
export type SwipeDirection = "left" | "right";

export interface FeedResponse {
  success: boolean;
  count: number;
  profiles: Profile[];
}

export interface SwipeResponse {
  success: boolean;
  matched: boolean;
  alreadySwiped?: boolean;
  match?: Profile;
}

export interface MatchesResponse {
  success: boolean;
  count: number;
  matches: Match[];
}