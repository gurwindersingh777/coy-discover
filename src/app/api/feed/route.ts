import { connection, NextResponse } from "next/server";
import { getDb } from "@/server/db/connection";
import { withErrorHandling } from "@/server/http";
import { getFeed } from "@/server/services/discover.service";
import { CURRENT_USER_ID } from "@/server/config/config";

export const GET = withErrorHandling(async () => {
  await connection();
  const profiles = getFeed(getDb(), CURRENT_USER_ID);
  return NextResponse.json({ success: true, count: profiles.length, profiles });
});