import Dexie, { type Table } from 'dexie';
import {
  User,
  Wallet,
  Merchant,
  SubscriptionGrant,
  AgentSession,
  AgentChatSession,
  SettlementLedgerEntry,
  SecurityGuardrails,
  ProjectRoadmapItem,
} from './types';
import { INITIAL_MERCHANTS, INITIAL_GUARDRAILS, INITIAL_ROADMAPS } from './mock-data';

export interface SyncQueueItem {
  id?: number;
  table: string;
  action: 'insert' | 'update' | 'delete';
  recordId: string;
  payload: any;
  status: 'pending' | 'synced' | 'failed';
  errorMessage?: string;
  createdAt: string;
  syncedAt?: string;
}

export interface SystemMetaItem {
  key: string;
  value: any;
  updatedAt: string;
}

export class SkelvreLocalDatabase extends Dexie {
  users!: Table<User, string>;
  wallets!: Table<Wallet, string>;
  merchants!: Table<Merchant, string>;
  grants!: Table<SubscriptionGrant, string>;
  agentSessions!: Table<AgentSession, string>;
  chatSessions!: Table<AgentChatSession, string>;
  ledger!: Table<SettlementLedgerEntry, string>;
  guardrails!: Table<SecurityGuardrails & { id: string }, string>;
  roadmaps!: Table<ProjectRoadmapItem, string>;
  syncQueue!: Table<SyncQueueItem, number>;
  systemMeta!: Table<SystemMetaItem, string>;

  constructor() {
    super('SkelvreOfflineDB_v1');

    this.version(1).stores({
      users: 'id, authMethod, primaryAddress, createdAt',
      wallets: 'id, userId, chainCaip, address, isPrimary, createdAt',
      merchants: 'id, ownerUserId, domain, status, createdAt',
      grants: 'id, userId, walletId, merchantId, status, nextChargeAt, createdAt',
      agentSessions: 'id, userId, walletId, interfaceType, tokenHash, expiresAt, createdAt',
      chatSessions: 'id, userId, walletId, interfaceOrigin, status, updatedAt',
      ledger: 'id, grantId, merchantId, walletId, chainCaip, status, createdAt',
      guardrails: 'id',
      syncQueue: '++id, table, action, recordId, status, createdAt',
      systemMeta: 'key, updatedAt',
    });

    this.version(2).stores({
      users: 'id, authMethod, primaryAddress, createdAt',
      wallets: 'id, userId, chainCaip, address, isPrimary, createdAt',
      merchants: 'id, ownerUserId, domain, status, createdAt',
      grants: 'id, userId, walletId, merchantId, status, nextChargeAt, createdAt',
      agentSessions: 'id, userId, walletId, interfaceType, tokenHash, expiresAt, createdAt',
      chatSessions: 'id, userId, walletId, interfaceOrigin, status, updatedAt',
      ledger: 'id, grantId, merchantId, walletId, chainCaip, status, createdAt',
      guardrails: 'id',
      roadmaps: 'id, projectId, status, priority, quarter, createdAt',
      syncQueue: '++id, table, action, recordId, status, createdAt',
      systemMeta: 'key, updatedAt',
    });
  }

  /**
   * Initializes default local offline state if empty
   */
  async seedIfEmpty(): Promise<void> {
    const merchantCount = await this.merchants.count();
    if (merchantCount === 0) {
      await this.merchants.bulkAdd(INITIAL_MERCHANTS);
    }

    const roadmapCount = await this.roadmaps.count();
    if (roadmapCount === 0) {
      await this.roadmaps.bulkAdd(INITIAL_ROADMAPS);
    }

    const guardrailRecord = await this.guardrails.get('default');
    if (!guardrailRecord) {
      await this.guardrails.put({
        id: 'default',
        ...INITIAL_GUARDRAILS,
      });
    }

    const mode = await this.systemMeta.get('mode');
    if (!mode) {
      await this.systemMeta.put({
        key: 'mode',
        value: 'offline_first',
        updatedAt: new Date().toISOString(),
      });
    }
  }

  /**
   * Enqueues an offline mutation to syncQueue for optional remote synchronization
   */
  async queueSync(table: string, action: 'insert' | 'update' | 'delete', recordId: string, payload: any): Promise<void> {
    try {
      await this.syncQueue.add({
        table,
        action,
        recordId,
        payload,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Queue sync record note:', e);
    }
  }
}

export const db = new SkelvreLocalDatabase();

// Automatically seed defaults on first client load
if (typeof window !== 'undefined') {
  db.seedIfEmpty().catch((err) => console.warn('Offline DB seed warning:', err));
}
