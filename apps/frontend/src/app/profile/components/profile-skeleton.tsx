"use client";

import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="lg:w-[600px] w-full h-full relative">
      {/* Header */}
      <div className="flex backdrop-blur-lg top-0 w-full border-x border-x-border">
        <div className="bg-transparent flex-1 p-2 border-b border-b-border font-bold flex items-center gap-8">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[60px]" />
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <section className="flex flex-col h-[400px] relative">
        {/* Cover photo skeleton */}
        <div className="flex-1 h-[50%] border-x border-x-border">
          <Skeleton className="h-full w-full rounded-none" />
        </div>

        {/* Avatar skeleton */}
        <div className="absolute p-4 top-[28%]">
          <div className="bg-black p-1 rounded-full">
            <Skeleton className="size-[128px] rounded-full" />
          </div>
        </div>

        {/* Profile info skeleton */}
        <div className="flex-1 p-4 relative border-x border-x-border">
          {/* Edit/Follow button placeholder */}
          <div className="absolute right-0 mr-4">
            <Skeleton className="h-9 w-[120px] rounded-full" />
          </div>

          <div className="mt-[64px]"></div>

          {/* Name and username */}
          <div className="flex flex-col items-start gap-1">
            <Skeleton className="h-6 w-[180px]" />
            <Skeleton className="h-4 w-[120px]" />
          </div>

          {/* Join date */}
          <div className="flex items-center gap-2 my-4">
            <Skeleton className="size-[18px] rounded-sm" />
            <Skeleton className="h-4 w-[160px]" />
          </div>

          {/* Followers / Following */}
          <div className="flex gap-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </section>

      {/* Feed tabs skeleton */}
      <div className="flex mt-6 border-x border-x-border">
        <div className="flex-1 p-4 flex justify-center border-b border-b-border">
          <Skeleton className="h-4 w-[50px]" />
        </div>
        <div className="flex-1 p-4 flex justify-center border-b border-b-border">
          <Skeleton className="h-4 w-[60px]" />
        </div>
        <div className="flex-1 p-4 flex justify-center border-b border-b-border">
          <Skeleton className="h-4 w-[40px]" />
        </div>
      </div>

      {/* Post skeletons */}
      <div className="border-x border-x-border">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-4 p-4 border-b border-b-border"
          >
            <Skeleton className="size-[48px] min-w-[48px] rounded-full" />
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2 items-center">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
              <div className="flex gap-8 mt-2">
                <Skeleton className="h-5 w-[40px]" />
                <Skeleton className="h-5 w-[40px]" />
                <Skeleton className="h-5 w-[24px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
