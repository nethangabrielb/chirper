import type { ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  children: ReactNode;
  content: string;
};

export function TooltipIcon({ children, content }: Readonly<Props>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="rounded-full hover:bg-primary/10 transition-all p-2 cursor-pointer relative w-fit">
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
