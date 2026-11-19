import { NextResponse } from "next/server";

export function jsonError(status: number, message: string) {
  return NextResponse.json({ success: false, message }, { status });
}

// Wraps a route handler so an unexpected exception becomes a clean JSON 500. 
export function withErrorHandling<Args extends unknown[]>(
  handler: (...args: Args) => Response | Promise<Response>
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (typeof error === "object" && error !== null && "digest" in error) throw error;
      console.error("API error:", error);
      return jsonError(500, "Something went wrong");
    }
  };
}