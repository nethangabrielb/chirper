import { Activity } from "react";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  message: string;
  loading?: boolean;
};

const Message = ({ className, message, loading }: Props) => {
  return (
    <div className="flex flex-col">
      <div
        className={cn(
          className,
          "p-3 rounded-xl text-white w-fit text-sm",
          loading && "animate-pulse",
        )}
      >
        <p>{message}</p>
      </div>
      <Activity mode={loading ? "visible" : "hidden"}>
        <p className="text-darker font-light text-[10px] self-end">
          Sending...
        </p>
      </Activity>
    </div>
  );
};

export default Message;
