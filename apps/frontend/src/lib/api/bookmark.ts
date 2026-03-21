const bookmarkApi = (() => {
  const bookmarkPost = async (userId: number, postId: number) => {
    const res = await fetch(`/api/bookmarks`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, postId }),
    });

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  const removeBookmarkOnPost = async (bookmarkId: number) => {
    const res = await fetch(
      `/api/bookmarks/${bookmarkId}`,
      {
        credentials: "include",
        method: "DELETE",
      },
    );

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  return { bookmarkPost, removeBookmarkOnPost };
})();

export default bookmarkApi;
