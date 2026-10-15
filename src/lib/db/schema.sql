-- ==============================================================================
-- KADI PRODUCTION POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Target: PostgreSQL 14+ / Supabase / Neon
-- ==============================================================================

-- Enable UUID & Crypto extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. USERS & HOST WORKSPACES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'host' CHECK (role IN ('host', 'planner', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ------------------------------------------------------------------------------
-- 2. EVENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  template_id VARCHAR(100) NOT NULL DEFAULT 'savannah-twilight',
  template_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
  hosts TEXT NOT NULL,
  celebrants TEXT NOT NULL,
  date VARCHAR(100) NOT NULL,
  time VARCHAR(100) NOT NULL,
  timezone VARCHAR(100) NOT NULL DEFAULT 'Africa/Nairobi',
  venue VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100) NOT NULL DEFAULT 'Nairobi',
  directions_note TEXT,
  dress_code TEXT,
  story TEXT,
  hero_image TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  rsvp_deadline VARCHAR(100) NOT NULL,
  max_capacity INTEGER,
  allows_children BOOLEAN DEFAULT true,
  audio_url TEXT,
  countdown_label VARCHAR(100),
  mpesa_type VARCHAR(20) CHECK (mpesa_type IN ('till', 'paybill', 'send_money')),
  mpesa_number VARCHAR(50),
  mpesa_recipient VARCHAR(255),
  mpesa_reference VARCHAR(100),
  our_story_milestones JSONB DEFAULT '[]'::jsonb,
  ceremony_details JSONB,
  reception_details JSONB,
  programme_schedule JSONB DEFAULT '[]'::jsonb,
  faq_items JSONB DEFAULT '[]'::jsonb,
  birthday_about JSONB,
  birthday_activities JSONB DEFAULT '[]'::jsonb,
  birthday_menu JSONB,
  memorial_obituary JSONB,
  memorial_services JSONB DEFAULT '[]'::jsonb,
  memorial_order_of_service JSONB DEFAULT '[]'::jsonb,
  virtual_candles_count INTEGER DEFAULT 0,
  livestream_url TEXT,
  livestream_status VARCHAR(20) DEFAULT 'none',
  blocks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_host_id ON events(host_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- ------------------------------------------------------------------------------
-- 3. EVENT DESIGNS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_designs (
  event_id UUID PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,
  motion_preset VARCHAR(50) NOT NULL DEFAULT 'classic-stationery',
  palette JSONB NOT NULL,
  liner_id VARCHAR(100) NOT NULL DEFAULT 'gold-foil',
  seal_shape VARCHAR(50) NOT NULL DEFAULT 'diamond' CHECK (seal_shape IN ('circle', 'diamond', 'shield')),
  seal_monogram VARCHAR(10) NOT NULL DEFAULT 'K',
  seal_color VARCHAR(50) NOT NULL DEFAULT '#D4AF37',
  visible_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  section_order JSONB,
  font_family VARCHAR(100),
  envelope_style VARCHAR(50) DEFAULT 'classic-fold',
  letter_style VARCHAR(50) DEFAULT 'printed-letter',
  background_animation VARCHAR(50) DEFAULT 'none',
  scroll_animation VARCHAR(50) DEFAULT 'none',
  transition_speed VARCHAR(20) DEFAULT 'medium',
  layout_spacing VARCHAR(20) DEFAULT 'comfortable',
  card_padding VARCHAR(20) DEFAULT 'normal',
  countdown_label VARCHAR(100),
  blocks JSONB,
  typography JSONB,
  layout_preset JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. GUEST HOUSEHOLDS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS guest_households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  display_name VARCHAR(255) NOT NULL,
  guest_group VARCHAR(100) NOT NULL DEFAULT 'Guests',
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255),
  allowed_plus_ones INTEGER NOT NULL DEFAULT 1 CHECK (allowed_plus_ones >= 0 AND allowed_plus_ones <= 20),
  token VARCHAR(100) NOT NULL,
  token_hash VARCHAR(128) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('yes', 'no', 'maybe', 'pending', 'attending')),
  notes TEXT,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guest_households_event_id ON guest_households(event_id);
CREATE INDEX IF NOT EXISTS idx_guest_households_token_hash ON guest_households(token_hash);

-- ------------------------------------------------------------------------------
-- 5. ATTENDEES (Named Individuals in Household)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES guest_households(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'attending',
  meal_preference VARCHAR(100),
  dietary_restrictions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendees_household_id ON attendees(household_id);
CREATE INDEX IF NOT EXISTS idx_attendees_event_id ON attendees(event_id);

-- ------------------------------------------------------------------------------
-- 6. RSVP SUBMISSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rsvp_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  household_id UUID REFERENCES guest_households(id) ON DELETE SET NULL,
  primary_name VARCHAR(255) NOT NULL,
  contact VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('yes', 'no', 'maybe')),
  attendee_count INTEGER NOT NULL DEFAULT 1 CHECK (attendee_count >= 1),
  dietary_requirements TEXT,
  song_request TEXT,
  note_to_host TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvp_submissions_event_id ON rsvp_submissions(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_submissions_household_id ON rsvp_submissions(household_id);

-- ------------------------------------------------------------------------------
-- 7. CONDOLENCES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS condolences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  author VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_condolences_event_id ON condolences(event_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_households ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE condolences ENABLE ROW LEVEL SECURITY;

-- 1. USERS POLICIES
CREATE POLICY "Users can view and edit their own profile"
  ON users FOR ALL
  USING (auth.uid() = id);

-- 2. EVENTS POLICIES
-- Hosts have full access to their own events
CREATE POLICY "Hosts can manage their own events"
  ON events FOR ALL
  USING (auth.uid() = host_id);

-- Public can read published events
CREATE POLICY "Public can view published events"
  ON events FOR SELECT
  USING (status = 'published');

-- 3. EVENT DESIGNS POLICIES
CREATE POLICY "Hosts can manage their event designs"
  ON event_designs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events WHERE events.id = event_designs.event_id AND events.host_id = auth.uid()
    )
  );

CREATE POLICY "Public can view designs for published events"
  ON event_designs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events WHERE events.id = event_designs.event_id AND events.status = 'published'
    )
  );

