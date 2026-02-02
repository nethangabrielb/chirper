import { Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

import { User } from "@/types/user";

export function LogoutDropdown({
  data,
  logoutHandler,
  className,
  shrinkView,
}: {
  data: User;
  logoutHandler: () => void;
  className?: string;
  shrinkView: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {shrinkView ? (
          <div className={cn("mt-auto relative")}>
            <img
              src={data?.avatar}
              alt="User avatar"
              loading="eager"
              className="size-[48px] min-w-[48px]! rounded-full object-cover cursor-pointer hover:shadow-md transition-all hover:shadow-secondary"
            />
          </div>
        ) : (
          <div
            className={cn(
              "mt-auto flex items-center justify-between gap-4 py-4 mx-4 px-4 rounded-4xl hover:bg-muted transition-all relative cursor-pointer",
              className,
            )}
          >
            <div className="flex items-center gap-4">
              <img
                src={data?.avatar}
                alt="User avatar"
                loading="eager"
                className="size-[48px] min-w-[48px]! rounded-full object-cover"
              />
              <div className="flex flex-col">
                <p className="text-[15px] text-text font-bold">{data?.name}</p>
                <p className="text-[15px] text-darker font-bold">
                  @{data?.username}
                </p>
              </div>
            </div>
            <Ellipsis color="white" fill="white"></Ellipsis>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full lg:w-[300px] bg-background shadow-xl shadow-secondary"
        align="start"
      >
        <DropdownMenuItem
          className="hover:bg-secondary! text-lg font-medium rotate-x-16"
          onSelect={logoutHandler}
        >
          Log out @{data?.username}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
