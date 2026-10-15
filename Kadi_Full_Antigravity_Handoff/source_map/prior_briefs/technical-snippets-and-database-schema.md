# Kadi — Technical Snippets and Original Database Schema

---

# Appendix A — Technical snippets and starter schema retained from the original brainstorm

This appendix preserves the actual code-oriented examples from the original `Pasted text.txt` source so that they are not lost in the more complete product blueprint. These are **starter examples, not production-ready code**. The data model and endpoints must be reconciled with the final chosen stack, reviewed for security, migrated safely, and covered by tests before use. In particular, the original schema has design limitations described after the SQL listing.

## A1. Template configuration example (JSON)

```json
{
  "id": "wedding-elegant-floral",
  "name": "Elegant Floral",
  "category": "wedding",
  "thumbnail": "/templates/wedding-elegant-floral/thumb.jpg",
  "colors": {
    "primary": "#E85D75",
    "secondary": "#F5E6E8",
    "accent": "#F5B942",
    "text": "#1A1A2E",
    "background": "#FFF8F5"
  },
  "fonts": {
    "heading": "Playfair Display",
    "body": "Inter",
    "script": "Great Vibes"
  },
  "animations": {
    "envelope": "floral-bloom",
    "background": "floating-petals",
    "entrance": "fade-up"
  },
  "sections": [
    { "type": "hero", "layout": "full-photo", "required": true },
    { "type": "couple", "layout": "two-column", "required": true },
    { "type": "story", "layout": "timeline", "required": false },
    { "type": "ceremony", "layout": "card", "required": true },
    { "type": "reception", "layout": "card", "required": true },
    { "type": "program", "layout": "timeline", "required": false },
    { "type": "registry", "layout": "card", "required": false },
    { "type": "gallery", "layout": "grid", "required": false },
    { "type": "rsvp", "layout": "form", "required": true },
    { "type": "faq", "layout": "accordion", "required": false }
  ],
  "music": {
    "default": "/templates/wedding-elegant-floral/music.mp3",
    "options": ["Canon in D", "Perfect", "A Thousand Years"]
  }
}
```

## A2. Loading-state CSS examples

### Skeleton shimmer
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
```

### Spinner
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top-color: #6B4EFF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

### Progress bar
```css
.progress-bar {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6B4EFF, #F5B942);
  transition: width 0.3s ease;
}
```

### Loading dots
```css
@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
}
.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
```

## A3. Reduced-motion and screen-reader examples

### Reduced motion (CSS)
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .confetti, .petals, .balloons {
    display: none;
  }
}
```

### Screen-reader announcement (HTML)
```html
<div aria-live="polite" aria-atomic="true">
  <!-- "RSVP submitted successfully" -->
</div>
```

## A4. Security-header example

The following original header list is illustrative; validate the final Content Security Policy against actual assets, providers, embeds and deployment configuration. Do not copy a policy that breaks required functionality.

```text
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=()
```

## A5. Original SQL database schema

The following is the SQL starter schema from the original brainstorm, preserved for reference. It is not asserted to be production-ready or to match a selected ORM. Review it before converting it into versioned migrations.

