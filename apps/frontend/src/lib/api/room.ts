const roomApi = (() => {
  const getByUserId = async (userId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/rooms/user/${userId}`,
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

  return { getByUserId };
})();
