import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api, setAuthToken } from '@/lib/api'

interface AdminProfile {
  name: string
  role: string
  email: string
}

interface LoginResponse {
  token: string
  admin: AdminProfile
}

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  admin: AdminProfile | null
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      admin: null,
      error: null,

      login: async (email, password) => {
        try {
          const { token, admin } = await api.post<LoginResponse>('/auth/login', { email, password })
          setAuthToken(token)
          set({ isAuthenticated: true, token, admin, error: null })
          return true
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Login failed.' })
          return false
        }
      },

      logout: () => {
        setAuthToken(null)
        set({ isAuthenticated: false, token: null, admin: null })
      },
    }),
    {
      name: 'signature41-auth',
      onRehydrateStorage: () => (state) => {
        if (state?.token) setAuthToken(state.token)
      },
    }
  )
)
