import { ActionButton } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const UsersDialog = ({
  users,
  messageUser,
}: {
  users: Array<{ id: number; name: string; username: string; avatar: string }>;
  messageUser: (
    visitedUserId: number,
    visitedUser: {
      id: number;
      name: string;
      username: string;
      avatar: string;
    },
  ) => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <ActionButton className="mt-4">New Chat</ActionButton>
      </DialogTrigger>
      <DialogContent className="lg:h-[500px]">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>
        <div
          className="flex flex-col gap-4 overflow-y-scroll [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar]:max-h-[90%]
        [&::-webkit-scrollbar-track]:rounded-xl
      [&::-webkit-scrollbar-track]:bg-background
        [&::-webkit-scrollbar-thumb]:rounded-xl
      [&::-webkit-scrollbar-thumb]:bg-accent"
        >
          {users?.map((user) => {
            return (
              <button
                key={user.id}
                className="flex gap-2 items-center hover:bg-accent mx-1 rounded-md p-1"
                onClick={() => messageUser(user?.id, user)}
              >
                <div>
                  <img
                    src={user.avatar}
                    alt={`${user.name}'s avatar`}
                    className="size-[54px] rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <p>{user.name}</p>
                  <p className="text-darker">@{user.username}</p>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
