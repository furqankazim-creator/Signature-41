import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, CreditCard, Phone, ShieldCheck, User } from 'lucide-react'
import { usePortalAuthStore } from '@/store/portalAuthStore'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'

export default function PortalLogin() {
  const login = usePortalAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const [cnic, setCnic] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? '/portal'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const ok = await login(cnic, phone)
    setSubmitting(false)
    if (ok) {
      navigate(from, { replace: true })
      return
    }
    const rawError = usePortalAuthStore.getState().error
    if (rawError && /fetch|network|failed to fetch/i.test(rawError)) {
      setError("Can't reach the server. Make sure the API is running, then try again.")
    } else {
      setError(rawError ?? 'No account found with this CNIC and phone number.')
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left branding panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-950 p-10 text-cream-50 lg:flex xl:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/5 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/10 font-display text-base italic text-gold-400">
            S
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream-100/50">Estate</span>
            <span className="font-display text-base font-semibold">Signature 41</span>
          </span>
        </Link>

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gold-400">
            <User className="h-3.5 w-3.5" /> Buyer portal
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight">
            Welcome to your <br />property dashboard.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cream-100/60">
            Check your plot details, track installment payments, view receipts, and contact your sales agent — all in one place.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-cream-50/10 bg-cream-50/5 p-4 text-center">
              <p className="text-2xl font-semibold text-gold-400">📋</p>
              <p className="mt-2 text-xs font-medium text-cream-100/50">Plot Details</p>
            </div>
            <div className="rounded-xl border border-cream-50/10 bg-cream-50/5 p-4 text-center">
              <p className="text-2xl font-semibold text-gold-400">💰</p>
              <p className="mt-2 text-xs font-medium text-cream-100/50">Payments</p>
            </div>
            <div className="rounded-xl border border-cream-50/10 bg-cream-50/5 p-4 text-center">
              <p className="text-2xl font-semibold text-gold-400">📞</p>
              <p className="mt-2 text-xs font-medium text-cream-100/50">Agent Contact</p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-cream-100/35">&copy; {new Date().getFullYear()} Signature 41 Estate Management</p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-cream-100 p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 font-display text-base italic text-gold-400">
              S
            </span>
            <span className="font-display text-base font-semibold text-navy-900">Signature 41</span>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-wider text-gold-600">Buyer access</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-navy-900">Sign in to Portal</h2>
          <p className="mt-2 text-sm leading-relaxed text-navy-900/60">
            Enter your CNIC and registered phone number to access your property dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" id="portal-login-form">
            <div>
              <Label htmlFor="portal-cnic">CNIC Number</Label>
              <div className="relative">
                <CreditCard className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-900/35" />
                <Input
                  id="portal-cnic"
                  type="text"
                  autoComplete="off"
                  placeholder="3XXXX-XXXXXXX-X"
                  className="pl-11"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="portal-phone">Phone Number</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-900/35" />
                <Input
                  id="portal-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="03XX-XXXXXXX"
                  className="pl-11"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-rose-500/10 px-3.5 py-2.5 text-sm font-medium text-rose-500">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Enter Portal'} {!submitting && <ArrowRight className="h-4 w-4" />}
            </Button>

            <p className="rounded-xl border border-dashed border-navy-900/15 px-3.5 py-2.5 text-center text-xs text-navy-900/50">
              Use the CNIC and phone number you registered with your agent.<br />
              <span className="mt-2 block font-medium">
                Demo credentials &middot; <span className="font-semibold text-navy-900/70">31207-9649107-9</span> / <span className="font-semibold text-navy-900/70">0332-4736699</span>
              </span>
            </p>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <Link to="/" className="text-sm font-semibold text-gold-600 hover:text-gold-700">
              ← Back to website
            </Link>
            <Link to="/login" className="text-sm font-medium text-navy-900/40 hover:text-navy-900/60">
              Admin login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
