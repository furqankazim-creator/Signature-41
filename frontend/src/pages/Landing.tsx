import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  LogIn,
  MapPin,
  Building2,
  Trees,
  School,
  Church,
  Hospital,
  Gamepad2,
  Dumbbell,
  PartyPopper,
  Waves,
  Fuel,
  Phone,
  Mail,
  Send,
  Download,
  CalendarCheck,
  TrendingUp,
  Menu,
  X,
  MessageCircle,
  Check,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button } from '@/components/ui/button'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import heroAerial from '@/assets/images/hero-aerial.jpg'
import galleryGate from '@/assets/images/gallery-gate.jpg'
import logo from '@/assets/images/logo.png'

const EVENT_PORTRAIT_NUMBERS = new Set([1, 2, 4, 7, 9])

const eventGalleryModules = import.meta.glob('@/assets/images/gallery/event-*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>
const EVENT_GALLERY = Object.keys(eventGalleryModules)
  .map((key) => ({
    n: Number(key.match(/event-(\d+)\.jpg$/)?.[1] ?? 0),
    src: eventGalleryModules[key],
  }))
  .sort((a, b) => a.n - b.n)
  .map(({ n, src }) => ({ n, src, portrait: EVENT_PORTRAIT_NUMBERS.has(n) }))
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#master-plan', label: 'Master Plan' },
  { href: '#plots', label: 'Plots & Pricing' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

const TRUST_BADGES = [
  'Prime Location in Scheme 41',
  'Structured 5-Year Development Plan',
  'Transparent Block-Wise Pricing',
  'Overseas Investor Friendly',
]

const ABOUT_FEATURES = [
  {
    icon: MapPin,
    title: 'A Prime Spot in Scheme 41',
    desc: 'Positioned along the main approach of Scheme 41, giving every block strong visibility and easy access.',
  },
  {
    icon: Send,
    title: 'Effortlessly Connected',
    desc: 'Minutes from major arteries linking Karachi — designed for a smooth daily commute and easy visitor access.',
  },
  {
    icon: Trees,
    title: 'Built Around Green Space',
    desc: 'A central park spine and green belts run through the community, keeping nature close to every home.',
  },
]

const MASTER_PLAN_BLOCKS = [
  {
    n: '01',
    title: 'Premium Block — Boulevard Front',
    desc: 'Main-approach frontage with a dedicated commercial spine. Plot sizes of 200 and 400 sq yd, built for visibility and footfall.',
    highlights: ['200 & 400 sq yd plots', 'Commercial spine frontage', 'Highest visibility & footfall'],
  },
  {
    n: '02',
    title: 'Overseas Block — Central Residential',
    desc: 'The heart of the community — mosque, park, and school within walking distance, with well-balanced mid-size residential plots.',
    highlights: ['60–200 sq yd plots', 'Walk to mosque, park & school', 'Central community location'],
  },
  {
    n: '03',
    title: 'Officer Block — Garden Quarter',
    desc: 'A low-density enclave of villas and cottages arranged around green belts, designed for quiet, family-first living.',
    highlights: ['Villas & cottages', 'Green-belt facing plots', 'Low density, family-first'],
  },
  {
    n: '04',
    title: 'Trader Block — Rear Expansion',
    desc: 'Entry-level sizes at the most accessible pricing in the scheme — an ideal starting point for first-time buyers.',
    highlights: ['60–120 sq yd plots', 'Most accessible pricing', 'Ideal first-time buyer entry'],
  },
]

const AMENITIES = [
  { icon: School, label: 'School' },
  { icon: Church, label: 'Mosque' },
  { icon: Trees, label: 'Park' },
  { icon: Hospital, label: 'Hospital' },
  { icon: Gamepad2, label: 'Playground' },
  { icon: Dumbbell, label: 'Gym' },
  { icon: PartyPopper, label: 'Ballroom' },
  { icon: Waves, label: 'Swimming Club' },
  { icon: Fuel, label: 'Petrol Pump' },
]

type PlotCategory = 'Premium' | 'Overseas' | 'Officers' | 'Traders'

const ALL_CATEGORIES: PlotCategory[] = ['Premium', 'Overseas', 'Officers', 'Traders']

interface PlotSize {
  code?: string
  size: string
  categories: PlotCategory[]
}

const PLOT_TABS: { value: string; label: string; sizes: PlotSize[] }[] = [
  {
    value: 'residential',
    label: 'Residential Plots',
    sizes: [
      { code: 'N', size: '60 sq yd', categories: ['Traders'] },
      { code: 'L', size: '80 sq yd', categories: ['Officers', 'Traders'] },
      { code: 'R', size: '120 sq yd', categories: ['Overseas', 'Officers', 'Traders'] },
      { code: 'A', size: '200 sq yd', categories: ['Premium', 'Overseas', 'Officers'] },
      { code: 'B', size: '400 sq yd', categories: ['Premium', 'Overseas', 'Officers'] },
    ],
  },
  {
    value: 'commercial',
    label: 'Commercial Plots',
    sizes: [
      { code: 'LS', size: '80 sq yd', categories: ['Traders'] },
      { code: 'SR', size: '133 sq yd', categories: ['Traders', 'Officers'] },
      { code: 'SA', size: '200 sq yd', categories: ['Overseas', 'Traders'] },
      { code: 'SB', size: '400 sq yd', categories: ['Premium', 'Officers', 'Traders'] },
      { code: 'FL', size: '1200 sq yd', categories: ['Premium'] },

    ],
  },
  {
    value: 'villas',
    label: 'Villas',
    sizes: [
      { size: '60 sq yd', categories: ['Traders'] },
      { size: '120 sq yd', categories: ['Officers'] },
      { size: '200 sq yd', categories: [] },
    ],
  },
  {
    value: 'cottages',
    label: 'Cottages',
    sizes: [
      { code: 'SR', size: '133 sq yd', categories: ['Officers'] },
      { code: 'LS', size: '80 sq yd', categories: ['Traders'] },
    ],
  },
]

const ROADMAP = [
  {
    year: 'Year 1',
    title: 'Initiation',
    desc: 'Land consolidation, master planning, and regulatory approvals.',
  },
  {
    year: 'Year 2',
    title: 'Infrastructure',
    desc: 'Roads, sewerage, water supply, electrification, and boundary wall.',
  },
  {
    year: 'Year 3–4',
    title: 'Advancement',
    desc: '50% development milestone, amenity construction, and partial handovers begin.',
  },
  {
    year: 'Year 5',
    title: 'Completion',
    desc: 'Final landscaping, commercial delivery, and full possession to all buyers.',
  },
]

const GROWTH_DATA = [
  { stage: 'Launch', value: 100 },
  { stage: 'Yr 2', value: 128 },
  { stage: 'Yr 3', value: 158 },
  { stage: 'Yr 4', value: 196 },
  { stage: 'Possession', value: 245 },
]

const GALLERY: { n: number; title: string; src: string; portrait: boolean }[] = EVENT_GALLERY.map(({ n, src, portrait }) => ({
  n,
  title: 'MOU Signing Ceremony',
  src,
  portrait,
}))

const WHATSAPP_NUMBER = '923330335090'

function AerialPhoto({
  src,
  className,
  overlay = true,
  fit = 'cover',
}: {
  src: string
  className?: string
  overlay?: boolean
  fit?: 'cover' | 'contain'
}) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        src={src}
        alt=""
        className={cn('absolute inset-0 h-full w-full', fit === 'cover' ? 'object-cover' : 'object-contain')}
      />
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/25 to-navy-900/10" />}
    </div>
  )
}

