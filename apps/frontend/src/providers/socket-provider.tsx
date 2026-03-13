"use client";

import { socket } from "@/socket/client";
import useUser from "@/stores/user.store";
import _ from "lodash";

import { ReactNode, useEffect, useRef } from "react";

import { User } from "@/types/user";

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const user = useUser((state) => state.user) as User;
  const prevUser = useRef(user);

  useEffect(() => {
    if (user?.id !== prevUser?.current?.id) {
      if (!_.isEmpty(user) && socket.disconnected) {
        socket.connect();
      }
    }

    return () => {
      if (socket.connected && user?.id === prevUser?.current?.id) {
        socket.disconnect();
      }
      prevUser.current = user;
    };
  }, [user?.id]);

  return <>{children}</>;
};

export default SocketProvider;