```sql
-- Users (hosts)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'host', -- host, planner, admin
  plan VARCHAR(20) DEFAULT 'free', -- free, pro, business
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(20) NOT NULL, -- wedding, birthday, funeral, custom
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  end_date DATE,
  venue_name VARCHAR(255),
  venue_address TEXT,
  venue_lat DECIMAL(10, 8),
  venue_lng DECIMAL(11, 8),
  template_id VARCHAR(100),
  design JSONB DEFAULT '{}',
  music_url TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR(255),
  rsvp_deadline DATE,
  status VARCHAR(20) DEFAULT 'draft', -- draft, active, completed, cancelled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Event Sections (customizable content blocks)
CREATE TABLE event_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  section_type VARCHAR(50) NOT NULL, -- hero, story, ceremony, etc.
  title VARCHAR(255),
  content JSONB DEFAULT '{}',
  display_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Guests
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  display_name VARCHAR(255) NOT NULL,
  is_couple BOOLEAN DEFAULT FALSE,
  partner_1_name VARCHAR(255),
  partner_2_name VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  group_name VARCHAR(100),
  plus_ones_allowed INT DEFAULT 0,
  personal_note TEXT,
  unique_token VARCHAR(64) UNIQUE NOT NULL,
  rsvp_status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, declined, maybe
  rsvp_attending_count INT DEFAULT 0,
  rsvp_meal_1 VARCHAR(50),
  rsvp_meal_2 VARCHAR(50),
  rsvp_dietary TEXT,
  rsvp_song_request TEXT,
  rsvp_message TEXT,
  rsvp_at TIMESTAMP,
  contribution_total DECIMAL(12, 2) DEFAULT 0,
  invitation_sent_at TIMESTAMP,
  invitation_opened_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Guest Groups
CREATE TABLE guest_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT NOW()
);

-- RSVP Responses (detailed)
CREATE TABLE rsvp_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  question_id UUID,
  answer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RSVP Questions (custom)
CREATE TABLE rsvp_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) NOT NULL, -- text, select, checkbox, radio
  options JSONB DEFAULT '[]',
  is_required BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contributions
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id),
  contributor_name VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  mpesa_receipt VARCHAR(50),
  mpesa_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, reversed
  failure_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Payouts
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES users(id),
  event_id UUID REFERENCES events(id),
  amount DECIMAL(12, 2) NOT NULL,
  fee DECIMAL(12, 2) NOT NULL,
  net_amount DECIMAL(12, 2) NOT NULL,
  mpesa_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
  failure_reason TEXT,
  requested_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- WhatsApp Messages
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id),
  template_name VARCHAR(100),
  message_body TEXT,
  whatsapp_message_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'queued', -- queued, sent, delivered, read, failed
  failure_reason TEXT,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Condolences (funeral)
CREATE TABLE condolences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id),
  author_name VARCHAR(255),
  message TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Virtual Candles (funeral)
CREATE TABLE virtual_candles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id),
  lit_at TIMESTAMP DEFAULT NOW()
);

-- Photos
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES guests(id),
  url TEXT NOT NULL,
  caption TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  body TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Templates
CREATE TABLE templates (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  thumbnail_url TEXT,
  config JSONB NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL, -- active, past_due, cancelled, expired
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  status VARCHAR(20) NOT NULL, -- paid, pending, failed
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Team Members (B2B)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  member_id UUID REFERENCES users(id),
  role VARCHAR(20) NOT NULL, -- admin, editor, viewer
  created_at TIMESTAMP DEFAULT NOW()
);

-- API Keys (B2B)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(100),
  key_hash VARCHAR(255) NOT NULL,
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_host ON events(host_id);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_guests_event ON guests(event_id);
CREATE INDEX idx_guests_token ON guests(unique_token);
CREATE INDEX idx_guests_phone ON guests(phone);
CREATE INDEX idx_contributions_event ON contributions(event_id);
CREATE INDEX idx_contributions_status ON contributions(status);
CREATE INDEX idx_whatsapp_event ON whatsapp_messages(event_id);
CREATE INDEX idx_whatsapp_status ON whatsapp_messages(status);
CREATE INDEX idx_condolences_event ON condolences(event_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_created ON audit_log(created_at);
```

### Required review items before using this SQL

