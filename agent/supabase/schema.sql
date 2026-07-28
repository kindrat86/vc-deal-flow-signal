-- Signal Analyst Agent — State & Memory Tables
-- Run this in your Supabase SQL editor to set up the agent's persistence layer.

-- Agent lifecycle state (single row, upserted)
CREATE TABLE IF NOT EXISTS agent_state (
  id          integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  status      text NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'paused', 'error')),
  cycle       text NOT NULL DEFAULT 'weekly',  -- 'weekly' | 'midweek' | 'manual'
  last_run_at timestamptz,
  next_run_at timestamptz,
  last_error  text,
  config      jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Bootstrap the single row
INSERT INTO agent_state (id, status) VALUES (1, 'idle')
ON CONFLICT (id) DO NOTHING;

-- Per-startup signal history for week-over-week tracking
CREATE TABLE IF NOT EXISTS agent_signals (
  id              bigserial PRIMARY KEY,
  name            text NOT NULL,
  name_norm       text NOT NULL,  -- normalized name for dedup
  sector          text NOT NULL,
  stage           text,
  geography       text,
  signal_type     text NOT NULL,
  acceleration_score  integer NOT NULL DEFAULT 0,
  commit_velocity_14d  integer NOT NULL DEFAULT 0,
  commit_velocity_change text,
  contributors    integer NOT NULL DEFAULT 0,
  contributor_growth  text,
  new_repos       integer NOT NULL DEFAULT 0,
  github_url      text,
  website_url     text,
  description     text,
  first_seen_at   timestamptz NOT NULL DEFAULT now(),
  last_seen_at    timestamptz NOT NULL DEFAULT now(),
  is_active       boolean NOT NULL DEFAULT true,
  raw_data        jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_signals_name_norm ON agent_signals (name_norm);
CREATE INDEX IF NOT EXISTS idx_agent_signals_sector ON agent_signals (sector);
CREATE INDEX IF NOT EXISTS idx_agent_signals_active ON agent_signals (is_active, last_seen_at DESC);

-- Generated briefs
CREATE TABLE IF NOT EXISTS agent_briefs (
  id              bigserial PRIMARY KEY,
  cycle           text NOT NULL,  -- 'weekly' | 'midweek' | 'manual'
  title           text NOT NULL,
  summary         text,
  highlights      jsonb NOT NULL DEFAULT '[]',  -- top startup briefs
  full_content    text,
  content_html    text,
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'published', 'discarded')),
  published_at    timestamptz,
  delivery_method text[] DEFAULT '{}',  -- e.g. {'email', 'telegram'}
  meta            jsonb NOT NULL DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Audit log of every agent decision
CREATE TABLE IF NOT EXISTS agent_decisions (
  id            bigserial PRIMARY KEY,
  decision_type text NOT NULL,  -- 'publish_brief' | 'classify_signal' | 'send_alert' | 'discard'
  entity_type   text,           -- 'brief' | 'startup'
  entity_id     bigint,
  action        text NOT NULL,
  rationale     text,
  detail        jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Pending approvals queue
CREATE TABLE IF NOT EXISTS agent_approvals (
  id            bigserial PRIMARY KEY,
  approval_type text NOT NULL,  -- 'publish_brief' | 'new_startup' | 'signal_alert'
  entity_id     bigint NOT NULL,
  entity_type   text NOT NULL,
  summary       text NOT NULL,
  detail        jsonb,
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  resolved_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Weekly cycle execution log
CREATE TABLE IF NOT EXISTS agent_cycles (
  id            bigserial PRIMARY KEY,
  cycle_type    text NOT NULL,  -- 'weekly' | 'midweek' | 'manual'
  status        text NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'monitoring', 'analyzing', 'briefing', 'publishing', 'completed', 'failed')),
  signals_count integer DEFAULT 0,
  new_signals   integer DEFAULT 0,
  briefs_count  integer DEFAULT 0,
  started_at    timestamptz NOT NULL DEFAULT now(),
  completed_at  timestamptz,
  error_message text,
  log           jsonb DEFAULT '[]'
);
