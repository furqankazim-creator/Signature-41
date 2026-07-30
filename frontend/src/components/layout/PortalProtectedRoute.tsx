import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { usePortalAuthStore } from '@/store/portalAuthStore'

export default function PortalProtectedRoute() {
  const isAuthenticated = usePortalAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
