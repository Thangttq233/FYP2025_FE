import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponseDto, } from "@/types/auth";


interface AuthState {
    auth: AuthResponseDto | null;
    setAuth: (data: AuthResponseDto) => void;
    logOut: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            auth: null,
            setAuth: (data) => set({ auth: data }),
            logOut: () => set({ auth: null }),
        }),
        {
            name: "auth", // name of the item in the storage
        }
    )
);
