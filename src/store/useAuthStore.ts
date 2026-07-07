import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  setAuth: (token: string, refreshToken: string, user: UserProfile) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null, // TODO(security): Storing tokens in localStorage (via persist) exposes them to XSS. Transition to secure HttpOnly cookies if backend permits.
      refreshToken: null,
      user: null,
      setAuth: (token, refreshToken, user) => set({ token, refreshToken, user }),
      setToken: (token) => set({ token }),
      logout: () => {
        set({ token: null, refreshToken: null, user: null })
        // Secure session teardown: reload the page to clear browser cache and React Query state
        window.location.reload()
      },
    }),
    {
      name: "auth-storage",
    }
  )
)
