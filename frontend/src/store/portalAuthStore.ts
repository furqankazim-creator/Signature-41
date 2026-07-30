import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { portalApi, setPortalToken } from '@/lib/api'
import type { PortalBuyerProfile } from '@/types'

interface PortalLoginResponse {
  token: string
  buyer: PortalBuyerProfile
}

interface PortalAuthState {
  isAuthenticated: boolean
  token: string | null
  buyer: PortalBuyerProfile | null
  error: string | null
  login: (cnic: string, phone: string) => Promise<boolean>
  logout: () => void
}

export const usePortalAuthStore = create<PortalAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      buyer: null,
      error: null,

      login: async (cnic, phone) => {
        try {
          const { token, buyer } = await portalApi.post<PortalLoginResponse>('/portal/login', { cnic, phone })
          setPortalToken(token)
          set({ isAuthenticated: true, token, buyer, error: null })
          return true
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Login failed.' })
          return false
        }
      },

      logout: () => {
        setPortalToken(null)
        set({ isAuthenticated: false, token: null, buyer: null })
      },
    }),
    {
      name: 'signature41-portal-auth',
      onRehydrateStorage: () => (state) => {
        if (state?.token) setPortalToken(state.token)
      },
    }
  )
)
