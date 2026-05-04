import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,

            setAuth: (data)=>
                set({
                    token: data.token,
                    user: data.user,
                }),

                logOut: () =>set({
                    token: null,
                    user: null,
                }),
        }),

        {
            name: "auth-storage",  // stored in localStorage
        }
    )
);