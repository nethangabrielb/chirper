import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_API as string, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  transports: ["websocket"],
  withCredentials: true,
});
