import type { NextRequest } from "next/server";

const isAuthenticated = async (request: NextRequest) => {
  const cookie = request.cookies.get("token");
  const value = cookie?.value;

  console.log(cookie);
  console.log(value);

  if (!cookie || !value) {
    return false;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${value}`,
    },
  });

  const data = await res.json();
  return data.authorized;
};

export default isAuthenticated;
