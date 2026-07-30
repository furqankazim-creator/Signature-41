import { create } from 'zustand'
import { portalApi } from '@/lib/api'
import type {
  PortalBuyerProfile,
  PortalPlotInfo,
  PortalAgentInfo,
  PortalPaymentsData,
  PortalNotification,
} from '@/types'

interface PortalDataState {
  buyer: PortalBuyerProfile | null
  plot: PortalPlotInfo | null
  agent: PortalAgentInfo | null
  paymentsData: PortalPaymentsData | null
  notifications: PortalNotification[]
  loaded: boolean
  loading: boolean

  loadAll: () => Promise<void>
  reset: () => void
}

export const usePortalDataStore = create<PortalDataState>()((set, get) => ({
  buyer: null,
  plot: null,
  agent: null,
  paymentsData: null,
  notifications: [],
  loaded: false,
  loading: false,

  loadAll: async () => {
    if (get().loading) return
    set({ loading: true })
    try {
      const [buyer, plotData, paymentsData, notifications] = await Promise.all([
        portalApi.get<PortalBuyerProfile>('/portal/me'),
        portalApi.get<{ plot: PortalPlotInfo | null; agent: PortalAgentInfo | null }>('/portal/plot'),
        portalApi.get<PortalPaymentsData>('/portal/payments'),
        portalApi.get<PortalNotification[]>('/portal/notifications'),
      ])
      set({
        buyer,
        plot: plotData.plot,
        agent: plotData.agent,
        paymentsData,
        notifications,
        loaded: true,
        loading: false,
      })
    } catch (err) {
      console.error('Failed to load portal data', err)
      set({ loading: false })
    }
  },

  reset: () => {
    set({
      buyer: null,
      plot: null,
      agent: null,
      paymentsData: null,
      notifications: [],
      loaded: false,
      loading: false,
    })
  },
}))