function ImageSlider({
  images,
  className,
  intervalMs = 4000,
}: {
  images: string[]
  className?: string
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [images.length, intervalMs])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={cn(
            'absolute inset-0 h-full w-full object-contain transition-opacity duration-1000 ease-in-out',
            i === index ? 'opacity-100' : 'opacity-0'
          )}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn('h-1.5 rounded-full transition-all', i === index ? 'w-6 bg-cream-50' : 'w-1.5 bg-cream-50/40')}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77.55-.55 1.11-.9 1.77-1.15.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 1.8c-2.67 0-2.99.01-4.04.06-.97.04-1.5.2-1.85.34-.46.18-.79.4-1.14.75-.35.35-.57.68-.75 1.14-.14.35-.3.88-.34 1.85-.05 1.05-.06 1.37-.06 4.04s.01 2.99.06 4.04c.04.97.2 1.5.34 1.85.18.46.4.79.75 1.14.35.35.68.57 1.14.75.35.14.88.3 1.85.34 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.97-.04 1.5-.2 1.85-.34.46-.18.79-.4 1.14-.75.35-.35.57-.68.75-1.14.14-.35.3-.88.34-1.85.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.97-.2-1.5-.34-1.85a3.08 3.08 0 0 0-.75-1.14 3.08 3.08 0 0 0-1.14-.75c-.35-.14-.88-.3-1.85-.34C14.99 3.81 14.67 3.8 12 3.8zm0 3.06a5.14 5.14 0 1 1 0 10.28 5.14 5.14 0 0 1 0-10.28zm0 1.8a3.34 3.34 0 1 0 0 6.68 3.34 3.34 0 0 0 0-6.68zm5.34-1.99a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.5 6.9a3.02 3.02 0 0 0-2.12-2.14C19.5 4.3 12 4.3 12 4.3s-7.5 0-9.38.46A3.02 3.02 0 0 0 .5 6.9 31.6 31.6 0 0 0 0 12.5a31.6 31.6 0 0 0 .5 5.6 3.02 3.02 0 0 0 2.12 2.14c1.88.46 9.38.46 9.38.46s7.5 0 9.38-.46a3.02 3.02 0 0 0 2.12-2.14 31.6 31.6 0 0 0 .5-5.6 31.6 31.6 0 0 0-.5-5.6zM9.6 15.98V9.02l6.27 3.48-6.27 3.48z" />
    </svg>
  )
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 2h-3.2v13.6a3.1 3.1 0 1 1-2.2-2.97V9.3a6.3 6.3 0 1 0 5.4 6.24V8.9a7.9 7.9 0 0 0 4.6 1.47V7.2a4.5 4.5 0 0 1-4.6-4.6z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.68H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  )
}

