"use client";

import useRooms from "@/app/messages/hooks/useRooms";
import useNotifications from "@/hooks/useNotifications";
import useGuestDialog from "@/stores/guest-dialog.store";
import useUser from "@/stores/user.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Feather } from "lucide-react";
import { toast } from "sonner";

import { Activity, ReactNode, useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ActionButton } from "@/components/button";
import FollowListRow from "@/components/follow-list";
import GuestDialog from "@/components/guest-dialog";
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
    title: "Profile",
    url: "",
  },
];

const Sidebar = ({ children }: Props) => {
  const router = useRouter();
  const removeUser = useUser((state) => state.removeUser);
  const user = useUser((state) => state.user) as User;
  const [visible, setVisible] = useState<boolean>(false);
  const [asideVisible, setAsideVisible] = useState<boolean>(false);
  const path = usePathname();
  const openGuestDialog = useGuestDialog((state) => state.setOpenGuestDialog);
  const { notificationsCount, resetNotificationsCache } =
    useNotifications(user);
  const { newMessagesCount } = useRooms();

  const { data: followListAside } = useQuery({
    queryKey: ["followList", user?.id],
    queryFn: async () => {
      const res = await userApi.getUserFollowListLimit(3);
      return res;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const data = await authApi.logout();
      return data;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        router.push("/");
      } else {
        toast.error("Error logging out", { description: data.message });
      }
    },
    onSettled: () => {
      removeUser();
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
    if (
      path === "/messages" ||
      path.includes("messages") ||
      path === "/" ||
      path === "/register" ||
      path === "/login" ||
      path === "/onboarding"
    ) {
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
          link.url = `/profile/${user?.id}`;
        }
        return link;
      },
    );
    links = updatedlinks;
  }, [user?.id]);

  const logOut = () => {
    mutation.mutate();
  };

  return (
    <div className={cn(visible && "flex justify-center", "h-full")}>
      <Activity mode={visible ? "visible" : "hidden"}>
        <div
          className={cn(
            `gap-[8px] md:w-[70px] lg:w-[300px] relative hidden md:block min-h-screen`,
            path.includes("/messages") && "md:w-[50px]! lg:w-[50px]!",
          )}
        >
          <div
            className={cn(
              "hidden md:flex flex-col px-4 lg:px-0 gap-[8px] py-4 h-svh sticky top-0 items-center lg:items-start",
              path.includes("/messages") &&
                "w-fit! md:w-[50px]! lg:w-[50px]! pr-4 items-center! ",
            )}
          >
            <div
              className={cn(
                "pb-3 px-0 lg:px-8 w-fit",
                path.includes("/messages") && "px-0!",
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
                    "text-lg flex items-center gap-6 w-fit hover:bg-muted transition-all p-3 rounded-4xl px-3 lg:px-8 relative",
                    path.includes("/messages") && "p-3!",
                  )}
                  onClick={(e) => {
                    if (user?.isGuest && link.url !== "/home") {
                      e.preventDefault();
                      openGuestDialog(true);
                      return;
                    }
                    if (link.title === "Notifications") {
                      resetNotificationsCache();
                    }
                  }}
                >
                  <div className="relative">
                    <NavIcon title={link.title}></NavIcon>
                    {link.title === "Notifications" &&
                      notificationsCount > 0 && (
                        <p className="absolute top-0 right-0 -translate-y-4 translate-x-2 bg-primary text-white p-2 w-[24px] h-[24px] text-sm flex justify-center items-center rounded-full">
                          {notificationsCount}
                        </p>
                      )}
                    {link.title === "Messages" &&
                      typeof newMessagesCount === "number" &&
                      newMessagesCount > 0 && (
                        <p className="absolute top-0 right-0 -translate-y-4 translate-x-2 bg-primary p-2 w-[24px] h-[24px] text-sm flex justify-center items-center rounded-full text-white">
                          {newMessagesCount}
                        </p>
                      )}
                  </div>
                  {
                    <Activity
                      mode={path.includes("/messages") ? "hidden" : "visible"}
                    >
                      <span className="hidden lg:inline">{link.title}</span>
                    </Activity>
                  }
                </Link>
              );
            })}
            <Activity mode={path.includes("/messages") ? "hidden" : "visible"}>
              <CreatePostDialog>
                {/* Desktop: full Tweet button */}
                <ActionButton
                  className={cn(
                    "bg-primary text-white py-3! mx-8! hover:brightness-90 hover:bg-primary! hidden lg:flex",
                    path.includes("/messages") ? "w-full lg:w-0!" : "w-[80%]",
                  )}
                >
                  Tweet
                </ActionButton>
              </CreatePostDialog>
              {/* Tablet: round feather icon button */}
              <CreatePostDialog>
                <button
                  className="lg:hidden bg-primary hover:brightness-90 text-white p-3 rounded-full flex items-center justify-center shadow-lg transition-all"
                >
                  <Feather size={22} />
                </button>
              </CreatePostDialog>
            </Activity>
            {/* Logout: shrink on tablet, full on desktop */}
            <div className="lg:hidden block mt-auto">
              <LogoutDropdown
                data={user}
                logoutHandler={logOut}
                shrinkView={true}
              />
            </div>
            <div className={cn("hidden lg:block w-full mt-auto", path.includes("/messages") && "lg:hidden")}>
              <LogoutDropdown
                data={user}
                logoutHandler={logOut}
                className={cn(path.includes("/messages") && "w-fit lg:w-0!")}
                shrinkView={path.includes("/messages")}
              />
            </div>
          </div>
        </div>
      </Activity>
      <div className="pb-14 md:pb-0">
        {children}
      </div>
      <Activity mode={asideVisible ? "visible" : "hidden"}>
        <div className={cn(`gap-[8px] lg:w-[450px] relative hidden xl:block`)}>
          <aside className="p-4 font-bold px-8 lg:w-[450px] fixed">
            <div className="flex flex-col border border-border p-3 rounded-xl gap-4">
              <h1>Who to follow</h1>
              <section className="flex flex-col gap-4">
                {user &&
                  followListAside?.map((followUser: UserPartial) => {
                    return (
                      <FollowListRow
                        isUser={followUser.id === user?.id}
                        user={followUser}
                        key={followUser.id}
                        currentUser={user}
                      ></FollowListRow>
                    );
                  })}
              </section>
              <button
                className="text-sm text-primary font-light hover:underline w-fit"
                onClick={(e) => {
                  e.preventDefault();
                  if (user.isGuest) {
                    openGuestDialog(true);
                  } else {
                    router.push("/connect-people");
                  }
                }}
              >
                Show more
              </button>
            </div>
          </aside>
        </div>
      </Activity>
      {/* MOBILE BOTTOM NAV — visible only below md */}
      <Activity mode={visible ? "visible" : "hidden"}>
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-t-border flex justify-around items-center py-2 md:hidden">
          {links.map((link) => (
            <Link
              href={link.url}
              key={`bottom-${link.title}`}
              className="p-2 relative flex items-center justify-center"
              onClick={(e) => {
                if (user?.isGuest && link.url !== "/home") {
                  e.preventDefault();
                  openGuestDialog(true);
                  return;
                }
                if (link.title === "Notifications") {
                  resetNotificationsCache();
                }
              }}
            >
              <div className="relative">
                <NavIcon title={link.title} />
                {link.title === "Notifications" &&
                  notificationsCount > 0 && (
                    <p className="absolute -top-1 -right-1 bg-primary text-white w-[16px] h-[16px] text-[10px] flex justify-center items-center rounded-full">
                      {notificationsCount}
                    </p>
                  )}
                {link.title === "Messages" &&
                  typeof newMessagesCount === "number" &&
                  newMessagesCount > 0 && (
                    <p className="absolute -top-1 -right-1 bg-primary text-white w-[16px] h-[16px] text-[10px] flex justify-center items-center rounded-full">
                      {newMessagesCount}
                    </p>
                  )}
              </div>
            </Link>
          ))}
        </nav>
      </Activity>
      <GuestDialog></GuestDialog>
    </div>
  );
};

export default Sidebar;
