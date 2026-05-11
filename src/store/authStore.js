import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,
            hydrated: false,

            setAuth: (data) =>
                set({
                    token: data.token,
                    user: data.user,
                }),

            setUser: (user) =>
                set({
                    user,
                }),

            logOut: () => set({
                token: null,
                user: null,
            }),

            setHydrated: (state) => set({ hydrated: state }),
        }),

        {
            name: "auth-storage",  // stored in localStorage

            onRehydrateStorage: () => (state) => {
                state.setHydrated(true);
            },
        }
    )
);