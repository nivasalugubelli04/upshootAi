# Upshoot AI — Production Web Application

A full-stack, production-ready web platform for **Upshoot AI**, built with Next.js App Router, Supabase Authentication & Database, and Resend Transactional Email.

---

## 1. What Was Implemented

- **Minimalist Monochrome Luxury Aesthetic**: Engineered an ultra-clean pitch black (`#000000`) and pure white theme with silver/platinum hairline borders (`rgba(255, 255, 255, 0.14)`), subtle slate tones, and typography powered by **Plus Jakarta Sans** and **Outfit**.
- **Mandatory Welcome Gate (`WelcomeGate`)**:
  - Requires all incoming visitors to authenticate via **Google**, **Email**, or **Mobile SMS OTP** before accessing the platform.
  - The 3 mandatory options are directly displayed on the screen with full provider details so users can immediately choose their authentication method.
  - Includes a guest preview bypass for seamless testing and review.
- **Complete Page Architecture**:
  - **Home**: Hero section with quick CTA, 3-pillar value props (*Capture*, *Create*, *Inspire*), and interactive metrics strip.
  - **Services**: Full catalog of 8 core services (Meta Ads, Google Ads, YouTube Ads, Email Marketing, Content Creation & Storytelling, Brand Optimisation, Paid Media Strategy, Web Design & Development).
  - **Pricing**: Dynamic interactive pricing comparison tabs for *Instant Package* (£300), *Business Package* (£500), and *Exclusives* (£850).
  - **About**: Brand narrative, mission statement, and value propositions.
  - **Contact**: Real, functional contact submission system with client-side & server-side validation, error handling, prefilled user data, and transactional email delivery.
  - **Header & Navigation**: Sticky blur header with mobile hamburger menu, active navigation state, user profile avatar badge, and sign-in modal trigger.
  - **Footer**: Brand links, quick navigation, service direct links, direct contact email, and copyright.
- **User Authentication**:
  - **Google OAuth**: One-click Google sign-in with profile metadata sync.
  - **Email / Password**: Secure sign up & sign in flows with email verification support.
  - **Mobile OTP (SMS)**: Phone number entry with country code validation and 6-digit OTP verification.
- **User Data Storage**:
  - Supabase `profiles` table storing required user data: `name`, `email`, and `phone`.
  - Automatic new user provisioning trigger syncing `auth.users` to `public.profiles`.
  - Profile completion modal (`ProfileModal`) that prompts users for missing fields (such as phone number after Google OAuth).
  - Strict Row Level Security (RLS) policies ensuring users can only read and modify their own records.
- **Working Contact System**:
  - Secure API route (`/api/contact`) validating name, email, phone, and project description.
  - Transactional email dispatch via **Resend** to the client's configured destination address (`CONTACT_EMAIL`).
  - Fallback safe logging mode when keys are not yet configured, preventing local crashes.
  - Optional automated audit persistence in Supabase `contact_inquiries` table.

---

