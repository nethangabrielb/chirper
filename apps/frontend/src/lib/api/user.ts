import { EditProfile } from "@/components/edit-profile-dialog";

const userApi = (() => {
  const getUsersChatlist = async () => {
    const res = await fetch(
      `/api/users?chatUsersList=true`,
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

  const getUserSearchResults = async (user: string) => {
    const res = await fetch(
      `/api/users?user=${user}`,
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

  const getUserFollowList = async (pageParam: number) => {
    const res = await fetch(
      `/api/users?list=followList&page=${pageParam}`,
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

  const getUserFollowListLimit = async (limit: number) => {
    const res = await fetch(
      `/api/users?list=followList&limit=${limit}`,
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

  const updateUserData = async (userId: number, userData: FormData) => {
    const res = await fetch(
      `/api/users/${userId}`,
      {
        method: "PUT",
        credentials: "include",
        body: userData,
      },
    );

    if (!res.ok) {
      throw new Error("Error fetching from the server.");
    }

    const data = await res.json();

    return data;
  };

  return {
    getUsersChatlist,
    getUserSearchResults,
    getUserFollowList,
    getUserFollowListLimit,
    updateUserData,
  };
})();

export default userApi;
