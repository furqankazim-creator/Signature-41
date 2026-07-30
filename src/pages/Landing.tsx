import { useState } from 'react'
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
  CheckCircle2,
  Menu,
  X,
  MessageCircle,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button } from '@/components/ui/button'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import heroAerial from '@/assets/images/hero-aerial.jpg'
import galleryGate from '@/assets/images/gallery-gate.jpg'
import galleryMosque from '@/assets/images/gallery-mosque.jpg'
import galleryPark from '@/assets/images/gallery-park.jpg'
import galleryVilla from '@/assets/images/gallery-villa.jpg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#master-plan', label: 'Master Plan' },
  { href: '#amenities', label: 'Amenities' },
  { href: '#plots', label: 'Plots & Pricing' },
  { href: '#payment-plan', label: 'Payment Plan' },
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
  },
  {
    n: '02',
    title: 'Overseas Block — Central Residential',
    desc: 'The heart of the community — mosque, park, and school within walking distance, with well-balanced mid-size residential plots.',
  },
  {
    n: '03',
    title: 'Officer Block — Garden Quarter',
    desc: 'A low-density enclave of villas and cottages arranged around green belts, designed for quiet, family-first living.',
  },
  {
    n: '04',
    title: 'Trader Block — Rear Expansion',
    desc: 'Entry-level sizes at the most accessible pricing in the scheme — an ideal starting point for first-time buyers.',
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

interface PlotSize {
  code: string
  size: string
  categories: PlotCategory[]
}

const PLOT_TABS: { value: string; label: string; sizes: PlotSize[] }[] = [
  {
    value: 'residential',
    label: 'Residential Plots',
    sizes: [
      { code: 'N', size: '60 sq yd', categories: ['Overseas', 'Traders'] },
      { code: 'L', size: '80 sq yd', categories: ['Premium', 'Traders'] },
      { code: 'R', size: '120 sq yd', categories: ['Premium', 'Officers'] },
      { code: 'A', size: '200 sq yd', categories: ['Premium', 'Overseas', 'Officers'] },
      { code: 'B', size: '400 sq yd', categories: ['Premium', 'Overseas'] },
    ],
  },
  {
    value: 'commercial',
    label: 'Commercial Plots',
    sizes: [
      { code: 'C1', size: '120 sq yd', categories: ['Traders'] },
      { code: 'C2', size: '200 sq yd', categories: ['Traders', 'Premium'] },
      { code: 'C3', size: '400 sq yd', categories: ['Premium', 'Overseas'] },
    ],
  },
  {
    value: 'villas',
    label: 'Villas',
    sizes: [
      { code: 'V1', size: '200 sq yd', categories: ['Premium', 'Officers'] },
      { code: 'V2', size: '300 sq yd', categories: ['Premium', 'Overseas'] },
      { code: 'V3', size: '400 sq yd', categories: ['Premium', 'Overseas'] },
    ],
  },
  {
    value: 'cottages',
    label: 'Cottages',
    sizes: [
      { code: 'CT1', size: '120 sq yd', categories: ['Officers', 'Traders'] },
      { code: 'CT2', size: '150 sq yd', categories: ['Premium', 'Officers'] },
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

const GALLERY = [
  { title: 'Master-planned layout', src: heroAerial },
  { title: 'Signature villas', src: galleryVilla },
  { title: 'Community mosque', src: galleryMosque },
  { title: 'Central park spine', src: galleryPark },
  { title: 'Grand entrance', src: galleryGate },
]

const WHATSAPP_NUMBER = '923330335090'

function AerialPhoto({ src, className, overlay = true }: { src: string; className?: string; overlay?: boolean }) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/25 to-navy-900/10" />}
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

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#home" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 font-display text-base italic text-gold-400">
        S
      </span>
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

function CategoryTag({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-700">
      {label}
    </span>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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
    <div className="min-h-screen bg-cream-100">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-navy-900/8 bg-cream-100/85 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
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
          <button className="p-2 xl:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
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
        <div className="relative mx-auto max-w-5xl px-6 py-28 text-center sm:py-36">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gold-300 backdrop-blur">
            Scheme 41 · Karachi
          </span>
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

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_BADGES.map((b) => (
              <div
                key={b}
                className="flex items-center gap-2 rounded-xl border border-cream-50/15 bg-white/5 px-4 py-3 text-left text-xs font-semibold text-cream-100/85 backdrop-blur"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" />
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
            <AerialPhoto
              src={galleryGate}
              overlay={false}
              className="aspect-[4/5] rounded-3xl shadow-[0_20px_60px_-24px_rgba(15,27,51,0.35)] lg:aspect-square"
            />
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
            {MASTER_PLAN_BLOCKS.map((b) => (
              <div key={b.n} className="rounded-2xl border border-navy-900/8 bg-white p-6 transition hover:border-gold-400/40 hover:shadow-lg">
                <span className="font-display text-3xl font-semibold text-gold-500/70">{b.n}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-navy-900">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-900/60">{b.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 rounded-xl border border-dashed border-gold-500/30 bg-gold-500/5 px-5 py-4 text-sm leading-relaxed text-navy-900/70">
            <strong className="font-semibold text-navy-900">Fair pricing by design —</strong> plots closer to the
            boulevard and central amenities are priced higher, while rear-block sizes stay accessible, so every
            buyer profile finds a fitting entry point.
          </p>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="border-t border-navy-900/8 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-xl">
            <SectionTag>Amenities</SectionTag>
            <h2 className="mt-2 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
              Everything within the gates.
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 lg:grid-cols-9">
            {AMENITIES.map((a) => (
              <div
                key={a.label}
                className="flex flex-col items-center gap-3 rounded-2xl border border-navy-900/8 bg-white p-5 text-center transition hover:-translate-y-0.5 hover:border-gold-400/40 hover:shadow-lg"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream-200">
                  <a.icon className="h-5 w-5 text-navy-800" />
                </span>
                <span className="text-[12px] font-semibold leading-tight text-navy-900">{a.label}</span>
              </div>
            ))}
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
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                  {t.sizes.map((s) => (
                    <div
                      key={s.code}
                      className="rounded-2xl border border-navy-900/8 bg-white p-6 text-center transition hover:border-gold-400/40 hover:shadow-lg"
                    >
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 font-display text-lg font-semibold text-gold-400">
                        {s.code}
                      </span>
                      <p className="mt-4 font-display text-xl font-semibold text-navy-900">{s.size}</p>
                      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                        {s.categories.map((c) => (
                          <CategoryTag key={c} label={c} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-10 text-center">
            <Button size="lg" variant="gold" onClick={() => scrollToContact('Share your plot type and we will send current pricing')}>
              Contact for Pricing <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Payment Plan */}
      <section id="payment-plan" className="border-t border-navy-900/8 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 max-w-xl">
            <SectionTag>Payment Plan</SectionTag>
            <h2 className="mt-2 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
              A structured 5-year delivery plan.
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ROADMAP.map((r, i) => (
              <div key={r.year} className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500 font-display text-sm font-bold text-navy-950">
                    {i + 1}
                  </span>
                  {i < ROADMAP.length - 1 && <span className="hidden h-px flex-1 bg-navy-900/12 lg:block" />}
                </div>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-gold-600">{r.year}</p>
                <h3 className="mt-1 font-display text-lg font-semibold text-navy-900">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-900/60">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Outlook */}
      <section className="border-t border-navy-900/8 bg-navy-950 py-20 text-cream-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gold-400">Investment Outlook</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Consistent Growth in Plot Rates</h2>
          </div>
          <div className="rounded-3xl border border-cream-50/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gold-400">
              <TrendingUp className="h-4 w-4" /> Illustrative value index (Launch = 100)
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={GROWTH_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d9a05b" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#d9a05b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#fbfaf814" />
                <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: '#fbfaf899', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#fbfaf899', fontSize: 12 }} width={36} />
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
                  stroke="#d9a05b"
                  strokeWidth={2.5}
                  fill="url(#growthFill)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-cream-100/40">
            This chart is illustrative only, based on typical master-planned scheme trends, and does not represent a
            guarantee of future value or returns. Actual plot rates may vary.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="border-t border-navy-900/8 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-xl">
            <SectionTag>Gallery</SectionTag>
            <h2 className="mt-2 font-display text-3xl font-semibold text-navy-900 sm:text-4xl">
              A glimpse of the life planned here.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {GALLERY.map((g) => (
              <div key={g.title} className="group overflow-hidden rounded-2xl">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={g.src}
                    alt={g.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 text-xs font-semibold text-navy-900/70">{g.title}</p>
              </div>
            ))}
          </div>
        </div>
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
                <div className="flex items-center gap-3">
                  <FacebookIcon className="h-4 w-4 text-gold-400" /> facebook.com/signature41estate
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> Surjani Town, Sector 11-C
                </div>
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
                <li className="flex items-center gap-2">
                  <FacebookIcon className="h-3.5 w-3.5 text-gold-500" /> facebook.com/signature41estate
                </li>
              </ul>
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
