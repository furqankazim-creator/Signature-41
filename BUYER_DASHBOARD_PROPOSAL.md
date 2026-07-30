# Buyer (Customer) Dashboard — Proposal

## Current state

The app today only has **one** authenticated area: the **Admin/CRM panel** (`/crm/*`),
protected by a single admin login (`src/store/authStore.ts`, `ProtectedRoute`). There is
no concept of a buyer/customer account anywhere in the code — no buyer login, no buyer
session, no buyer-scoped API routes. Buyers only exist as records the admin manages
(`Buyers.tsx`, `BuyerDetail.tsx`).

So "buyer dashboard" would be a **new, separate portal** — a second login system next to
the existing admin one, scoped to a single buyer's own data instead of the whole
portfolio.

## Why build it

Right now, if a buyer wants to know their payment status, they have to call the sales
office. A self-serve dashboard lets them check it anytime, reduces support calls, and
looks professional for a "premium" development like Signature 41.

## What data is already available for it

Every field a buyer dashboard needs already exists in the data model
(`src/types/index.ts`) — nothing new has to be invented on the backend, it just needs to
be exposed to the buyer instead of only the admin:

- `Buyer` — name, CNIC, phone, email, plotId, agentId, totalAmount, status
- `Installment[]` — index, due date, amount, status (paid/due/overdue), paid date
- `Plot` — block, plot number, type, size, category, price, amenities
- `Payment` — receipt number, amount, method, status, timestamp
- `Agent` — name, agency (their assigned sales agent's contact info)

## Proposed screens

### 1. Login (`/portal/login`)
- Buyer signs in with **CNIC + phone** or **email + a system-issued password/OTP**
  (buyers aren't given passwords today — need to decide: OTP via SMS/email, or an
  admin-generated temporary password shown once when the buyer is registered).

### 2. My Plot (`/portal`)
- Plot card: block, plot number, size, type, category, amenities — reuse the plot
  detail layout already built for admins (`PlotDetail.tsx`), just without edit
  controls.
- Ownership status badge (Reserved / Sold / On-Hold).
- Assigned agent's name + phone, so the buyer knows who to call.

### 3. Payment Progress (`/portal/payments`)
- Same progress bar + "X of Y installments paid" that already exists in
  `BuyerDetail.tsx` — this is almost a direct reuse.
- Full installment timeline (`InstallmentTable`), read-only: paid / due / overdue,
  with due dates and paid dates.
- Next payment due — amount + date, highlighted if overdue.
- Receipt history — every `Payment` record tied to this buyer, downloadable/printable
  receipt per transaction.

### 4. Documents (`/portal/documents`)
- Booking form / allotment letter, payment receipts as PDFs.
- Nothing in the current data model stores documents — would need a new `documents`
  collection + file storage (the backend has no file upload yet).

### 5. Notifications
- "Installment due in 7 days," "Payment received," "Possession update." The
  `Notification` type already exists in `types/index.ts` but nothing currently writes
  or reads it — would need to be wired up for real.

### 6. Support / Contact
- Direct WhatsApp/call link to their assigned agent (already have `agent.name`, need
  to add a phone field to `Agent` — it's missing today).

## What would need to be built (not just reused)

1. **Buyer auth** — new login flow, separate from admin auth. Needs a decision on
   credential method (OTP vs. password) since buyers don't have accounts today.
2. **Backend routes scoped to "my data only"** — today's routes
   (`server/src/routes/buyers.routes.js`, `payments.routes.js`) are admin-only and
   return everything. A buyer-facing API must filter by the logged-in buyer's ID only.
3. **New `/portal/*` route tree + layout** in the React app, parallel to `/crm/*`.
4. **Document storage**, if receipts/allotment letters are wanted as downloadable files.
5. **Agent phone number field** — missing from the `Agent` type today.

## Suggested build order

1. Payment Progress screen (reuses the most existing code, highest buyer value).
2. My Plot screen.
3. Buyer auth (OTP-based is simplest — no password reset flow to build).
4. Notifications.
5. Documents (only if receipts/PDFs are actually needed — biggest new-infra item).