1. The original `events.host_id`, several required relationship IDs, and other foreign keys are not consistently declared `NOT NULL`; choose nullability intentionally.
2. `rsvp_responses.question_id` is not declared as a foreign key to `rsvp_questions`, and uniqueness rules for responses are missing.
3. The guest design has couple-specific fields (`partner_1_name`, `partner_2_name`, `rsvp_meal_1`, `rsvp_meal_2`) but does not robustly model arbitrary household attendees, children, plus-ones or per-person dietary needs. A normalised attendee/household model is safer.
4. `guests.unique_token` is stored in plaintext and has no explicit expiry/revocation design. Prefer high-entropy token secrets stored as hashes, with expiry and revocation support where appropriate.
5. `contributions` and `payouts` need provider request/checkout identifiers, idempotency keys, currency/amount consistency rules, event history, reconciliation state, and unique provider receipt constraints. Do not trust client status or a browser redirect as proof of payment.
6. The current cascade delete from events to guests and contributions can destroy records needed for financial reconciliation or lawful record keeping. Define soft-delete/anonymisation and retention policies separately.
7. `users.role`, `users.plan`, and `team_members.role` as strings need constrained values or reference tables; admin privileges require stronger separation than a user-editable role column.
8. Authentication methods need a consistent identity model if phone OTP, email/password, Google OAuth, and magic links are all supported. Do not store unusable or unnecessary password/2FA secrets.
9. Consent and suppression records are absent. Add records for messaging consent, withdrawals/opt-outs, consent source/timestamp/purpose, privacy requests and relevant audit history.
10. Templates need versioning and compatibility information so published invitations do not break when the template is updated. Uploaded media needs ownership, validation, moderation status where relevant, and retention rules.
11. Add suitable CHECK constraints, indexes, uniqueness constraints, transaction boundaries, and database tests after the final domain model is decided.
12. Store timestamps consistently (normally UTC `timestamptz` in PostgreSQL); render event times in the event's intended timezone.

## A6. Original API endpoint outline

This endpoint list is retained from the source. The final API may use route handlers or server actions according to the chosen architecture, but every operation must have explicit validation, authorisation, rate limiting where appropriate, pagination, idempotency and error semantics. Webhooks must be server-to-server endpoints and must not be confused with host- or guest-facing requests.

```text
Auth
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/otp/send
POST   /api/auth/otp/verify
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

Events
GET    /api/events
POST   /api/events
GET    /api/events/:id
PATCH  /api/events/:id
DELETE /api/events/:id
POST   /api/events/:id/duplicate
GET    /api/events/:id/preview

Guests
GET    /api/events/:id/guests
POST   /api/events/:id/guests
PATCH  /api/events/:id/guests/:guestId
DELETE /api/events/:id/guests/:guestId
POST   /api/events/:id/guests/import
POST   /api/events/:id/guests/bulk

RSVPs
GET    /api/events/:id/rsvps
GET    /api/events/:id/rsvps/export
PATCH  /api/events/:id/rsvps/:guestId

Contributions
GET    /api/events/:id/contributions
POST   /api/events/:id/contributions/initiate
POST   /api/events/:id/contributions/callback
GET    /api/events/:id/contributions/export

WhatsApp
POST   /api/events/:id/whatsapp/send
POST   /api/events/:id/whatsapp/reminder
POST   /api/events/:id/whatsapp/broadcast
GET    /api/events/:id/whatsapp/logs
POST   /api/webhooks/whatsapp

Templates
GET    /api/templates
GET    /api/templates/:id

Condolences
GET    /api/events/:id/condolences
POST   /api/events/:id/condolences
PATCH  /api/events/:id/condolences/:id/approve

Candles
POST   /api/events/:id/candles
GET    /api/events/:id/candles

Public
GET    /api/public/e/:slug
GET    /api/public/e/:slug/g/:token
POST   /api/public/e/:slug/g/:token/rsvp
POST   /api/public/e/:slug/g/:token/contribute
POST   /api/public/e/:slug/g/:token/condolence
POST   /api/public/e/:slug/g/:token/candle

Webhooks
POST   /api/webhooks/mpesa
POST   /api/webhooks/whatsapp
```

## A7. Original API response examples

### Success response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 142
  }
}
```

### Error response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid phone number",
    "field": "phone",
    "details": { ... }
  }
}
```

These response shapes are illustrative. Standardise response semantics for the selected framework; never return internal exception messages, secrets or sensitive provider payloads to a client.
