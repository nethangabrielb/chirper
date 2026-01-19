const followApi = (() => {
  const getFollowers = async (userId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/follows/followers/${userId}`,
      {
        credentials: "include",
      },
    );

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  const getFollowings = async (userId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/follows/followings/${userId}`,
      {
        credentials: "include",
      },
    );

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  const createFollow = async (followerId: number, followingId: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/follows`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ followerId, followingId }),
    });

    if (!res.ok) {
      throw new Error("There was a problem following the user.");
    }

    const data = await res.json();
    return data;
  };

  return { getFollowers, getFollowings, createFollow };
})();

export default followApi;
