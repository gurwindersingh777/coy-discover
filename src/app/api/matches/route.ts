import { connection, NextResponse } from "next/server";
import { getDb } from "@/server/db/connection";
import { CURRENT_USER_ID } from "@/server/constants";
import { withErrorHandling } from "@/server/http";
import { getMatches } from "@/server/services/discover.service";

export const GET = withErrorHandling(async () => {
  await connection();
  const matches = getMatches(getDb(), CURRENT_USER_ID);
  return NextResponse.json({ success: true, count: matches.length, matches });
});