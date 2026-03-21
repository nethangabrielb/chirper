import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return new NextResponse(
      `<script>window.opener.postMessage({ success: false }, '*'); window.close();</script>`,
      { headers: { "Content-Type": "text/html" } },
    );
  }

  // Set cookie on a redirect to a dedicated page that handles postMessage
  const response = NextResponse.redirect(new URL("/auth/success", req.url));

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return response;
}
