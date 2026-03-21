import { NextRequest, NextResponse } from "next/server";

import isAuthenticated from "@/lib/auth/isAuthenticated";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  const userAuthenticated = await isAuthenticated(request);

  if (userAuthenticated.authorized === false) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (userAuthenticated.authorized && userAuthenticated.isGuest) {
    if (
      pathname === "/home" ||
      pathname.includes("/post") ||
      pathname.includes("/profile")
    ) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  } else {
    return NextResponse.next();
  }
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|login|register|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
