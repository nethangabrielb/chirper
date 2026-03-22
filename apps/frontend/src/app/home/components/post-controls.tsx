"use client";

import { MoreHorizontalIcon, Pin } from "lucide-react";

import React from "react";

import DeleteDialog from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  handleDelete: () => void;
  settingsCn?: string;
  buttonCn?: string;
};

export function CurrentUserPostDropdown({
  handleDelete,
  settingsCn,
  buttonCn,
}: Readonly<Props>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        asChild
        className={`absolute top-0 right-0 m-3 ${settingsCn}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Button
          variant="outline"
          aria-label="Open menu"
          className={`h-fit! border-0 bg-transparent! hover:bg-primary/20! rounded-full w-fit! p-2! transition-all ${buttonCn}`}
        >
          <MoreHorizontalIcon className="text-neutral-500 bg-transparent!" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-50 bg-background shadow-sm shadow-neutral-600"
        align="start"
        side="top"
      >
        <DropdownMenuItem
          className="hover:bg-secondary/60! w-full"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <DeleteDialog deleteHandler={handleDelete}></DeleteDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
