export const validateEventSender = (senderId: number, socketUserId: number) => {
  return senderId === socketUserId;
};
