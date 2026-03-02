import { Notification } from "@/types/notification";

type Props = {
  notification: Notification;
};

const NotificationRow = ({ notification }: Props) => {
  return (
    <div className="p-2">
      <p>{notification.content}</p>
    </div>
  );
};

export default NotificationRow;
