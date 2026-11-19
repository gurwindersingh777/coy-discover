import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/server/db/connection";
import { CURRENT_USER_ID } from "@/server/constants";
import { jsonError, withErrorHandling } from "@/server/http";
import { swipe } from "@/server/services/discover.service";

const swipeSchema = z.object({
  profileId: z.string().min(1, "Profile ID is required"),
  action: z.enum(["like", "pass"]),
});

export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json().catch(() => null);
  const parsed = swipeSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError(400, parsed.error.issues[0]?.message ?? "Invalid swipe data");
  }

  const { profileId, action } = parsed.data;
  const result = swipe(getDb(), CURRENT_USER_ID, profileId, action);

  if (result.status === "profile_not_found") {
    return jsonError(404, "Profile not found");
  }

  return NextResponse.json(
    {
      success: true,
      matched: result.match !== null,
      alreadySwiped: result.status === "already_swiped",
      ...(result.match ? { match: result.match } : {}),
    },
    { status: result.status === "created" ? 201 : 200 }
  );
});