const messageApi = (() => {
  const getMessagesByRoom = async (roomId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/messages/${roomId}`,
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

  const setMessagesRead = async (roomId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/messages/${roomId}`,
      {
        credentials: "include",
        method: "PATCH",
      },
    );

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  return { getMessagesByRoom, setMessagesRead };
})();

export default messageApi;
