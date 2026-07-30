const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

interface ApiError extends Error {
  status?: number
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (authToken) headers.Authorization = `Bearer ${authToken}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 204) return undefined as T

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    const error = new Error(body?.error ?? `Request failed with status ${res.status}`) as ApiError
    error.status = res.status
    throw error
  }

  return body as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(path: string, data?: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

/* ── Portal (buyer) API client ─────────────────────────────────────── */

let portalToken: string | null = null

export function setPortalToken(token: string | null) {
  portalToken = token
}

async function portalRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (portalToken) headers.Authorization = `Bearer ${portalToken}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 204) return undefined as T

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    const error = new Error(body?.error ?? `Request failed with status ${res.status}`) as ApiError
    error.status = res.status
    throw error
  }

  return body as T
}

export const portalApi = {
  get: <T>(path: string) => portalRequest<T>(path),
  post: <T>(path: string, data?: unknown) => portalRequest<T>(path, { method: 'POST', body: JSON.stringify(data) }),
}
