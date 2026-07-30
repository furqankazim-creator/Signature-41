import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Agent, Buyer, Payment, Plot, PlotCategory, PlotStatus, PlotType, Amenity, Block } from '@/types'
import { api } from '@/lib/api'
import { PROJECT } from '@/lib/constants'

export interface AddPlotInput {
  block: Block
  type: PlotType
  sizeSqYd: number
  category: PlotCategory
  price: number
  status: PlotStatus
  amenities: Amenity[]
}

export interface RegisterBuyerInput {
  plotId: string
  name: string
  cnic: string
  phone: string
  email: string
  agentId: string
  installmentsTotal: number
  markAsSold: boolean
}

export interface RecordPaymentInput {
  buyerId: string
  amount: number
  method: Payment['method']
}

interface DataState {
  plots: Plot[]
  buyers: Buyer[]
  payments: Payment[]
  agents: Agent[]
  loaded: boolean
  loading: boolean
  readNotificationIds: string[]
  project: typeof PROJECT

  loadAll: () => Promise<void>
  addPlot: (input: AddPlotInput) => Promise<Plot>
  deletePlot: (plotId: string) => Promise<void>
  updatePlotStatus: (plotId: string, status: PlotStatus) => Promise<void>
  registerBuyer: (input: RegisterBuyerInput) => Promise<Buyer>
  recordPayment: (input: RecordPaymentInput) => Promise<Payment | null>
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: (ids: string[]) => void
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      plots: [],
      buyers: [],
      payments: [],
      agents: [],
      loaded: false,
      loading: false,
      readNotificationIds: [],
      project: PROJECT,

      loadAll: async () => {
        if (get().loading) return
        set({ loading: true })
        try {
          const [plots, buyers, payments, agents] = await Promise.all([
            api.get<Plot[]>('/plots'),
            api.get<Buyer[]>('/buyers'),
            api.get<Payment[]>('/payments'),
            api.get<Agent[]>('/agents'),
          ])
          set({ plots, buyers, payments, agents, loaded: true, loading: false })
        } catch (err) {
          console.error('Failed to load data from API', err)
          set({ loading: false })
        }
      },

      addPlot: async (input) => {
        const plot = await api.post<Plot>('/plots', input)
        set({ plots: [plot, ...get().plots] })
        return plot
      },

      deletePlot: async (plotId) => {
        await api.delete(`/plots/${plotId}`)
        set({ plots: get().plots.filter((p) => p.id !== plotId) })
      },

      updatePlotStatus: async (plotId, status) => {
        const plot = await api.patch<Plot>(`/plots/${plotId}`, { status })
        set({ plots: get().plots.map((p) => (p.id === plotId ? plot : p)) })
      },

      registerBuyer: async (input) => {
        const buyer = await api.post<Buyer>('/buyers', input)
        set({
          buyers: [buyer, ...get().buyers],
          plots: get().plots.map((p) =>
            p.id === input.plotId ? { ...p, status: input.markAsSold ? 'Sold' : 'Reserved', buyerId: buyer.id } : p
          ),
        })
        return buyer
      },

      recordPayment: async (input) => {
        const { payment, buyer } = await api.post<{ payment: Payment; buyer: Buyer }>(`/buyers/${input.buyerId}/payments`, {
          amount: input.amount,
          method: input.method,
        })
        set({
          buyers: get().buyers.map((b) => (b.id === buyer.id ? buyer : b)),
          payments: [payment, ...get().payments],
        })
        return payment
      },

      markNotificationRead: (id) => {
        const current = get().readNotificationIds
        if (current.includes(id)) return
        set({ readNotificationIds: [...current, id] })
      },

      markAllNotificationsRead: (ids) => {
        const current = new Set(get().readNotificationIds)
        ids.forEach((id) => current.add(id))
        set({ readNotificationIds: Array.from(current) })
      },
    }),
    {
      name: 'signature41-data',
      partialize: (state) => ({ readNotificationIds: state.readNotificationIds }),
    }
  )
)
