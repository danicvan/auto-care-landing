# 🚗 Auto Care Landing

Landing page with a subscription plan system for car detailing services, integrating recurring payments with **Stripe** and user management with **Supabase**.

---

## 📦 Technologies

- [Next.js](https://nextjs.org/)
- [Stripe](https://stripe.com/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📥 Installation

Clone the project:

```bash
git clone https://github.com/danicvan/auto-care-landing.git
cd auto-care-landing
```

Install dependencies:

```bash
npm install
# or
yarn
```

---

## 🛠️ Environment Setup

This project requires environment variables to function properly.

### 1. Copy the `.env.example` file

```bash
cp .env.example .env
```

### 2. Fill in your real credentials in the `.env` file:

You will need:

- ✅ **Stripe Secret Key (`STRIPE_SECRET_KEY`)**
- ✅ **Stripe Public Key (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)**
- ✅ **Stripe Webhook Secret (`STRIPE_WEBHOOK_SECRET`)**
- ✅ **Supabase data (`SUPABASE_URL` and `SUPABASE_ANON_KEY`)**

📌 Access:
- Stripe: https://dashboard.stripe.com/apikeys
- Supabase: https://app.supabase.com/project

---

## ▶️ Running the Project

```bash
npm run dev
# or
yarn dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📚 Features

- Plan selection page with monthly/annual toggle
- Transparent checkout using Stripe Elements
- Dynamic subscription creation
- User and plan data stored in Supabase
- Stripe webhook integration for event handling

---

## 📁 Project Structure

```bash
/pages
  └── index.tsx               # Landing page
  └── checkout.tsx            # Checkout page
  └── api/
        stripe/               # Stripe endpoints

/components/
  └── SubscriptionPlans.tsx  # Plan selection UI
  └── CheckoutForm.tsx       # Stripe Elements payment form

/lib/
  └── stripe/                 # Stripe client/server config
  └── supabase.ts             # Supabase instance
```

---

## 🧑‍💻 Author

Made with ❤️ by [Daniel Camilo](https://github.com/danicvan)

---

## ✅ License

This project is licensed under the MIT License.
