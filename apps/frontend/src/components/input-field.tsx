import { SendHorizontal } from "lucide-react";
import { FieldValues, UseFormRegister, UseFormWatch } from "react-hook-form";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  placeholder: string;
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
};

const TextInput = ({ className, placeholder, register, watch }: Props) => {
  return (
    <div className="relative">
      <input
        type="text"
        className={cn(className)}
        placeholder={placeholder}
        {...register("message", { minLength: 1 })}
      />
      <div
        className={cn(
          "bg-foreground rounded-full p-2 w-fit absolute right-0 top-0 bottom-0 h-fit flex my-auto mr-4.5 justify-center items-center transition-all",
          watch().message && watch().message.length >= 1
            ? "scale-100"
            : "scale-0",
        )}
      >
        <button>
          <SendHorizontal color="black"></SendHorizontal>
        </button>
      </div>
    </div>
  );
};

export default TextInput;
