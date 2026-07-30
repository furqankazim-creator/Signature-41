export type Block = 'A' | 'B' | 'C' | 'D' | 'E'
export type PlotType = 'Residential' | 'Commercial'
export type PlotCategory = 'A' | 'B' | 'C'
export type PlotStatus = 'Available' | 'Reserved' | 'Sold' | 'On-Hold'
export type Amenity = 'Park' | 'Road' | 'Corner' | 'Mosque'

export interface Plot {
  id: string
  block: Block
  plotNo: number
  type: PlotType
  sizeSqYd: number
  category: PlotCategory
  price: number
  status: PlotStatus
  amenities: Amenity[]
  buyerId?: string
}

export type InstallmentStatus = 'paid' | 'due' | 'overdue'

export interface Installment {
  index: number
  dueDate: string
  amount: number
  status: InstallmentStatus
  paidDate?: string
}

export type BuyerStatus = 'Current' | 'Overdue' | 'Completed'

export interface Buyer {
  id: string
  name: string
  cnic: string
  phone: string
  email: string
  plotId: string
  agentId: string
  totalAmount: number
  installments: Installment[]
  status: BuyerStatus
  registeredAt: string
}

export type PaymentMethod = 'Cash' | 'Card' | 'EasyPaisa' | 'Bank Transfer' | 'JazzCash'
export type PaymentStatus = 'Received' | 'Pending' | 'Overdue'

export interface Payment {
  id: string
  receiptNo: string
  buyerId: string
  plotId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  timestamp: string
}

export interface Agent {
  id: string
  name: string
  agency: string
  phone: string
  initials: string
  mtdSales: number
  mtdRevenue: number
  commission: number
  leadsNew: number
  leadsContacted: number
  leadsBooked: number
}

export interface Project {
  id: string
  name: string
  tagline: string
  totalPlots: number
}

export interface Notification {
  id: string
  title: string
  detail: string
  timestamp: string
  read: boolean
}

/* ── Portal-specific types ─────────────────────────────────────────── */

export interface PortalBuyerProfile {
  id: string
  name: string
  cnic: string
  phone: string
  email: string
  plotId: string
  agentId?: string
  totalAmount?: number
  status: BuyerStatus
  registeredAt?: string
}

export interface PortalPlotInfo {
  id: string
  block: string
  plotNo: number
  type: PlotType
  sizeSqYd: number
  category: PlotCategory
  price: number
  status: PlotStatus
  amenities: Amenity[]
}

export interface PortalAgentInfo {
  id: string
  name: string
  agency: string
  phone: string
  initials: string
}

export interface PortalPaymentsData {
  totalAmount: number
  status: BuyerStatus
  installments: Installment[]
  payments: {
    id: string
    receiptNo: string
    amount: number
    method: PaymentMethod
    status: PaymentStatus
    timestamp: string
  }[]
}

export type PortalNotificationType = 'overdue' | 'upcoming' | 'paid' | 'completed'

export interface PortalNotification {
  id: string
  type: PortalNotificationType
  title: string
  detail: string
  timestamp: string
  read: boolean
}
