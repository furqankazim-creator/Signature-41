import type { Block, PlotStatus, BuyerStatus, PaymentStatus, PlotType, PlotCategory, Amenity, PaymentMethod } from '@/types'

export const ADMIN_EMAIL = 'admin@plotmaster.com'
export const ADMIN_PASSWORD = 'admin123'
export const ADMIN_NAME = 'A. Rahim'
export const ADMIN_ROLE = 'Super Admin'
export const ADMIN_INITIALS = 'AR'

export const BLOCKS: Block[] = ['A', 'B', 'C', 'D', 'E']
export const PLOTS_PER_BLOCK = 200

export const PROJECT = {
  id: 'PRJ-01',
  name: 'Signature 41',
  tagline: 'The New Landmark of Scheme 41',
  totalPlots: BLOCKS.length * PLOTS_PER_BLOCK,
}

export const PLOT_STATUS_COLOR: Record<PlotStatus, { bg: string; text: string; dot: string; ring: string }> = {
  Available: { bg: 'bg-sage-500/15', text: 'text-sage-700', dot: 'bg-sage-500', ring: 'ring-sage-500/30' },
  Reserved: { bg: 'bg-gold-400/20', text: 'text-gold-700', dot: 'bg-gold-400', ring: 'ring-gold-400/30' },
  Sold: { bg: 'bg-navy-800', text: 'text-cream-50', dot: 'bg-gold-600', ring: 'ring-navy-800/30' },
  'On-Hold': { bg: 'bg-cream-200', text: 'text-navy-700', dot: 'bg-slate-400', ring: 'ring-slate-400/30' },
}

export const BUYER_STATUS_COLOR: Record<BuyerStatus, { bg: string; text: string }> = {
  Current: { bg: 'bg-sage-500/10', text: 'text-sage-600' },
  Overdue: { bg: 'bg-rose-500/10', text: 'text-rose-500' },
  Completed: { bg: 'bg-navy-900/10', text: 'text-navy-800' },
}

export const PAYMENT_STATUS_COLOR: Record<PaymentStatus, { bg: string; text: string }> = {
  Received: { bg: 'bg-sage-500/10', text: 'text-sage-600' },
  Pending: { bg: 'bg-gold-500/10', text: 'text-gold-600' },
  Overdue: { bg: 'bg-rose-500/10', text: 'text-rose-500' },
}

export const PLOT_STATUSES: PlotStatus[] = ['Available', 'Reserved', 'Sold', 'On-Hold']
export const PLOT_TYPES: PlotType[] = ['Residential', 'Commercial']
export const PLOT_CATEGORIES: PlotCategory[] = ['A', 'B', 'C']
export const AMENITIES: Amenity[] = ['Park', 'Road', 'Corner', 'Mosque']
export const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Card', 'EasyPaisa', 'Bank Transfer', 'JazzCash']
export const INSTALLMENT_PLANS = [12, 24, 36, 48]

export const NAV_ITEMS = [
  { to: '/crm', label: 'Dashboard', icon: 'LayoutDashboard', end: true },
  { to: '/crm/site-map', label: 'Site Map', icon: 'Map' },
  { to: '/crm/inventory', label: 'Plot Inventory', icon: 'Grid3x3' },
  { to: '/crm/buyers', label: 'Buyers & CRM', icon: 'Users' },
  { to: '/crm/payments', label: 'Payments', icon: 'Wallet' },
  { to: '/crm/agents', label: 'Estate Agents', icon: 'UserCog' },
] as const

export const PORTAL_NAV_ITEMS = [
  { to: '/portal', label: 'My Plot', icon: 'Home', end: true },
  { to: '/portal/payments', label: 'Payments', icon: 'Wallet' },
  { to: '/portal/notifications', label: 'Notifications', icon: 'Bell' },
  { to: '/portal/support', label: 'Support', icon: 'Headphones' },
] as const
