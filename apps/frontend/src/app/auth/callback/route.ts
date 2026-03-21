import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  console.log("Token received:", !!token); // ← add this
  console.log("Redirecting to:", new URL("/onboarding", req.url).toString()); // ← and this

  if (!token) {
    return new NextResponse(
      `<script>window.opener.postMessage({ success: false }, '*'); window.close();</script>`,
      { headers: { "Content-Type": "text/html" } },
    );
  }

  const response = new NextResponse(
    `<script>window.opener.postMessage({ success: true }, '*'); window.close();</script>`,
    { headers: { "Content-Type": "text/html" } },
  );

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return response;
}
