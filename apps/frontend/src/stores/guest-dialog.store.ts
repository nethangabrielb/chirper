import { create } from "zustand";

type GuestDialog = {
  openGuestDialog: boolean;
  setOpenGuestDialog: (openGuestDialog: boolean) => void;
};

const useGuestDialog = create<GuestDialog>((set) => ({
  openGuestDialog: false,
  setOpenGuestDialog: (openGuestDialog: boolean) => set({ openGuestDialog }),
}));

export default useGuestDialog;
