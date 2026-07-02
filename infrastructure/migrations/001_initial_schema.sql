-- 001_initial_schema.sql

-- Tenancy & Identity
CREATE TABLE workspaces (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  tier            TEXT NOT NULL CHECK (tier IN ('starter','pro','enterprise')),
  region          TEXT NOT NULL,                    -- data-residency
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ,                      -- soft delete
  encryption_key_ref TEXT NOT NULL                  -- KMS key reference, niet de key zelf
);

-- Placeholder for users table (referenced by decisions)
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id),
  email           TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Canonical & External
CREATE TABLE canonical_entities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id),
  entity_type     TEXT NOT NULL CHECK (entity_type IN ('campaign','deal','contact','budget_line')),
  display_name    TEXT NOT NULL,
  attributes      JSONB NOT NULL DEFAULT '{}'::jsonb,
  current_state   JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  version         BIGINT NOT NULL DEFAULT 1         -- optimistic locking
);
CREATE INDEX idx_ce_workspace_type ON canonical_entities(workspace_id, entity_type);
-- ALTER TABLE canonical_entities ENABLE ROW LEVEL SECURITY;

-- AI Layer
CREATE TABLE proposals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id),
  entity_id       UUID NOT NULL REFERENCES canonical_entities(id),
  proposed_change JSONB NOT NULL,
  reasoning       TEXT NOT NULL,                    -- door model gegenereerde rationale
  model_ref       TEXT NOT NULL,                    -- provider+model+version
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','rejected','expired')),
  expires_at      TIMESTAMPTZ NOT NULL,             -- voorkomt stale auto-execution
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Decision Ledger
CREATE TABLE decisions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id),
  actor_id        UUID NOT NULL REFERENCES users(id),
  entity_id       UUID NOT NULL REFERENCES canonical_entities(id),
  action_type     TEXT NOT NULL,                    -- 'state_change','attribute_update','link','unlink'
  before_state    JSONB NOT NULL,
  after_state     JSONB NOT NULL,
  rationale       TEXT NOT NULL CHECK (length(rationale) >= 10),
  source          TEXT NOT NULL CHECK (source IN ('user','ai_approved')),
  proposal_id     UUID REFERENCES proposals(id),    -- indien voortkomend uit AI-voorstel
  hash_prev       TEXT,                             -- hash van vorige decision (chain)
  hash_self       TEXT NOT NULL,                    -- SHA-256 van canonicalized payload
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Append-only: GEEN UPDATE of DELETE rights voor application role
-- REVOKE UPDATE, DELETE ON decisions FROM application_role;
