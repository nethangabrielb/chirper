"use client";

import { useTheme } from "next-themes";

import { useEffect, useState } from "react";

import Image from "next/image";

type Props = {
  width: number;
  height: number;
  alt: string;
};

const Icon = ({ width, height, alt }: Props) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { systemTheme } = useTheme();

  const src = systemTheme === "dark" ? "/twitter.svg" : "/twitterDark.svg";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted ? (
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          className="max-w-none"
        ></Image>
      ) : (
        <div style={{ width, height }}></div>
      )}
    </>
  );
};

export default Icon;
