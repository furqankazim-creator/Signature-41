import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { mulberry32, randInt, pick, shuffle } from './lib/rng.js'
import Plot from './models/Plot.js'
import Buyer from './models/Buyer.js'
import Payment from './models/Payment.js'
import Agent from './models/Agent.js'
import Admin from './models/Admin.js'

const SEED = 41
const BLOCKS = ['A', 'B', 'C', 'D', 'E']
const PLOTS_PER_BLOCK = 200

const FIRST_NAMES = [
  'Omar', 'Hina', 'Hassan', 'Tariq', 'Faisal', 'Ayesha', 'Bilal', 'Sana', 'Usman', 'Mariam',
  'Ahmed', 'Fatima', 'Zain', 'Sara', 'Kashif', 'Nida', 'Imran', 'Rabia', 'Waqas', 'Mahnoor',
  'Adeel', 'Sadia', 'Junaid', 'Aliya', 'Shahzad', 'Farah', 'Naveed', 'Iqra', 'Asad', 'Hira',
  'Rizwan', 'Sobia', 'Fahad', 'Uzma', 'Salman', 'Amina', 'Yasir', 'Nadia', 'Kamran', 'Zoya',
  'Arsalan', 'Bushra', 'Talha', 'Mehwish', 'Danish', 'Rukhsar', 'Haris', 'Saima', 'Noman', 'Rida',
]
const LAST_NAMES = [
  'Hussain', 'Malik', 'Raza', 'Sheikh', 'Khan', 'Ahmed', 'Butt', 'Chaudhry', 'Farooq', 'Iqbal',
  'Javed', 'Qureshi', 'Rashid', 'Saeed', 'Tariq', 'Yousaf', 'Zafar', 'Aslam', 'Baig', 'Cheema',
]

const AGENTS_SEED = [
  { name: 'Arsalan Khan', agency: 'Metro Realty', initials: 'AK', phone: '0321-8456723', mtdSales: 15, mtdRevenue: 86_400_000, commission: 1_300_000, leadsNew: 10, leadsContacted: 2, leadsBooked: 2 },
  { name: 'Zoya Sheikh', agency: 'Metro Realty', initials: 'ZS', phone: '0333-9127456', mtdSales: 14, mtdRevenue: 82_400_000, commission: 1_200_000, leadsNew: 5, leadsContacted: 3, leadsBooked: 4 },
  { name: 'Kamran Ashraf', agency: 'Metro Realty', initials: 'KA', phone: '0345-2198347', mtdSales: 15, mtdRevenue: 50_200_000, commission: 752_000, leadsNew: 7, leadsContacted: 5, leadsBooked: 4 },
  { name: 'Iqra Butt', agency: 'Skyline Group', initials: 'IB', phone: '0312-7654891', mtdSales: 10, mtdRevenue: 48_600_000, commission: 728_000, leadsNew: 8, leadsContacted: 4, leadsBooked: 4 },
  { name: 'Nadia Malik', agency: 'Metro Realty', initials: 'NM', phone: '0300-4523178', mtdSales: 8, mtdRevenue: 45_400_000, commission: 681_000, leadsNew: 7, leadsContacted: 4, leadsBooked: 3 },
  { name: 'Mariam Raza', agency: 'Skyline Group', initials: 'MR', phone: '0347-8912345', mtdSales: 6, mtdRevenue: 34_800_000, commission: 522_000, leadsNew: 6, leadsContacted: 3, leadsBooked: 3 },
  { name: 'Bilal Chaudhry', agency: 'Horizon Estates', initials: 'BC', phone: '0322-5673901', mtdSales: 6, mtdRevenue: 28_900_000, commission: 434_000, leadsNew: 6, leadsContacted: 3, leadsBooked: 3 },
  { name: 'Sana Tariq', agency: 'Horizon Estates', initials: 'ST', phone: '0341-6789234', mtdSales: 4, mtdRevenue: 17_500_000, commission: 283_000, leadsNew: 5, leadsContacted: 3, leadsBooked: 3 },
]

const PLOT_TYPES = ['Residential', 'Commercial']
const CATEGORIES = ['A', 'B', 'C']
const SIZES = [120, 150, 200, 240, 300, 400, 500]
const AMENITIES = ['Park', 'Road', 'Corner', 'Mosque']
const PAYMENT_METHODS = ['Cash', 'Card', 'EasyPaisa', 'Bank Transfer', 'JazzCash']

function categoryRate(rand, category) {
  if (category === 'A') return randInt(rand, 8, 14) * 1000
  if (category === 'B') return randInt(rand, 8, 25) * 1000
  return randInt(rand, 8, 22) * 1000
}

function buildAgents() {
  return AGENTS_SEED.map((a, i) => ({ _id: `AG-0${i + 1}`, ...a }))
}

function buildPlots(rand) {
  const statusPool = [
    ...Array(544).fill('Sold'),
    ...Array(174).fill('Reserved'),
    ...Array(200).fill('Available'),
    ...Array(82).fill('On-Hold'),
  ]
  const shuffledStatuses = shuffle(rand, statusPool)

  const plots = []
  let statusIdx = 0
  let globalIdx = 1
  for (const block of BLOCKS) {
    for (let local = 1; local <= PLOTS_PER_BLOCK; local++) {
      const status = shuffledStatuses[statusIdx++]
      const type = pick(rand, PLOT_TYPES)
      const category = pick(rand, CATEGORIES)
      const sizeSqYd = pick(rand, SIZES)
      const price = Math.round((sizeSqYd * categoryRate(rand, category)) / 10000) * 10000
      const amenityCount = randInt(rand, 0, 2)
      const amenities = shuffle(rand, AMENITIES).slice(0, amenityCount)
      plots.push({
        _id: `PLT-${String(globalIdx).padStart(4, '0')}`,
        block,
        plotNo: local,
        type,
        sizeSqYd,
        category,
        price,
        status,
        amenities,
        buyerId: null,
      })
      globalIdx++
    }
  }
  return plots
}

