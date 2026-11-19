import { NextResponse } from "next/server";
import { getDb } from "@/server/db/connection";
import { withErrorHandling } from "@/server/http";
import { getMatches } from "@/server/services/discover.service";
import { CURRENT_USER_ID } from "@/server/config/config";

export const GET = withErrorHandling(() => {
  const matches = getMatches(getDb(), CURRENT_USER_ID);
  return NextResponse.json({ success: true, count: matches.length, matches });
});