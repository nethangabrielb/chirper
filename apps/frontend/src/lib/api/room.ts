import { User } from "@/types/user";

const roomApi = (() => {
  const getByUserId = async (userId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/rooms/user/${userId}`,
      {
        credentials: "include",
      },
    );

    if (!res.ok) {
      throw new Error("Error fetching from the server.");
    }
    const data = await res.json();
    return data.data;
  };

  const createChatRoom = async (currentUser: User, visitedUser: User) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/rooms`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ users: [currentUser, visitedUser] }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Error processing the request.");
    }
    const data = await res.json();
    return data;
  };

  return { getByUserId, createChatRoom };
})();

export default roomApi;
