import { Comment } from "@/app/post/types/coment";

const commentApi = (() => {
  const createComment = async (comment: Comment) => {
    const formData = new FormData();

    for (const key in comment) {
      if (comment.hasOwnProperty(key)) {
        const value = comment[key as keyof typeof comment];
        if (value !== null) {
          formData.append(key, value as any);
        }
      }
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/comments`, {
      credentials: "include",
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  return { createComment };
})();

export default commentApi;
