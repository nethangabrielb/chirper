"use client";

import { useRouter } from "nextjs-toploader/app";

const PostNotFound = () => {
  const router = useRouter();

  return (
    <div className="lg:w-[600px] border-l border-r border-border min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="flex backdrop-blur-lg sticky top-0 w-full z-10 border-b border-border bg-background/80 px-4 h-[53px] items-center gap-8">
        <button
          className="p-2 rounded-full hover:bg-neutral-500/20 transition-all"
          onClick={() => router.back()}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">Post</h1>
      </div>

      {/* ERROR CONTENT */}
      <div className="flex flex-col items-center justify-center pt-20 px-8 text-center max-w-[400px] mx-auto">
        <h2 className="text-[31px] leading-9 font-extrabold mb-2 tracking-tight">
          Hmm...this post doesn’t exist.
        </h2>
        <p className="text-gray-500 text-[15px] mb-7 leading-5">
          Try searching for another. Pretty sure this has been deleted by the
          user already.
        </p>
        <button
          onClick={() => router.push("/home")}
          className="bg-primary text-white px-8 py-2.5 rounded-full font-bold hover:brightness-95 transition-all text-base"
        >
          Go back
        </button>
      </div>
    </div>
  );
};

export default PostNotFound;
