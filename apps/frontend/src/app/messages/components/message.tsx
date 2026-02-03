import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  message: string;
};

const Message = ({ className, message }: Props) => {
  return (
    <div className={cn(className, "p-3 rounded-xl text-white w-fit text-sm")}>
      <p>{message}</p>
    </div>
  );
};

export default Message;
