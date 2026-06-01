-- ============================================================
-- SD Digital Hub — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ── BLOGS TABLE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blogs (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  category         TEXT,
  featured_image   TEXT,
  image_alt        TEXT,
  content          TEXT,
  seo_title        TEXT,
  meta_description TEXT,
  focus_keyword    TEXT,
  canonical_url    TEXT,
  meta_robots      TEXT DEFAULT 'index, follow',
  status           TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── CONTACT FORMS TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_forms (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  subject    TEXT,
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CALL REQUESTS TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS call_requests (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name           TEXT NOT NULL,
  email          TEXT,
  phone          TEXT NOT NULL,
  preferred_time TEXT,
  service        TEXT,
  message        TEXT,
  status         TEXT DEFAULT 'new' CHECK (status IN ('new', 'pending', 'completed', 'cancelled')),
  is_read        BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── SUBSCRIBERS TABLE ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  status        TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE blogs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_forms  ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers    ENABLE ROW LEVEL SECURITY;

-- Authenticated users (admins) have full access
CREATE POLICY "Admin full access - blogs"
  ON blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access - contact_forms"
  ON contact_forms FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access - call_requests"
  ON call_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access - subscribers"
  ON subscribers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public can read published blogs
CREATE POLICY "Public read published blogs"
  ON blogs FOR SELECT TO anon USING (status = 'published');

-- Public can insert contact forms, call requests, subscribers
CREATE POLICY "Public can submit contact forms"
  ON contact_forms FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Public can submit call requests"
  ON call_requests FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Public can subscribe"
  ON subscribers FOR INSERT TO anon WITH CHECK (true);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_blogs_slug       ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status     ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_created    ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contact_forms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_created    ON call_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subs_email       ON subscribers(email);
