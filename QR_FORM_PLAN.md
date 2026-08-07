# QR → Registration Form: Strengthening Plan

## Current Flow
1. Buyer Portal → Support page shows a QR code.
2. QR encodes `{site origin}/forms/registration`.
3. Scanning opens `/forms/registration`, which renders the PDF in an iframe + a Download button.

## Known Weak Points
1. **Origin depends on how the page was loaded.** On `localhost` the QR encodes `localhost`, which a phone can't resolve. Only works correctly once the site is on a real public domain.
2. **No loading/error state.** If the PDF fails to load (bad path, slow network), the user just sees a blank iframe — no feedback.
3. **No tracking.** No way to know how many people scanned, when, or whether they downloaded — useful for the sales team to gauge interest.
4. **Static file only.** The PDF is a fixed file in `public/documents/`. If the form changes (new pricing, updated terms), someone has to manually replace the file and redeploy.
5. **No per-agent / per-buyer identification.** Every QR code is identical — no way to tell which agent's prospect scanned it, useful for lead attribution.
6. **Mobile viewer reliability.** Iframe PDF rendering is inconsistent across mobile browsers (some show blank, some prompt "open with app").

## Plan (in priority order)

### Phase 1 — Make it reliable (must-do before real use)
- [ ] Deploy the site to its real production domain. Once live, `window.location.origin` is always correct — this alone fixes the #1 issue.
- [ ] Add a loading spinner + "PDF not loading? Tap here to download instead" fallback link on `/forms/registration`, so a slow/broken load never dead-ends the user.
- [ ] Add a `<title>` and Open Graph tags to `/forms/registration` so if the link is ever shared (not just scanned), it previews correctly.

### Phase 2 — Make it useful for the business
- [ ] Log each scan/view (simple: a `POST` to a lightweight endpoint or a Google Sheet/Firestore write) with timestamp, so the sales team knows how many people are engaging with the form.
- [ ] Track "Download" button clicks separately from "viewed" — shows intent, not just curiosity.
- [ ] Optional: generate a **unique QR per agent** (`/forms/registration?ref=agentId`), so leads can be attributed to the referring agent automatically.

### Phase 3 — Make it maintainable
- [ ] Move the PDF path into a single config constant (already partially done via `REGISTRATION_FORM_URL`) so updating the form later is a one-file change.
- [ ] Add a small CRM screen (or reuse an existing admin page) to re-upload a new version of the form PDF without a code deploy — even a simple "replace file in storage" admin action is enough.

### Phase 4 — Polish
- [ ] Replace the iframe with a proper mobile-first PDF viewer (e.g. `react-pdf` rendering pages as images) if iframe blank-screen issues keep happening on specific phones.
- [ ] Add a print-friendly / "share via WhatsApp" option directly on the viewer page.

## What to do right now
The single highest-leverage next step is **Phase 1's first item: deploy to the real domain**. Everything else (tracking, attribution, maintainability) is safe to layer on after that, but until the site is live, testing will keep hitting the localhost/LAN issue we already ran into.

---

## New requirement — OTP verification before the form shows

**Desired flow:** scan QR → enter mobile number → OTP sent by SMS → user enters OTP → only then the registration form is shown.

### Why this needs a real backend + paid SMS service
The frontend alone can't send a text message to a phone. This needs:
1. **An SMS gateway account** (a Pakistani provider — e.g. Contact.com.pk, Telesign, Sinch, or a mobile operator's bulk-SMS API). This is a **paid** third-party service — it needs a signup, and each OTP sent costs a small fee per SMS.
2. **A backend endpoint** to generate the OTP, call the SMS gateway's API, and store the OTP temporarily so it can be verified. The project already has an Express + MongoDB server (`server/`), so this fits naturally there — no new infrastructure needed, just new routes.

### Architecture (once a gateway is chosen)
1. `POST /api/otp/request` — body: `{ phone }`. Server generates a 6-digit code, saves it (with a short expiry, e.g. 5 minutes) against that phone number in MongoDB, and calls the SMS gateway's send-SMS API with the code.
2. Frontend (`/forms/registration`) shows a phone-number input first. On submit, calls `/api/otp/request`, then reveals an OTP-entry screen.
3. `POST /api/otp/verify` — body: `{ phone, code }`. Server checks the stored code and expiry. On success, returns a short-lived token.
4. Frontend stores that token in memory and only then renders the PDF iframe + Download button. The token can also be sent to `/api/otp/verify` so a scanned phone can't be replayed to view the form indefinitely without re-verifying.
5. Rate-limit `request` (e.g. max 3 OTPs per phone per hour) to avoid abuse and cost blow-up, since each SMS costs money.

### What's blocking implementation right now
Nothing on the code side — the blocker is purely **choosing and signing up for an SMS gateway**, since I can't create a paid third-party account on your behalf. Once you have:
- Provider name
- API key / username+password
- Their "send SMS" API documentation (endpoint URL + request format)

...this can be wired into the existing `server/` in under a day of work, and the frontend OTP screens can be built in parallel while you're setting up the gateway account.

### Fallback while you decide on a provider
We can build and test the **entire flow without real SMS** first: generate the OTP server-side, but instead of texting it, temporarily show it on-screen (clearly marked "TEST MODE — remove before launch"). This lets us build and verify the request → verify → show-form logic today, and it becomes a one-line swap to real SMS sending once a gateway is chosen.
