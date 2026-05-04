import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  open: false,
  search: '',
  setOpen: (bool) => set({ open: bool }),
  setSearch: (value) => set({ search: value }),
}));