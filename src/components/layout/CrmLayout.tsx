import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useDataStore } from '@/store/dataStore'

export default function CrmLayout() {
  const loaded = useDataStore((s) => s.loaded)

  return (
    <div className="min-h-screen bg-cream-100">
      <Sidebar />
      <div className="pl-[272px]">
        {loaded ? (
          <Outlet />
        ) : (
          <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-navy-900/15 border-t-gold-500" />
              <p className="text-sm font-medium text-navy-900/50">Loading portfolio data…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
