const userApi = (() => {
  const getUsersChatlist = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/users?chatUsersList=true`,
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
      `${process.env.NEXT_PUBLIC_API}/api/users?user=${user}`,
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

  return { getUsersChatlist, getUserSearchResults };
})();

export default userApi;
