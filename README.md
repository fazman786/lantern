# 🏮 Lantern

> **Clear, calm guidance for overwhelming legal, financial, and employment situations.**

Lantern is an AI-powered web app that turns confusing legal letters, debt demands, tax notices, employment disputes, and benefits issues into plain-English guidance with clear action steps — in 70 countries, 13 languages.

---

## ✨ Features

- **6 situation categories** — Debt & Bills, Legal Letters, Contracts, Tax, Benefits & Housing, Employment
- **AI document scanner** — photograph any letter and get instant guidance
- **AI letter writer** — generates formal dispute, appeal, and complaint letters ready to send
- **Voice input** — speak your situation instead of typing
- **Follow-up Q&A** — ask unlimited follow-up questions about your guidance
- **Deadline tracker** — AI detects deadlines automatically and shows countdown reminders
- **Emergency resources** — local helplines and organisations for 25+ countries
- **Smart resource recommendation** — AI picks the single most relevant helpline for your situation
- **Action checklist** — tick off each step as you complete it
- **Outcome tracker** — mark situations as resolved, ongoing, escalated, or professionally handled
- **PDF export** — download a formatted copy of your full guidance
- **PIN lock** — protect your guidance history with a 4-digit PIN
- **Referral codes** — share Lantern with a unique code

## 🌍 Global Support

- **70 countries** with auto-detection from timezone
- **13 languages** — English, Spanish, French, German, Portuguese, Italian, Dutch, Hindi, Chinese, Japanese, Korean, Arabic, Turkish
- **25+ countries** with local helpline numbers built in

## 💰 Pricing

| Plan | Price | Sessions |
|------|-------|----------|
| Free | £0/month | 3 per month |
| Pro Monthly | £6.99/month | Unlimited |
| Pro Annual | £49.99/year | Unlimited |

Payments via PayPal subscriptions.

---

## 🚀 Tech Stack

- **Frontend** — React 18, Vite
- **AI** — Anthropic Claude Sonnet API
- **Payments** — PayPal Subscriptions
- **Hosting** — Vercel
- **PWA** — Service Worker, Web App Manifest
- **Storage** — Client-side only (no backend database)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API key
- PayPal developer account (for payments)

### Installation

```bash
git clone https://github.com/yourusername/lantern.git
cd lantern
npm install
npm run dev
```

### Environment

Payments are configured via three constants at the top of `src/App.jsx`:

```js
const PAYPAL_CLIENT_ID    = "YOUR_PAYPAL_CLIENT_ID";
const PAYPAL_PLAN_MONTHLY = "YOUR_PLAN_ID_MONTHLY";
const PAYPAL_PLAN_ANNUAL  = "YOUR_PLAN_ID_ANNUAL";
```

Replace these with your PayPal app credentials from [developer.paypal.com](https://developer.paypal.com).

### Build & Deploy

```bash
npm run build
```

Deploys automatically to Vercel on every push to `main`.

---

## 📁 Project Structure

```
lantern/
├── index.html          # PWA entry point with full meta tags
├── manifest.json       # Web App Manifest
├── sw.js               # Service Worker (offline + caching)
├── vite.config.js      # Vite config
├── package.json
├── icons/              # PWA icons (72px → 512px)
└── src/
    ├── main.jsx        # React entry point
    └── App.jsx         # Complete application
```

---

## ⚖️ Legal

Lantern provides **educational guidance only** — not legal, financial, tax, or professional advice. Users are always advised to consult a qualified professional for their specific situation.

See [Privacy Policy](#) and [Terms of Service](#) within the app.

---

## 📬 Contact

- **Support:** support@lanternapp.co.uk
- **Privacy:** privacy@lanternapp.co.uk

---

## 📄 Licence

Private and proprietary. All rights reserved.
 
