CREATE TABLE IF NOT EXISTS watchlist_items (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  startup_name TEXT NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_signal_type TEXT,
  last_velocity_change NUMERIC,
  last_notified_at TIMESTAMPTZ,
  alert_on_accelerating BOOLEAN DEFAULT TRUE,
  alert_on_new_peak BOOLEAN DEFAULT TRUE,
  UNIQUE (email, startup_name)
);
CREATE INDEX IF NOT EXISTS watchlist_items_email_idx ON watchlist_items (email);
