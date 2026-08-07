import { useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'

type Step = 'phone' | 'otp' | 'form'

export default function FormViewer() {
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [testCode, setTestCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await api.post<{ ok: boolean; testCode?: string }>('/otp/request', { phone })
      setTestCode(res.testCode ?? null)
      setStep('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.post<{ ok: boolean; token: string }>('/otp/verify', { phone, code })
      setStep('form')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Incorrect code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'form') {
    return (
      <div className="flex h-screen w-screen flex-col bg-navy-950">
        <div className="flex items-center justify-between border-b border-cream-50/10 bg-navy-950 px-4 py-3">
          <p className="font-display text-sm font-semibold text-cream-50">Signature 41 — Registration Form</p>
          <a
            href="/documents/registration-form.pdf"
            download="Signature41-Registration-Form.pdf"
            className="rounded-lg bg-gold-500 px-3 py-1.5 text-xs font-bold text-navy-950 transition hover:bg-gold-400"
          >
            Download
          </a>
        </div>
        <iframe
          src="/documents/registration-form.pdf#toolbar=0"
          title="Registration Form"
          className="h-full w-full flex-1 bg-cream-50"
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-cream-50/10 bg-white p-6 shadow-xl">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gold-600">Signature 41</p>
        <h1 className="mt-1 font-display text-xl font-semibold text-navy-900">Verify your number</h1>
        <p className="mt-1 text-sm text-navy-900/55">
          {step === 'phone'
            ? 'Enter your mobile number to receive a one-time code before opening the registration form.'
            : `Enter the 6-digit code sent to ${phone}.`}
        </p>

        {step === 'phone' && (
          <form onSubmit={handleRequestOtp} className="mt-5 space-y-4">
            <div>
              <Label htmlFor="phone">Mobile Number</Label>
              <Input
                id="phone"
                type="tel"
                required
                placeholder="03XX-XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5"
              />
            </div>
            {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}
            <Button type="submit" variant="gold" className="w-full" disabled={loading}>
              {loading ? 'Sending…' : 'Send Code'}
            </Button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4">
            {testCode && (
              <p className="rounded-lg border border-dashed border-gold-500/40 bg-gold-500/5 px-3 py-2 text-xs font-semibold text-gold-700">
                TEST MODE — no SMS gateway configured yet. Your code is: {testCode}
              </p>
            )}
            <div>
              <Label htmlFor="code">6-Digit Code</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                required
                maxLength={6}
                placeholder="______"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1.5 tracking-[0.3em]"
              />
            </div>
            {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}
            <Button type="submit" variant="gold" className="w-full" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify & Open Form'}
            </Button>
            <button
              type="button"
              onClick={() => {
                setStep('phone')
                setCode('')
                setError(null)
              }}
              className="w-full text-center text-xs font-semibold text-navy-900/50 hover:text-navy-900"
            >
              Use a different number
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
