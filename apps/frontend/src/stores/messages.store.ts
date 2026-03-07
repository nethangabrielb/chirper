import { create } from "zustand";

type MessagesNotification = {
  unreadMessages: number;
  setUnreadMessages: (count: number) => void;
  resetUnreadMessages: () => void;
};

const useMessagesNotifications = create<MessagesNotification>((set) => ({
  unreadMessages: 0,

  setUnreadMessages: (updatedUnreadMessagesCount) =>
    set({ unreadMessages: updatedUnreadMessagesCount }),

  resetUnreadMessages: () => set({ unreadMessages: 0 }),
}));

export default useMessagesNotifications;
