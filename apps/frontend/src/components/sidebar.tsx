"use client";

import useUser from "@/stores/user.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Activity, ReactNode, useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ActionButton } from "@/components/button";
import Icon from "@/components/icon";
import NavIcon from "@/components/navIcon";
import { LogoutDropdown } from "@/components/ui/logout-dropdown";

import { authApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils";

import { User } from "@/types/user";

type Props = {
  children: ReactNode;
};

let links: Array<{ title: string; url: string }> = [
  {
    title: "Home",
    url: "/home",
  },
  {
    title: "Notifications",
    url: "/notifications",
  },
  {
    title: "Messages",
    url: "/messages",
  },
  {
    title: "Bookmarks",
    url: "/bookmarks",
  },
  {
    title: "Chat",
    url: "/chat",
  },
  {
    title: "Profile",
    url: "",
  },
  {
    title: "Settings",
    url: "/settings/account",
  },
];

const Sidebar = ({ children }: Props) => {
  const router = useRouter();
  const setUser = useUser((state) => state.setUser);
  const removeUser = useUser((state) => state.removeUser);
  const user = useUser((state) => state.user) as User;
  const [visible, setVisible] = useState<boolean>(false);
  const path = usePathname();
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (path !== "/") {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/users?current=true`,
          {
            credentials: "include",
          },
        );

        if (!res.ok) {
          throw new Error("Error fetching from the server.");
        }
        const data = await res.json();
        const user = data.data;
        setUser(user);
        return user;
      }
    },
    refetchOnWindowFocus: false,
  });
  const mutation = useMutation({
    mutationFn: async () => {
      const data = await authApi.logout();
      return data;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        removeUser();
        router.push("/");
      } else {
        toast.error("Error logging out", { description: data.message });
      }
    },
  });

  const renderSidebar = (currentPath: string) => {
    switch (currentPath) {
      case "/":
        setVisible(false);
        break;
      case "/register":
        setVisible(false);
        break;
      case "/login":
        setVisible(false);
        break;
      case "/onboarding":
        setVisible(false);
        break;
      default:
        setVisible(true);
    }
  };

  useEffect(() => {
    renderSidebar(path);
  }, [path]);

  useEffect(() => {
    const updatedlinks: Array<{ title: string; url: string }> = links.map(
      (link) => {
        if (link.title === "Profile") {
          link.url = `/profile/${user.id}`;
        }
        return link;
      },
    );
    links = updatedlinks;
  }, [user]);

  const logOut = () => {
    mutation.mutate();
  };

  return (
    <div className={cn(visible && "flex justify-center", "h-full")}>
      <Activity mode={visible ? "visible" : "hidden"}>
        <div className="gap-[8px] lg:w-[300px] relative">
          <div className="flex flex-col gap-[8px] py-4 lg:w-[300px] h-full fixed">
            <div className=" pb-3 px-8">
              <Icon width={36} height={36} alt="Twitter Icon"></Icon>
            </div>
            {links.map((link) => {
              return (
                <Link
                  href={link.url}
                  key={crypto.randomUUID()}
                  className="text-lg flex items-center gap-6 w-fit hover:bg-muted transition-all p-3 rounded-4xl px-8 "
                >
                  <NavIcon title={link.title}></NavIcon>
                  {link.title}
                </Link>
              );
            })}
            <ActionButton className="bg-primary text-white py-3! mx-8! hover:brightness-90 hover:bg-primary!">
              Tweet
            </ActionButton>
            <LogoutDropdown data={data} logoutHandler={logOut}></LogoutDropdown>
          </div>
        </div>
      </Activity>
      {children}
    </div>
  );
};

export default Sidebar;
