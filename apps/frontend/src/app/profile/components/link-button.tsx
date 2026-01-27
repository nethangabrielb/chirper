import Link from "next/link";

import { cn } from "@/lib/utils";

const LinkButton = ({
  children,
  href,
  isActive = false,
}: {
  children: string;
  href: string;
  isActive?: boolean;
}) => {
  return (
    <Link
      className="bg-transparent flex-1 p-4 hover:bg-neutral-900 border-b border-b-border flex justify-center"
      href={href}
    >
      <span
        className={cn(isActive ? "border-b-2 border-b-primary" : "text-darker")}
      >
        {children}
      </span>
    </Link>
  );
};

export default LinkButton;