## 2. Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Styling**: Vanilla CSS Modules with custom design tokens (`globals.css`)
- **Authentication & Database**: [Supabase](https://supabase.com/) (`@supabase/ssr`, `@supabase/supabase-js`)
- **Transactional Email**: [Resend](https://resend.com/) (`resend`)
- **Language**: TypeScript

---

## 3. Database Structure

The database schema is defined in [`supabase/schema.sql`](./supabase/schema.sql).

### `public.profiles` Table
| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | References `auth.users(id)` with cascading delete |
| `name` | `text` | Full name of the user |
| `email` | `text` | User's email / Gmail address |
| `phone` | `text` | User's verified phone number |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last profile update timestamp |

### Security & Row Level Security (RLS)
- **RLS Enabled**: Yes
- `Users can view own profile`: `auth.uid() = id`
- `Users can insert own profile`: `auth.uid() = id`
- `Users can update own profile`: `auth.uid() = id`

### Automated Trigger
`public.handle_new_user()` runs after every `insert` on `auth.users` and automatically populates the `public.profiles` row with initial metadata (name, email, phone).

### `public.contact_inquiries` Table
Stores contact submissions as an audit trail backup:
- `id` (`uuid`, primary key)
- `name` (`text`)
- `email` (`text`)
- `phone` (`text`)
- `message` (`text`)
- `user_id` (`uuid`, optional foreign key)
- `created_at` (`timestamptz`)

---

## 4. Authentication Flow

1. User clicks **Sign In** in the header.
2. The user is presented with three options:
   - **Continue with Google**: Redirects to Google consent screen via Supabase OAuth; returns to `/auth/callback`, provisions profile, and opens `ProfileModal` if phone number is not yet provided.
   - **Continue with Email**: Allows immediate sign-in or account registration with name, email, and password.
   - **Continue with Mobile Number**: User enters phone with international country code; receives 6-digit SMS OTP; inputs OTP code to complete sign-in.
3. Once authenticated:
   - Header displays user avatar initial and dropdown menu.
   - Contact form automatically prefills with user's name, email, and phone.

---

## 5. Contact Email Flow

1. User or visitor navigates to the **Contact** section.
2. Form fields are validated in real-time (valid email, 7-16 digit phone, non-empty project details).
3. On submission, the form sends a POST request to `/api/contact`.
4. The server validates input and dispatches a formatted HTML notification email via Resend to `CONTACT_EMAIL`.
5. The submitter sees an immediate success confirmation banner, and the form resets.

---

## 6. Environment Variables

Create a file named `.env.local` in the project root based on `.env.local.example`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Resend Email Configuration
RESEND_API_KEY=re_your-resend-api-key-here
CONTACT_EMAIL=Upshootai@gmail.com

# Site URL (used for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 7. Manual Setup Steps

### A. Supabase Setup
1. Create a project at [supabase.com](https://supabase.com/).
2. Navigate to **SQL Editor** in the Supabase Dashboard.
3. Copy and run the script in [`supabase/schema.sql`](./supabase/schema.sql).
4. Go to **Project Settings -> API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

### B. Google OAuth Setup
1. In the Supabase Dashboard, go to **Authentication -> Providers -> Google**.
2. Create credentials in [Google Cloud Console](https://console.cloud.google.com/):
   - Set Authorized redirect URI to: `https://<your-project>.supabase.co/auth/v1/callback`
3. Paste Google Client ID and Secret into Supabase and save.
4. In **Authentication -> URL Configuration**, add `http://localhost:3000/auth/callback` (and production domain) to **Redirect URLs**.

### C. Phone (SMS OTP) Setup
1. In Supabase Dashboard, go to **Authentication -> Providers -> Phone**.
2. Select your SMS provider (Twilio, MessageBird, or Supabase Test Phone numbers).
3. Enable phone sign-in.

### D. Resend Email Setup
1. Sign up at [resend.com](https://resend.com/) and create an API Key.
2. Add `RESEND_API_KEY=re_...` to `.env.local`.
3. Set `CONTACT_EMAIL` to the client's destination email (e.g. `hello@upshootai.com`).
4. (For production) Verify your custom sending domain in Resend and update the `from:` address in [`app/api/contact/route.ts`](./app/api/contact/route.ts).

---

## 8. How to Run Locally

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Open http://localhost:3000 in your browser
```

---

## 9. How to Deploy

### Deploying on Vercel
1. Push the code to a Git repository (GitHub/GitLab).
2. Import the project into [Vercel](https://vercel.com).
3. In Project Settings -> Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL`
   - `NEXT_PUBLIC_SITE_URL` (set to your production domain: `https://your-domain.com`)
4. Deploy.

---

## 10. Summary of Client Decisions / Next Steps

1. **Email Domain Verification**: In Resend, verify the custom sender domain (`upshootai.com`) to send emails directly from `notifications@upshootai.com`.
2. **SMS Provider Selection**: Select preferred SMS vendor (Twilio or MessageBird) in Supabase Auth settings for live SMS delivery.
3. **Google Cloud Project**: Register client Google Cloud OAuth Client ID for production.
