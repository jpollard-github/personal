CREATE TABLE IF NOT EXISTS guestbook_entries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  email TEXT,
  category TEXT NOT NULL CHECK (
    category IN ('music', 'arcade', 'cat', 'twin-peaks', 'site-note', 'other')
  ),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 3 AND 500),
  notify_owner BOOLEAN NOT NULL DEFAULT false,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'approved', 'rejected')
  ),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS guestbook_entries_created_at_idx
ON guestbook_entries (created_at DESC);

CREATE TABLE IF NOT EXISTS guestbook_rate_limits (
  ip_hash TEXT PRIMARY KEY,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  submissions INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS guestbook_rate_limits_updated_at_idx
ON guestbook_rate_limits (updated_at DESC);
