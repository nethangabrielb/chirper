import type { NextRequest } from "next/server";

const isAuthenticated = async (request: NextRequest) => {
  const cookie = request.cookies.get("token");
  const value = cookie?.value;

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
