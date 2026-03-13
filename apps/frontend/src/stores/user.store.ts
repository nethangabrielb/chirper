import { create } from "zustand";

import type { User, UserPartial } from "@/types/user";

type UserState = {
  user: User | null | UserPartial;
  visitedUser: User | null;
  setUser: (arg0: User | UserPartial) => void;
  setVisitedUser: (arg0: User) => void;
  removeUser: () => void;
};

const useUser = create<UserState>((set) => ({
  user: null,
  visitedUser: null,
  setUser: (user) => set({ user }),
  setVisitedUser: (visitedUser) => set({ visitedUser }),
  removeUser: () => set({ user: null }),
}));

export default useUser;
