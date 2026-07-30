import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import PortalSidebar from './PortalSidebar'
import { usePortalDataStore } from '@/store/portalDataStore'

export default function PortalLayout() {
  const loaded = usePortalDataStore((s) => s.loaded)
  const loadAll = usePortalDataStore((s) => s.loadAll)

  useEffect(() => {
    loadAll()
  }, [loadAll])

  return (
    <div className="min-h-screen bg-cream-100">
      <PortalSidebar />
      <div className="pl-[272px]">
        {loaded ? (
          <Outlet />
        ) : (
          <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-navy-900/15 border-t-gold-500" />
              <p className="text-sm font-medium text-navy-900/50">Loading your portal…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
