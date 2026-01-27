import { create } from "zustand";

import type { User } from "@/types/user";

type UserState = {
  user: User | {};
  visitedUser: User | {};
  setUser: (arg0: User) => void;
  setVisitedUser: (arg0: User) => void;
  removeUser: () => void;
};

const useUser = create<UserState>((set) => ({
  user: {},
  visitedUser: {},
  setUser: (user) => set({ user }),
  setVisitedUser: (visitedUser) => set({ visitedUser }),
  removeUser: () => set({ user: {} }),
}));

export default useUser;