const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://www.facebook.com/signature41', Icon: FacebookIcon },
  { name: 'Instagram', href: 'https://www.instagram.com/signature41official/?hl=en', Icon: InstagramIcon },
  { name: 'YouTube', href: 'https://www.youtube.com/@Signature41official', Icon: YoutubeIcon },
  { name: 'TikTok', href: 'https://www.tiktok.com/@singnature41official', Icon: TiktokIcon },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/signature-forty-one-ab0a8a425/', Icon: LinkedinIcon },
]

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#home" className="flex items-center gap-2.5">
      <img
        src={logo}
        alt="Signature 41"
        className={cn('h-20 w-20 shrink-0 object-contain transition duration-300', dark && 'brightness-0 invert')}
      />
      <span className="flex flex-col leading-none">
        <span className={cn('text-[10px] font-bold uppercase tracking-[0.18em]', dark ? 'text-cream-100/50' : 'text-navy-900/40')}>
          Scheme 41 · Karachi
        </span>
        <span className={cn('font-display text-base font-semibold', dark ? 'text-cream-50' : 'text-navy-900')}>Signature 41</span>
      </span>
    </a>
  )
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold uppercase tracking-wider text-gold-600">{children}</p>
}

export default function Landing() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [flippedBlocks, setFlippedBlocks] = useState<Record<string, boolean>>({})

  function scrollToContact(reason: string) {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    toast({ title: reason, variant: 'info' })
  }

  function handleEnquirySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      toast({ title: 'Enquiry sent', description: 'Our team will reach out to you shortly.', variant: 'success' })
      e.currentTarget.reset()
    }, 600)
  }

  return (
    <div className="landing-deep-red min-h-screen bg-cream-100">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-navy-900/8 bg-cream-100/85 backdrop-blur">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm font-medium text-navy-900/70 xl:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="transition hover:text-navy-900">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={() => navigate('/portal/login')}
              className="flex items-center gap-1.5 text-sm font-semibold text-navy-900/60 transition hover:text-navy-900"
            >
              <LogIn className="h-4 w-4" /> Buyer Portal
            </button>
            <Button variant="gold" onClick={() => scrollToContact('Tell us about your plot preference')}>
              Book Your Plot
            </Button>
          </div>
          <button className="p-2 text-navy-900 xl:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-navy-900/8 bg-cream-50 px-6 py-4 xl:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-navy-900/70">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="py-1">
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 flex items-center gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate('/portal/login')}>
                <LogIn className="h-4 w-4" /> Buyer Portal
              </Button>
              <Button variant="gold" className="flex-1" onClick={() => scrollToContact('Tell us about your plot preference')}>
                Book Your Plot
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative flex min-h-screen items-center overflow-hidden">
        <AerialPhoto src={heroAerial} className="absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-6 pt-16 pb-28 text-center sm:pt-20 sm:pb-36">
          <img
            src={logo}
            alt="Signature 41"
            className="mx-auto mb-8 h-32 w-32 rounded-3xl bg-white p-4 object-contain shadow-xl sm:h-44 sm:w-44 sm:p-6"
          />
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-cream-50 sm:text-6xl">
            Signature 41 — Own Your Dreams.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-cream-100/75">
            A landmark address in the heart of Scheme 41 — master planned across four blocks, built for families and
            investors alike.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" variant="gold" onClick={() => scrollToContact('Send us your details to receive the brochure')}>
              <Download className="h-4 w-4" /> Download Brochure
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cream-50/30 text-cream-50 hover:bg-cream-50/10"
              onClick={() => scrollToContact('Tell us your preferred date and we will confirm your visit')}
            >
              <CalendarCheck className="h-4 w-4" /> Schedule a Site Visit
            </Button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-cream-50/10 bg-navy-950/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col divide-y divide-cream-50/10 sm:flex-row sm:divide-x sm:divide-y-0">
            {TRUST_BADGES.map((b) => (
              <div
                key={b}
                className="flex flex-1 basis-0 items-center justify-center gap-2 px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-cream-50/90 sm:py-4 sm:text-[11px] lg:py-6"
              >
                <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-navy-900/8 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <ImageSlider
                images={[galleryGate]}
                className="aspect-[1600/907] rounded-3xl bg-navy-950 shadow-[0_20px_60px_-24px_rgba(15,27,51,0.35)]"
              />
              <p className="mt-5 text-center font-display text-xl font-semibold uppercase tracking-wider text-navy-900 sm:text-2xl">
                Core Marketing and Strategic Members
              </p>
            </div>
            <div>
              <SectionTag>A Beautiful Location</SectionTag>
              <h2 className="mt-2 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
                An address that appreciates with you.
              </h2>
              <span className="mt-4 block h-[3px] w-14 rounded-full bg-gold-500" />
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-navy-900/65">
                Signature 41 is a complete, self-sufficient community — not just a plot file. Every block is planned
                around schools, worship, healthcare, and green space, so residents live, work, and grow within a
                single well-connected address in Scheme 41.
              </p>
              <div className="mt-8 space-y-5">
                {ABOUT_FEATURES.map((f) => (
                  <div key={f.title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900">
                      <f.icon className="h-5 w-5 text-gold-400" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-navy-900">{f.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-navy-900/60">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Master Plan */}
      <section id="master-plan" className="border-t border-navy-900/8 bg-cream-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-xl">
            <SectionTag>Master Plan</SectionTag>
            <h2 className="mt-2 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
              Four blocks. One balanced community.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MASTER_PLAN_BLOCKS.map((b) => {
              const isFlipped = !!flippedBlocks[b.n]
              return (
                <button
                  key={b.n}
                  type="button"
                  onClick={() => setFlippedBlocks((prev) => ({ ...prev, [b.n]: !prev[b.n] }))}
                  className="group h-64 w-full text-left [perspective:1200px]"
                  aria-pressed={isFlipped}
                >
                  <div
                    className={cn(
                      'relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]',
                      isFlipped && '[transform:rotateY(180deg)]'
                    )}
                  >
                    <div className="absolute inset-0 rounded-2xl border border-navy-900/8 bg-white p-6 [backface-visibility:hidden] group-hover:border-gold-400/40 group-hover:shadow-lg">
                      <span className="font-display text-3xl font-semibold text-gold-500/70">{b.n}</span>
                      <h3 className="mt-3 font-display text-lg font-semibold text-navy-900">{b.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-navy-900/60">{b.desc}</p>
                      <span className="absolute bottom-4 right-4 text-[10px] font-bold uppercase tracking-wider text-gold-600/70">
                        Tap for details
                      </span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl border border-gold-500/30 bg-navy-950 p-6 text-cream-50 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <span className="font-display text-3xl font-semibold text-gold-400">{b.n}</span>
                      <h3 className="mt-3 font-display text-base font-semibold text-cream-50">{b.title}</h3>
                      <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-cream-100/70">
                        {b.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-1.5">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          <p className="mt-8 rounded-xl border border-dashed border-gold-500/30 bg-gold-500/5 px-5 py-4 text-sm leading-relaxed text-navy-900/70">
            <strong className="font-semibold text-navy-900">Fair pricing by design —</strong> plots closer to the
            boulevard and central amenities are priced higher, while rear-block sizes stay accessible, so every
            buyer profile finds a fitting entry point.
          </p>

          {/* Amenities (Merged into Master Plan) */}
          <div id="amenities" className="mt-20 pt-20 border-t border-navy-900/8">
            <div className="mb-12 max-w-xl">
              <SectionTag>Amenities</SectionTag>
              <h2 className="mt-2 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
                Everything within the gates.
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {AMENITIES.map((a, i) => (
                <div
                  key={a.label}
                  style={{ animationDelay: `${i * 75}ms`, animationFillMode: 'backwards' }}
                  className="animate-in fade-in slide-in-from-bottom-4 group flex flex-col items-center justify-center gap-4 border border-navy-900/10 bg-white px-6 py-10 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold-500 hover:bg-navy-950 hover:shadow-xl duration-500"
                >
                  <a.icon
                    className="h-8 w-8 text-navy-900 transition-colors duration-300 group-hover:text-gold-400"
                    strokeWidth={1.5}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-700 transition-colors duration-300 group-hover:text-cream-50">
                    {a.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plots & Pricing */}
      <section id="plots" className="border-t border-navy-900/8 bg-cream-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-xl">
            <SectionTag>Plots & Pricing</SectionTag>
            <h2 className="mt-2 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
              A size for every plan.
            </h2>
          </div>

          <Tabs defaultValue="residential">
            <TabsList className="flex-wrap">
              {PLOT_TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {PLOT_TABS.map((t) => (
              <TabsContent key={t.value} value={t.value} className="mt-8">
                <div className="animate-in fade-in slide-in-from-bottom-2 overflow-hidden rounded-2xl border border-navy-900/8 bg-white shadow-sm duration-500">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse text-sm">
                      <thead>
                        <tr className="bg-navy-900 text-cream-50">
                          <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider">Size</th>
                          {ALL_CATEGORIES.map((c) => (
                            <th key={c} className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {t.sizes.map((s, i) => (
                          <tr
                            key={s.code || s.size}
                            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
                            className={cn(
                              'animate-in fade-in slide-in-from-left-1 group border-t border-navy-900/8 transition-colors duration-300 hover:bg-gold-500/10',
                              i % 2 === 1 && 'bg-cream-50/60'
                            )}
                          >
                            <td className="px-6 py-4 font-display font-semibold text-navy-900 transition-colors duration-300 group-hover:text-gold-700">
                              {s.code ? `${s.code} = ${s.size}` : s.size}
                            </td>
                            {ALL_CATEGORIES.map((c) => (
                              <td key={c} className="px-6 py-4">
                                {s.categories.includes(c) ? (
                                  <Check className="h-4 w-4 text-gold-600 transition-transform duration-300 group-hover:scale-125" />
                                ) : (
                                  <span className="text-navy-900/20">—</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-10 text-center">
            <Button size="lg" variant="gold" onClick={() => scrollToContact('Share your plot type and we will send current pricing')}>
              Contact for Pricing <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Payment Plan (Merged into Plots & Pricing) */}
          <div id="payment-plan" className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 px-6 py-16 text-cream-50 sm:p-20 shadow-xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gold-400">Development Roadmap</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">A structured 5-year delivery plan.</h2>
              <div className="mx-auto mt-4 h-px w-12 bg-gold-500/50" />
              <p className="mt-4 text-sm leading-relaxed text-cream-100/60">
                Four defined stages, each with its own milestones — so you always know what stage your investment is
                standing on.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {ROADMAP.map((r, i) => (
                <div
                  key={r.year}
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'backwards' }}
                  className="relative animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500/50 font-display text-xs font-bold text-gold-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {i < ROADMAP.length - 1 && <span className="hidden h-px flex-1 bg-cream-50/15 lg:block" />}
                  </div>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-gold-400">{r.year}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-cream-50">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-100/60">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investment Outlook */}
      <section className="border-t border-navy-900/8 bg-cream-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gold-600">Investment Outlook</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
                Consistent Growth in Plot Rates
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-navy-900/60">
                Planned communities in developing zones tend to reward early entrants. As infrastructure lands and
                amenities open, front-block frontage and mid-size residential plots historically carry the strongest
                demand.
              </p>
              <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-navy-900/45">
                <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
                <span>
                  The chart shown is an illustrative representation of a typical development-linked value curve, not
                  a forecast or a record of actual rates.{' '}
                  <button
                    type="button"
                    onClick={() => scrollToContact('I would like verified current pricing')}
                    className="font-semibold text-gold-600 underline decoration-gold-500/40 underline-offset-2 hover:text-gold-700"
                  >
                    Speak with our team for verified pricing.
                  </button>
                </span>
              </p>
            </div>

            <div className="rounded-3xl border border-navy-900/8 bg-white p-6 shadow-sm">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={GROWTH_DATA} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8a2e2e" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#8a2e2e" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#0f1b330d" />
                  <XAxis
                    dataKey="stage"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#0f1b3366', fontSize: 11, fontWeight: 600 }}
                    dy={8}
                  />
                  <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
                  <Tooltip
                    formatter={(value) => [`${value} index`, 'Illustrative value']}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #0f1b3314',
                      fontSize: 12,
                      background: '#fbfaf8',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8a2e2e"
                    strokeWidth={2.5}
                    fill="url(#growthFill)"
                    dot={{ r: 4, fill: '#fbfaf8', stroke: '#d9a05b', strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: '#d9a05b', stroke: '#8a2e2e', strokeWidth: 1.5 }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="border-t border-navy-900/8 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <SectionTag>Gallery</SectionTag>
          <h2 className="mt-2 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
            A glimpse of the life planned here.
          </h2>
          <div className="mx-auto mt-4 h-px w-12 bg-gold-500/50" />
          <p className="mt-4 text-sm leading-relaxed text-navy-900/55">
            Moments from the Signature 41 M.O.U. signing ceremony and community events.
          </p>
        </div>
        {GALLERY.length > 0 ? (
          <div
            className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-4 px-6 [grid-auto-flow:dense] sm:grid-cols-3 lg:grid-cols-4"
            style={{ gridAutoRows: '140px' }}
          >
            {GALLERY.map((g, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
                className={cn(
                  'animate-in fade-in slide-in-from-bottom-4 group relative overflow-hidden rounded-2xl duration-700',
                  g.portrait ? 'row-span-2' : 'row-span-1'
                )}
              >
                <img
                  src={g.src}
                  alt={g.title}
                  loading="lazy"
                  className={cn(
                    'h-full w-full object-cover transition duration-500 group-hover:scale-110',
                    g.n === 1 ? 'object-[50%_20%]' : (g.portrait ? 'object-top' : 'object-center')
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent transition-opacity duration-500 group-hover:from-navy-950/90" />
                <p className="absolute bottom-3 left-4 text-xs font-bold uppercase tracking-wider text-cream-50 transition-transform duration-500 group-hover:-translate-y-1">
                  {g.title}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-4xl px-6">
            <div className="rounded-2xl border border-dashed border-navy-900/15 bg-cream-50 py-16 text-center text-sm font-medium text-navy-900/40">
              Gallery photos coming soon.
            </div>
          </div>
        )}
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-navy-900/8 bg-cream-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-xl">
            <SectionTag>Book Your Plot</SectionTag>
            <h2 className="mt-2 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
              Book your plot at Signature 41.
            </h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <form onSubmit={handleEnquirySubmit} className="rounded-3xl border border-navy-900/8 bg-white p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="Your full name" required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="03xx xxxxxxx" required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div>
                  <Label htmlFor="category">Interested Category</Label>
                  <Select id="category" name="category" defaultValue="Premium">
                    <option>Premium</option>
                    <option>Overseas</option>
                    <option>Officers</option>
                    <option>Traders</option>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="plotType">Plot Type</Label>
                  <Select id="plotType" name="plotType" defaultValue="Residential">
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Villas</option>
                    <option>Cottages</option>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" rows={4} placeholder="Tell us what you're looking for…" />
                </div>
              </div>
              <Button type="submit" size="lg" variant="gold" className="mt-6 w-full sm:w-auto" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Enquiry'} {!submitting && <Send className="h-4 w-4" />}
              </Button>
            </form>

            <div className="rounded-3xl bg-navy-950 p-6 text-cream-50 sm:p-8">
              <h3 className="font-display text-xl font-semibold">Talk to our team</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-100/60">
                Our sales desk is available for site visits, brochure requests, and pricing queries.
              </p>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gold-400" /> signature41official@gmail.com
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gold-400" /> 0333-0335090
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> Surjani Town, Sector 11-C
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/10 text-gold-400 transition hover:bg-gold-500 hover:text-navy-950"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-2 rounded-xl border border-gold-500/20 bg-gold-500/10 px-4 py-3 text-xs font-medium text-gold-300">
                <Building2 className="h-4 w-4 shrink-0" /> Marketed exclusively by Neon Marketings.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-900/8 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <Logo />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-900/55">
                A landmark master-planned address in Scheme 41 — marketed by Neon Marketings.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-navy-900/40">Quick Links</p>
              <ul className="mt-4 space-y-2 text-sm text-navy-900/65">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="transition hover:text-navy-900">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-navy-900/40">Contact</p>
              <ul className="mt-4 space-y-2 text-sm text-navy-900/65">
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-gold-500" /> signature41official@gmail.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-gold-500" /> 0333-0335090
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" /> Surjani Town, Sector 11-C
                </li>
              </ul>
              <div className="mt-4 flex items-center gap-2.5">
                {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900/8 text-navy-900/55 transition hover:bg-gold-500 hover:text-navy-950"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-navy-900/8 pt-6 text-xs text-navy-900/40 sm:flex-row">
            <p>&copy; {new Date().getFullYear()} Signature 41. All rights reserved.</p>
            <Link to="/login" className="font-semibold text-navy-900/50 hover:text-gold-600">
              Admin Sign In
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sage-500 text-white shadow-2xl transition hover:scale-105 hover:bg-sage-600"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  )
}
