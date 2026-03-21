import { NewPost } from "@/app/home/types/create-post.type";

import { ParamValue } from "next/dist/server/request/params";

import { PostType } from "@/types/post";

const postApi = (() => {
  const getPosts = async (pageParam: number | undefined) => {
    const res = await fetch(
      `/api/posts?cursor=${pageParam}`,
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

  const getFollowingsPosts = async (pageParam: number | undefined) => {
    const res = await fetch(
      `/api/posts?filter=following&cursorFollowing=${pageParam}`,
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

  const getPost = async (id: ParamValue | Number) => {
    const res = await fetch(`/api/posts/${id}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Error fetching from the server.");
    }
    const data = await res.json();
    return data.data as PostType;
  };

  const createPost = async (values: FormData) => {
    const res = await fetch(`/api/posts`, {
      credentials: "include",
      method: "POST",
      body: values,
    });

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  const deletePost = async (postId: number) => {
    const res = await fetch(
      `/api/posts/${postId}`,
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

  const likePost = async (postId: number) => {
    const res = await fetch(
      `/api/likes/posts/${postId}`,
      {
        credentials: "include",
        method: "POST",
      },
    );

    if (!res.ok) {
      throw new Error("There was an error processing the request.");
    }
    const data = await res.json();

    return data;
  };

  const unlikePost = async (postId: number) => {
    const res = await fetch(
      `/api/likes/posts/${postId}`,
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

  const getUserReplies = async (userId: number) => {
    const res = await fetch(
      `/api/posts/replies/users/${userId}`,
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

  const getUserLiked = async (userId: number) => {
    const res = await fetch(
      `/api/posts/liked/users/${userId}`,
      {
        credentials: "include",
      },
    );
    if (!res.ok) {
      throw new Error("There was an error processing this request.");
    }
    const data = await res.json();

    return data;
  };

  const getUserBookmarkedPosts = async () => {
    const res = await fetch(
      `/api/posts?bookmarks=true`,
      {
        credentials: "include",
      },
    );
    if (!res.ok) {
      throw new Error("There was an error processing this request.");
    }
    const data = await res.json();

    return data;
  };

  return {
    getPosts,
    getPost,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    getUserReplies,
    getUserLiked,
    getUserBookmarkedPosts,
    getFollowingsPosts,
  };
})();

export default postApi;
