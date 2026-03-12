import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import isAuthenticated from "@/lib/auth/isAuthenticated";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  if ((await isAuthenticated(request)) === false) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|login|register|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
