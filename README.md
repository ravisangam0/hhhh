# SD Digital Hub — Admin Panel

A lightweight, fast, and SEO-focused admin panel for managing blog posts, contact forms, call requests, and subscribers.

**Stack:** React + Vite + Supabase + Tailwind CSS

---

## Features

- ✅ Supabase Authentication (email + password)
- ✅ Dashboard with stats overview
- ✅ Blog management with TipTap rich text editor
- ✅ Full SEO panel (meta, og, canonical, robots)
- ✅ Contact forms management (mark read/unread, delete)
- ✅ Call Requests management (status tracking, mark read, delete)
- ✅ Subscribers management
- ✅ **Export CSV & JSON** — contacts, call requests, subscribers, blogs
- ✅ Dark mode support
- ✅ Fully responsive (mobile + desktop)
- ✅ Supabase RLS security

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/sd-digital-hub-admin.git
cd sd-digital-hub-admin
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the contents of `supabase-schema.sql`
3. Go to **Authentication > Users** and create your admin user
4. Copy your Project URL and anon key from **Settings > API**

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Locally

```bash
npm run dev
```

Open http://localhost:5173 and login with your Supabase admin credentials.

---

## Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click Deploy ✅

---

## Export Feature

Export data from any section using the **Export** button:

| Section        | CSV | JSON |
|---------------|-----|------|
| Contacts       | ✅  | ✅   |
| Call Requests  | ✅  | ✅   |
| Subscribers    | ✅  | ✅   |
| Blog Posts     | ✅  | ✅   |

- Exports respect active **search filters** (exports what you see)
- Files are named with today's date: `contacts_2026-06-01.csv`

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `blogs` | Blog posts with SEO fields |
| `contact_forms` | Contact form submissions |
| `call_requests` | Call back requests |
| `subscribers` | Newsletter subscribers |

---

## Folder Structure

```
src/
├── components/
│   ├── blog/
│   │   ├── RichEditor.jsx     # TipTap editor
│   │   └── SEOPanel.jsx       # SEO fields + validation
│   ├── layout/
│   │   └── Layout.jsx         # Sidebar + topbar
│   └── shared/
│       ├── ExportButton.jsx   # Reusable export dropdown
│       └── UI.jsx             # Badge, Card, Spinner, etc.
├── hooks/
│   ├── useAuth.jsx            # Auth context
│   └── useDarkMode.js         # Dark mode toggle
├── lib/
│   ├── supabase.js            # Supabase client
│   └── export.js              # CSV/JSON export utilities
└── pages/
    ├── LoginPage.jsx
    ├── DashboardPage.jsx
    ├── BlogsPage.jsx
    ├── BlogEditorPage.jsx
    ├── ContactsPage.jsx
    ├── CallRequestsPage.jsx
    └── SubscribersPage.jsx
```

---

## Security

- Supabase RLS enabled on all tables
- Admins only: create/edit/delete via authenticated session
- Public: read published blogs + submit forms only
- No hardcoded credentials — all via environment variables
