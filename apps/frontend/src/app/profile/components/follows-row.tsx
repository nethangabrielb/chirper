import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { FollowType } from "@/types/follow";

type Props = {
  follow: FollowType;
};

const Follows = ({ follow }: Props) => {
  return (
    <section className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src={follow?.avatar}
            alt={`${follow?.username}'s avatar`}
          />
        </Avatar>
        <div className="flex flex-col">
          <p className="text-[15px] text-text font-bold group-hover:underline">
            {follow?.name}
          </p>
          <p className="text-[15px] text-darker font-bold">
            @{follow?.username}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Follows;