function buildInstallments(rand, totalAmount, registeredAt, now) {
  const installmentsTotal = pick(rand, [12, 24, 36, 48])
  const baseAmount = Math.round(totalAmount / installmentsTotal)
  const dueDates = []
  for (let i = 0; i < installmentsTotal; i++) {
    const d = new Date(registeredAt.getFullYear(), registeredAt.getMonth(), 1)
    d.setMonth(d.getMonth() + i)
    d.setDate(7)
    dueDates.push(d)
  }
  const expectedPaidByNow = dueDates.filter((d) => d <= now).length
  const isBehind = rand() < 0.1
  const paidCount = isBehind
    ? Math.max(0, expectedPaidByNow - randInt(rand, 1, 3))
    : Math.min(expectedPaidByNow, installmentsTotal)

  const installments = dueDates.map((dueDate, i) => {
    const amount = i === installmentsTotal - 1 ? totalAmount - baseAmount * (installmentsTotal - 1) : baseAmount
    if (i < paidCount) {
      const paidDate = new Date(dueDate)
      paidDate.setDate(paidDate.getDate() - randInt(rand, 0, 3))
      return { index: i, dueDate: dueDate.toISOString(), amount, status: 'paid', paidDate: paidDate.toISOString() }
    }
    const status = dueDate <= now ? 'overdue' : 'due'
    return { index: i, dueDate: dueDate.toISOString(), amount, status, paidDate: null }
  })

  const hasOverdue = installments.some((i) => i.status === 'overdue')
  const status = hasOverdue ? 'Overdue' : paidCount >= installmentsTotal ? 'Completed' : 'Current'
  return { installments, status }
}

function buildBuyersAndPayments(rand, plots, agents, now) {
  const eligiblePlots = plots.filter((p) => p.status === 'Sold' || p.status === 'Reserved')
  const buyers = []
  const payments = []
  let buyerIdx = 1
  let paymentIdx = 1000
  let receiptIdx = 50000

  for (const plot of eligiblePlots) {
    const first = pick(rand, FIRST_NAMES)
    const last = pick(rand, LAST_NAMES)
    const name = `${first} ${last}`
    const cnic = `3${randInt(rand, 1000, 9999)}-${randInt(rand, 1000000, 9999999)}-${randInt(rand, 1, 9)}`
    const phone = `03${randInt(rand, 10, 49)}-${randInt(rand, 1000000, 9999999)}`
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${randInt(rand, 1, 99)}@gmail.com`
    const agent = pick(rand, agents)
    const monthsAgo = randInt(rand, 2, 30)
    const registeredAt = new Date(now.getFullYear(), now.getMonth(), 1)
    registeredAt.setMonth(registeredAt.getMonth() - monthsAgo)
    const totalAmount = plot.price
    const { installments, status } = buildInstallments(rand, totalAmount, registeredAt, now)
    const buyerId = `BUY-${String(buyerIdx).padStart(4, '0')}`

    buyers.push({
      _id: buyerId,
      name,
      cnic,
      phone,
      email,
      plotId: plot._id,
      agentId: agent._id,
      totalAmount,
      installments,
      status,
      registeredAt: registeredAt.toISOString(),
    })
    plot.buyerId = buyerId
    buyerIdx++
  }

  const paidInstallmentBuyers = shuffle(
    rand,
    buyers.flatMap((b) => b.installments.filter((i) => i.status === 'paid').map((i) => ({ buyer: b, installment: i })))
  ).slice(0, 24)

  for (const { buyer, installment } of paidInstallmentBuyers) {
    const method = pick(rand, PAYMENT_METHODS)
    const minutesAgo = randInt(rand, 0, 6000)
    const timestamp = new Date(now.getTime() - minutesAgo * 60000)
    payments.push({
      _id: `PMT-${paymentIdx++}`,
      receiptNo: `RCP-${receiptIdx++}`,
      buyerId: buyer._id,
      plotId: buyer.plotId,
      amount: installment.amount,
      method,
      status: rand() < 0.08 ? 'Pending' : 'Received',
      timestamp: timestamp.toISOString(),
    })
  }

  payments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return { buyers, payments }
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB:', process.env.MONGODB_URI)

  const rand = mulberry32(SEED)
  const now = new Date()
  const agents = buildAgents()
  const plots = buildPlots(rand)
  const { buyers, payments } = buildBuyersAndPayments(rand, plots, agents, now)

  await Promise.all([Plot.deleteMany({}), Buyer.deleteMany({}), Payment.deleteMany({}), Agent.deleteMany({})])
  await Agent.insertMany(agents)
  await Plot.insertMany(plots)
  await Buyer.insertMany(buyers)
  await Payment.insertMany(payments)

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
  await Admin.findOneAndUpdate(
    { email: process.env.ADMIN_EMAIL.toLowerCase() },
    { email: process.env.ADMIN_EMAIL.toLowerCase(), passwordHash, name: process.env.ADMIN_NAME, role: 'Super Admin' },
    { upsert: true }
  )

  console.log(`Seeded ${plots.length} plots, ${buyers.length} buyers, ${payments.length} payments, ${agents.length} agents.`)
  console.log(`Admin ready: ${process.env.ADMIN_EMAIL}`)

  await mongoose.disconnect()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
