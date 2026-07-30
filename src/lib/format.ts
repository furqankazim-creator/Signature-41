export function formatPKR(amount: number): string {
  const abs = Math.abs(amount)
  if (abs >= 1_000_000_000) return `PKR ${(amount / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `PKR ${(amount / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `PKR ${(amount / 1_000).toFixed(0)}K`
  return `PKR ${amount.toFixed(0)}`
}

export function formatPKRFull(amount: number): string {
  return `PKR ${Math.round(amount).toLocaleString('en-PK')}`
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-PK')
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toISOString().slice(0, 10)
}

export function formatDateLong(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diffMs = now - then
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  const months = Math.floor(days / 30)
  return `${months} month${months === 1 ? '' : 's'} ago`
}

export function daysBetween(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24))
}
