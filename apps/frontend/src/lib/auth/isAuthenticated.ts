import type { NextRequest } from "next/server";

const isAuthenticated = async (request: NextRequest) => {
  const cookie = request.cookies.get("token");
  const value = cookie?.value;

  console.log("origin:", request.nextUrl.origin);
  console.log("BACKEND_URL:", process.env.BACKEND_URL);
  console.log("cookie:", !!cookie);

  if (!cookie || !value) {
    return { authorized: false };
  }

  const res = await fetch(`${process.env.BACKEND_URL}/api/auth/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${value}`,
    },
  });

  const data = await res.json();

  return data;
};

export default isAuthenticated;
