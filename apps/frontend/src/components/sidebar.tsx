"use client";

import useNotifications from "@/hooks/useNotifications";
import useUser from "@/stores/user.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Activity, ReactNode, useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ActionButton } from "@/components/button";
import FollowListRow from "@/components/follow-list";
import Icon from "@/components/icon";
import NavIcon from "@/components/navIcon";
import { CreatePostDialog } from "@/components/post-dialog";
import { LogoutDropdown } from "@/components/ui/logout-dropdown";

import { authApi } from "@/lib/api/auth";
import userApi from "@/lib/api/user";
import { cn } from "@/lib/utils";

import { User, UserPartial } from "@/types/user";

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
    title: "Follow",
    url: "/connect-people",
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
  const { notifications, setUnreadCount, unreadCount } = useNotifications(user);
  const [visible, setVisible] = useState<boolean>(false);
  const [asideVisible, setAsideVisible] = useState<boolean>(false);
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

  const { data: followListAside } = useQuery({
    queryKey: ["followList", user],
    queryFn: async () => {
      if (path !== "/") {
        const res = await userApi.getUserFollowListLimit(3);
        return res;
      }
    },
    refetchOnMount: false,
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

  const renderAsideVisible = (path: string) => {
    if (path === "/messages" || path.includes("messages")) {
      setAsideVisible(false);
    } else {
      setAsideVisible(true);
    }
  };

  useEffect(() => {
    renderSidebar(path);
    renderAsideVisible(path);
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
        <div
          className={cn(
            `gap-[8px] lg:w-[300px] relative`,
            path.includes("/messages") && "lg:w-[50px]",
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-[8px] py-4 lg:w-[300px] h-full fixed",
              path.includes("/messages") &&
                "w-fit! lg:w-[50px] pr-4 items-center ",
            )}
          >
            <div
              className={cn(
                "pb-3 px-8 w-fit",
                path.includes("/messages") && "px-0",
              )}
            >
              <Icon width={36} height={36} alt="Twitter Icon"></Icon>
            </div>
            {links.map((link) => {
              return (
                <Link
                  href={link.url}
                  key={crypto.randomUUID()}
                  className={cn(
                    "text-lg flex items-center gap-6 w-fit hover:bg-muted transition-all p-3 rounded-4xl px-8",
                    path.includes("/messages") && "p-3!",
                  )}
                >
                  <NavIcon title={link.title}></NavIcon>
                  {
                    <Activity
                      mode={path.includes("/messages") ? "hidden" : "visible"}
                    >
                      <span>{link.title}</span>
                    </Activity>
                  }
                </Link>
              );
            })}
            <Activity mode={path.includes("/messages") ? "hidden" : "visible"}>
              <CreatePostDialog>
                <ActionButton
                  className={cn(
                    "bg-primary text-white py-3! mx-8! hover:brightness-90 hover:bg-primary!",
                    path.includes("/messages") ? "w-full lg:w-0!" : "w-[80%]",
                  )}
                >
                  Tweet
                </ActionButton>
              </CreatePostDialog>
            </Activity>
            <LogoutDropdown
              data={data}
              logoutHandler={logOut}
              className={cn(path.includes("/messages") && "w-fit lg:w-0!")}
              shrinkView={path.includes("/messages")}
            ></LogoutDropdown>
          </div>
        </div>
      </Activity>
      {children}
      <Activity mode={asideVisible ? "visible" : "hidden"}>
        <div className={cn(`gap-[8px] lg:w-[450px] relative`)}>
          <aside className="p-4 font-bold px-8 lg:w-[450px] fixed">
            <div className="flex flex-col border border-border p-3 rounded-xl gap-4">
              <h1>Who to follow</h1>
              <section className="flex flex-col gap-4">
                {data &&
                  followListAside?.map((user: UserPartial) => {
                    return (
                      <FollowListRow
                        isUser={user.id === data?.id}
                        user={user}
                        key={user.id}
                        currentUser={data}
                      ></FollowListRow>
                    );
                  })}
              </section>
              <Link
                href="/connect-people"
                className="text-sm text-primary font-light"
              >
                Show more
              </Link>
            </div>
          </aside>
        </div>
      </Activity>
    </div>
  );
};

export default Sidebar;
