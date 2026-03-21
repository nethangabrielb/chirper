"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";

import { useEffect, useState } from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import { authApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils";

type FormButtonProps = {
  icon?: string;
  children: string;
  outline?: boolean;
  type?: "google" | "login" | "register" | "guest";
  className?: string;
  disabled?: boolean;
};

type ActionButtonProps = {
  children: string;
  className?: string;
  disabled?: boolean;
  type?: "submit";
  hoverText?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const FormButton = ({
  icon,
  children,
  outline,
  type,
  className,
  disabled,
}: FormButtonProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = async (event: MessageEvent<{ success?: boolean }>) => {
      const apiOrigin = process.env.NEXT_PUBLIC_API
        ? new URL(process.env.NEXT_PUBLIC_API).origin
        : null;

      if (apiOrigin && event.origin !== apiOrigin) {
        return;
      }

      if (!event.data) {
        return;
      }

      if (event.data.success) {
        await queryClient.refetchQueries({ queryKey: ["user"] });
        await queryClient.refetchQueries({ queryKey: ["followList"] });
        router.push("/onboarding");
      } else if (event.data.success === false) {
        router.push("/");
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [queryClient, router]);

  const signInGuest = async () => {
    const res = await authApi.loginAsGuest();
    if (res.status === "success") {
      await queryClient.refetchQueries({ queryKey: ["user"] });
      await queryClient.refetchQueries({ queryKey: ["followList"] });
      router.push("/home");
    }
  };

  const clickHandler = async (path: string | undefined) => {
    switch (path) {
      case "google":
        authApi.googleAuth();
        break;
      case "register":
        router.push("/register");
        break;
      case "login":
        router.push("/login");
        break;
      case "guest":
        await signInGuest();
        break;
    }
  };

  return (
    <Button
      className={cn(
        !outline && "hover:!bg-foreground bg-foreground text-background",
        `${className} rounded-3xl border-muted-foreground  h-fit`,
      )}
      variant={outline ? "outline" : "default"}
      onClick={() => type !== null && clickHandler(type)}
      disabled={disabled}
    >
      {icon && (
        <Image src={icon} width={18} height={18} alt="Google Icon"></Image>
      )}
      {children}
    </Button>
  );
};

const ActionButton = ({
  className,
  children,
  onClick,
  disabled,
  type,
  hoverText,
}: ActionButtonProps) => {
  const [hover, setHover] = useState<boolean | null>(null);

  const text = hover && hoverText ? hoverText : children;
  return (
    <Button
      className={`hover:!bg-foreground bg-foreground text-background
        ${className} rounded-3xl border-muted-foreground h-fit`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {text}
    </Button>
  );
};

export { FormButton, ActionButton };
