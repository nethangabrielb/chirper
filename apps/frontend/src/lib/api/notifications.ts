const notificationsApi = (() => {
  const getNotifications = async () => {
    const res = await fetch(
      `/api/notifications`,
      {
        credentials: "include",
      },
    );

    if (!res.ok) {
      throw new Error("Error fetching from the server.");
    }
    const data = await res.json();

    return data;
  };

  return { getNotifications };
})();

export default notificationsApi;