-- 4. GUEST HOUSEHOLDS POLICIES
CREATE POLICY "Hosts can manage guest households"
  ON guest_households FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events WHERE events.id = guest_households.event_id AND events.host_id = auth.uid()
    )
  );

-- 5. ATTENDEES POLICIES
CREATE POLICY "Hosts can view and manage attendees"
  ON attendees FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events WHERE events.id = attendees.event_id AND events.host_id = auth.uid()
    )
  );

-- 6. RSVP SUBMISSIONS POLICIES
CREATE POLICY "Hosts can view all RSVPs"
  ON rsvp_submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events WHERE events.id = rsvp_submissions.event_id AND events.host_id = auth.uid()
    )
  );

-- Public guests can submit an RSVP
CREATE POLICY "Public guests can submit RSVPs"
  ON rsvp_submissions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events WHERE events.id = rsvp_submissions.event_id AND events.status = 'published'
    )
  );

-- 7. CONDOLENCES POLICIES
CREATE POLICY "Hosts can manage condolences"
  ON condolences FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events WHERE events.id = condolences.event_id AND events.host_id = auth.uid()
    )
  );

CREATE POLICY "Public can view approved condolences"
  ON condolences FOR SELECT
  USING (
    status = 'approved' AND EXISTS (
      SELECT 1 FROM events WHERE events.id = condolences.event_id AND events.status = 'published'
    )
  );

CREATE POLICY "Public can post condolences"
  ON condolences FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events WHERE events.id = condolences.event_id AND events.status = 'published'
    )
  );
