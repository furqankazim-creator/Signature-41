import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'

export default function Login() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? '/crm'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const ok = await login(email, password)
    setSubmitting(false)
    if (ok) {
      navigate(from, { replace: true })
      return
    }
    const rawError = useAuthStore.getState().error
    if (rawError && /fetch|network|failed to fetch/i.test(rawError)) {
      setError("Can't reach the server. Make sure the API is running at the configured VITE_API_URL, then try again.")
    } else {
      setError(rawError ?? 'Invalid admin email or password. Please try again.')
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy-950 p-10 text-cream-50 lg:flex xl:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />

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
            <ShieldCheck className="h-3.5 w-3.5" /> Restricted access
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight">
            Signature 41 — the new landmark of Scheme 41.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cream-100/60">
            Only authorized administrators can enter the CRM. Manage 1,000+ plots, buyers, installments, and agents
            from one editorial dashboard.
          </p>
        </div>

        <p className="relative text-xs text-cream-100/35">&copy; {new Date().getFullYear()} Signature 41 Estate Management</p>
      </div>

      <div className="flex items-center justify-center bg-cream-100 p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 font-display text-base italic text-gold-400">
              S
            </span>
            <span className="font-display text-base font-semibold text-navy-900">Signature 41</span>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-wider text-gold-600">Admin only</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-navy-900">Sign in to CRM</h2>
          <p className="mt-2 text-sm leading-relaxed text-navy-900/60">
            Enter your admin Gmail and password to access the plot management console.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="email">Admin email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-900/35" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  className="pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-900/35" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {submitting ? 'Signing in…' : 'Enter CRM'} {!submitting && <ArrowRight className="h-4 w-4" />}
            </Button>


          </form>

          <div className="mt-6 flex items-center justify-between">
            <Link to="/" className="text-sm font-semibold text-gold-600 hover:text-gold-700">
              ← Back to website
            </Link>
            <Link to="/portal/login" className="text-sm font-medium text-navy-900/40 hover:text-navy-900/60">
              Buyer Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
