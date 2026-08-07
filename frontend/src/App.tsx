import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastProvider } from '@/components/ui/toast'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import CrmLayout from '@/components/layout/CrmLayout'
import { useDataStore } from '@/store/dataStore'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import FormViewer from '@/pages/FormViewer'
import Dashboard from '@/pages/crm/Dashboard'
import SiteMap from '@/pages/crm/SiteMap'
import Inventory from '@/pages/crm/Inventory'
import PlotDetail from '@/pages/crm/PlotDetail'
import Buyers from '@/pages/crm/Buyers'
import BuyerDetail from '@/pages/crm/BuyerDetail'
import Payments from '@/pages/crm/Payments'
import Agents from '@/pages/crm/Agents'
import AgentDetail from '@/pages/crm/AgentDetail'

import PortalLayout from '@/components/layout/PortalLayout'
import PortalProtectedRoute from '@/components/layout/PortalProtectedRoute'
import PortalLogin from '@/pages/portal/PortalLogin'
import MyPlot from '@/pages/portal/MyPlot'
import PortalPayments from '@/pages/portal/PortalPayments'
import PortalSupport from '@/pages/portal/PortalSupport'
import PortalNotifications from '@/pages/portal/PortalNotifications'

export default function App() {
  const loadAll = useDataStore((s) => s.loadAll)

  useEffect(() => {
    loadAll()
  }, [loadAll])

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forms/registration" element={<FormViewer />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<CrmLayout />}>
              <Route path="/crm" element={<Dashboard />} />
              <Route path="/crm/site-map" element={<SiteMap />} />
              <Route path="/crm/inventory" element={<Inventory />} />
              <Route path="/crm/inventory/:plotId" element={<PlotDetail />} />
              <Route path="/crm/buyers" element={<Buyers />} />
              <Route path="/crm/buyers/:buyerId" element={<BuyerDetail />} />
              <Route path="/crm/payments" element={<Payments />} />
              <Route path="/crm/agents" element={<Agents />} />
              <Route path="/crm/agents/:agentId" element={<AgentDetail />} />
            </Route>
          </Route>

          <Route path="/portal/login" element={<PortalLogin />} />

          <Route element={<PortalProtectedRoute />}>
            <Route element={<PortalLayout />}>
              <Route path="/portal" element={<MyPlot />} />
              <Route path="/portal/payments" element={<PortalPayments />} />
              <Route path="/portal/support" element={<PortalSupport />} />
              <Route path="/portal/notifications" element={<PortalNotifications />} />
            </Route>
          </Route>

          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
