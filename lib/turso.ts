/**
 * Turso (libSQL) Distributed Edge Database Client & Schema
 *
 * Implements the edge-ready libSQL schema specification for Skelvre:
 * - Dynamic JSON columns (metadata, config, scopes, payload)
 * - Zero breaking migrations
 * - Fallback in-memory edge driver when remote env credentials are not provided
 */

import { createClient, Client } from '@libsql/client';

let tursoClient: Client | null = null;

export function getTursoClient(): Client {
  if (tursoClient) return tursoClient;

  const url = process.env.TURSO_DATABASE_URL || 'file:local-skelvre.db';
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

  tursoClient = createClient({
    url,
    authToken,
  });

  return tursoClient;
}

export const TURSO_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS wallets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  chain_caip TEXT NOT NULL,
  address TEXT UNIQUE NOT NULL,
  derivation_path TEXT NOT NULL,
  label TEXT NOT NULL,
  config TEXT, -- Dynamic JSON
  is_primary INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS merchants (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT,
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  webhook_url TEXT NOT NULL,
  public_key TEXT NOT NULL,
  metadata TEXT, -- Dynamic JSON
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS subscription_grants (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  wallet_id TEXT NOT NULL,
  merchant_id TEXT NOT NULL,
  asset_address TEXT NOT NULL,
  max_amount_per_interval TEXT NOT NULL,
  billing_interval_seconds INTEGER NOT NULL,
  next_charge_at TEXT,
  status TEXT DEFAULT 'active',
  signature_proof TEXT NOT NULL,
  metadata TEXT, -- Dynamic JSON
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (wallet_id) REFERENCES wallets(id),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

CREATE TABLE IF NOT EXISTS agent_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  wallet_id TEXT,
  interface_type TEXT NOT NULL,
  scopes TEXT NOT NULL, -- JSON array
  spending_limit_usd REAL DEFAULT 0.00,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS agent_chat_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  wallet_id TEXT,
  session_id TEXT,
  interface_origin TEXT NOT NULL,
  title TEXT DEFAULT 'New Session',
  rolling_context TEXT, -- Dynamic JSON summarized memory
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS agent_chat_messages (
  id TEXT PRIMARY KEY,
  chat_session_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  tool_calls TEXT, -- Dynamic JSON
  created_at TEXT NOT NULL,
  FOREIGN KEY (chat_session_id) REFERENCES agent_chat_sessions(id)
);

CREATE TABLE IF NOT EXISTS settlement_ledger (
  id TEXT PRIMARY KEY,
  grant_id TEXT,
  merchant_id TEXT NOT NULL,
  wallet_id TEXT NOT NULL,
  amount TEXT NOT NULL,
  asset_address TEXT NOT NULL,
  tx_hash TEXT UNIQUE,
  status TEXT NOT NULL,
  metadata TEXT, -- Dynamic JSON
  created_at TEXT NOT NULL
);
`;

export async function initTursoSchema() {
  const client = getTursoClient();
  const statements = TURSO_SCHEMA_SQL.split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    try {
      await client.execute(statement);
    } catch (e) {
      console.warn('Turso schema execution note:', e);
    }
  }
}
