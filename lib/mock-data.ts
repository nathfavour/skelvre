import { ChainCAIP, ChainMetadata, Merchant, SubscriptionGrant, AgentSession, SettlementLedgerEntry, Wallet, User, SecurityGuardrails, AgentChatSession } from './types';

export const SUPPORTED_CHAINS: Record<ChainCAIP, ChainMetadata> = {
  'eip155:8453': {
    caip: 'eip155:8453',
    name: 'Base',
    symbol: 'ETH',
    type: 'evm',
    icon: '⚡',
    defaultRpc: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
  },
  'eip155:1': {
    caip: 'eip155:1',
    name: 'Ethereum',
    symbol: 'ETH',
    type: 'evm',
    icon: '⟠',
    defaultRpc: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
  },
  'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': {
    caip: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    name: 'Solana',
    symbol: 'SOL',
    type: 'solana',
    icon: '◎',
    defaultRpc: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io',
  },
  'eip155:42161': {
    caip: 'eip155:42161',
    name: 'Arbitrum One',
    symbol: 'ETH',
    type: 'evm',
    icon: '⚡',
    defaultRpc: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
  },
  'eip155:10': {
    caip: 'eip155:10',
    name: 'Optimism',
    symbol: 'ETH',
    type: 'evm',
    icon: '🔴',
    defaultRpc: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
  },
  'eip155:137': {
    caip: 'eip155:137',
    name: 'Polygon',
    symbol: 'POL',
    type: 'evm',
    icon: '🟣',
    defaultRpc: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
  },
};

// Pure initial state: No fake user, zero demo wallets, zero fake balances
export const INITIAL_USER: User | null = null;
export const INITIAL_WALLETS: Wallet[] = [];
export const INITIAL_GRANTS: SubscriptionGrant[] = [];
export const INITIAL_AGENT_SESSIONS: AgentSession[] = [];
export const INITIAL_LEDGER: SettlementLedgerEntry[] = [];
export const INITIAL_CHAT_SESSIONS: AgentChatSession[] = [];

// Standard registered merchant directory
export const INITIAL_MERCHANTS: Merchant[] = [
  {
    id: 'mer_deepseek_node',
    ownerUserId: 'system',
    name: 'DeepSeek Inference Router',
    domain: 'api.deepseek.network',
    webhookUrl: 'https://api.deepseek.network/webhooks/skelvre',
    publicKey: '0x49c678a1bc1b69de78a6c8e31289cfc92f15e8b0',
    metadata: {
      category: 'AI Compute & Reasoning',
      description: 'Distributed reasoning models billed per token bucket or micro-interval.',
      pricingModel: 'x402 streaming pull grant',
    },
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'mer_synthetix_stream',
    ownerUserId: 'system',
    name: 'Synthetix Oracle Feeds',
    domain: 'feeds.synthetix.io',
    webhookUrl: 'https://feeds.synthetix.io/skelvre-settlement',
    publicKey: '0x81e9fa65893a772c6de347ab5d18d890e0b92d8f',
    metadata: {
      category: 'Financial Telemetry',
      description: 'Real-world multi-asset price feed websockets and automated liquidations.',
      pricingModel: 'Recurring pull grant',
    },
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'mer_arweave_archiver',
    ownerUserId: 'system',
    name: 'Arweave Permanent Storage Enclave',
    domain: 'gateway.arweave.live',
    webhookUrl: 'https://gateway.arweave.live/skelvre/pull',
    publicKey: '0x33b879cf186a236d90ab45e317d65b706d88c2a4',
    metadata: {
      category: 'Decentralized Storage',
      description: 'Permanent agent memory snapshots and cryptographically pinned settlement trees.',
      pricingModel: 'Capped storage allowance',
    },
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'mer_cursor_mcp_hub',
    ownerUserId: 'system',
    name: 'Cursor MCP Cloud Daemon',
    domain: 'mcp.cursor.sh',
    webhookUrl: 'https://mcp.cursor.sh/api/v1/billing',
    publicKey: '0x99f781dc67bb423e86c0712a45a301ecf33019e1',
    metadata: {
      category: 'Agent Orchestration',
      description: 'Model Context Protocol server allowing IDEs to execute autonomous paid tools.',
      pricingModel: 'x402 per tool invocation',
    },
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const INITIAL_GUARDRAILS: SecurityGuardrails = {
  maxSingleTxUsd: 50.00,
  maxDailyTxUsd: 300.00,
  autoLockMinutes: 15,
  requireBiometricAlways: true,
  blockUnregisteredMerchants: true,
};

import { ProjectRoadmapItem } from './types';

export const INITIAL_ROADMAPS: ProjectRoadmapItem[] = [
  // 1. Universal Enclave Wallets Engine
  {
    id: 'rdm_wallet_backup',
    projectId: 'wallets',
    projectName: 'Universal Enclave Wallets',
    title: 'Encrypted Enclave Backup & Key Export/Import',
    description: 'AES-GCM encrypted JSON browser enclave backup and restoration with passkey encryption support.',
    status: 'in_progress',
    priority: 'critical',
    quarter: 'Q1 2025',
    progressPercent: 85,
    targetCapabilities: [
      'Export encrypted enclave key payload',
      'Import backup JSON state',
      'Passkey / password key derivation'
    ],
    actionPath: '/wallets',
    actionLabel: 'Open Enclave Wallets',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'rdm_wallet_derivation',
    projectId: 'wallets',
    projectName: 'Universal Enclave Wallets',
    title: 'Custom CAIP Derivation Path Configurator',
    description: 'Allow custom BIP-44 path specification (m/44\'/60\'/0\'/0/x, m/44\'/501\'/0\'/0\') across EVM and Solana chains.',
    status: 'in_progress',
    priority: 'high',
    quarter: 'Q1 2025',
    progressPercent: 90,
    targetCapabilities: [
      'Custom BIP-44 path input',
      'Multi-chain CAIP-2 mapping',
      'Derivation preview'
    ],
    actionPath: '/wallets',
    actionLabel: 'Configure Derivations',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-12T00:00:00.000Z',
  },
  {
    id: 'rdm_wallet_hardware',
    projectId: 'wallets',
    projectName: 'Universal Enclave Wallets',
    title: 'Hardware Enclave Relay (Ledger & WebAuthn)',
    description: 'Direct WebUSB / WebHID signing enclave bridge for high-value treasury addresses.',
    status: 'backlog',
    priority: 'medium',
    quarter: 'Q2 2025',
    progressPercent: 30,
    targetCapabilities: [
      'WebUSB Ledger transport',
      'FIDO2 WebAuthn enclave signature'
    ],
    actionPath: '/wallets',
    actionLabel: 'View Hardware Specs',
    createdAt: '2026-01-03T00:00:00.000Z',
    updatedAt: '2026-01-03T00:00:00.000Z',
  },

  // 2. Recurring Pull Subscriptions Platform
  {
    id: 'rdm_sub_batch',
    projectId: 'subscriptions',
    projectName: 'Recurring Pull Engine',
    title: 'Batch Subscription Settlement Runner',
    description: 'Single-click processing of all due EIP-712 and Ed25519 recurring pull grants with automated proof validation.',
    status: 'in_progress',
    priority: 'critical',
    quarter: 'Q1 2025',
    progressPercent: 95,
    targetCapabilities: [
      'Batch pull execution queue',
      'Gas-optimized settlement bundling',
      'Audit log generation'
    ],
    actionPath: '/subscriptions',
    actionLabel: 'Run Batch Pulls',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-14T00:00:00.000Z',
  },
  {
    id: 'rdm_sub_scaling',
    projectId: 'subscriptions',
    projectName: 'Recurring Pull Engine',
    title: 'Dynamic Scaling Cap & Grace Period Calculator',
    description: 'Interactive tool to compute dynamic usage-based scaling caps and grace period retry schedules for subscriptions.',
    status: 'in_progress',
    priority: 'high',
    quarter: 'Q1 2025',
    progressPercent: 80,
    targetCapabilities: [
      'Dynamic usage tier calculator',
      'Grace period retry rules',
      'Allowance auto-scaling'
    ],
    actionPath: '/subscriptions',
    actionLabel: 'Manage Grants',
    createdAt: '2026-01-04T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },

  // 3. MCP Agent Execution Gateway
  {
    id: 'rdm_agent_tools',
    projectId: 'agents',
    projectName: 'MCP Agent Gateway',
    title: 'Expanded MCP Tool Handlers & Spending Controls',
    description: 'Built-in financial tools (check_allowance, estimate_gas, x402_auto_settle, rotate_token) with real-time signature checks.',
    status: 'in_progress',
    priority: 'critical',
    quarter: 'Q1 2025',
    progressPercent: 90,
    targetCapabilities: [
      'Built-in check_allowance tool',
      'Gas estimation tool handler',
      'Token secret rotation'
    ],
    actionPath: '/agents',
    actionLabel: 'Launch MCP Canvas',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-16T00:00:00.000Z',
  },
  {
    id: 'rdm_agent_scopes',
    projectId: 'agents',
    projectName: 'MCP Agent Gateway',
    title: 'Session Token Rotation & Scope Customizer',
    description: 'Dynamic privilege modification and token secret rotation without interrupting active agent chats.',
    status: 'in_progress',
    priority: 'high',
    quarter: 'Q1 2025',
    progressPercent: 85,
    targetCapabilities: [
      'Token secret regeneration',
      'Scope selector (pay:x402, sub:create)',
      'Spending cap gauge'
    ],
    actionPath: '/agents',
    actionLabel: 'Manage Agent Keys',
    createdAt: '2026-01-05T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },

  // 4. x402 Merchant Platform & Sandbox
  {
    id: 'rdm_dev_sandbox',
    projectId: 'developers',
    projectName: 'x402 Developer Platform',
    title: 'Interactive x402 Challenge Builder & Sandbox',
    description: 'Simulates real-world HTTP 402 Payment Required challenges and browser enclave signature settlements.',
    status: 'completed',
    priority: 'high',
    quarter: 'Q1 2025',
    progressPercent: 100,
    targetCapabilities: [
      'HTTP 402 challenge emulator',
      'Custom challenge pricing',
      'Real-time response inspector'
    ],
    actionPath: '/developers',
    actionLabel: 'Open x402 Sandbox',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'rdm_dev_webhook',
    projectId: 'developers',
    projectName: 'x402 Developer Platform',
    title: 'Webhook Event Simulator & HMAC Verifier',
    description: 'Test merchant webhook event dispatch with cryptographic HMAC-SHA256 signature verification.',
    status: 'in_progress',
    priority: 'critical',
    quarter: 'Q1 2025',
    progressPercent: 85,
    targetCapabilities: [
      'Webhook payload simulator',
      'HMAC signature verifier',
      'Delivery status log'
    ],
    actionPath: '/developers',
    actionLabel: 'Test Webhooks',
    createdAt: '2026-01-06T00:00:00.000Z',
    updatedAt: '2026-01-16T00:00:00.000Z',
  },

  // 5. Offline-First Storage & Edge Sync
  {
    id: 'rdm_sync_queue',
    projectId: 'offline_sync',
    projectName: 'Offline Storage & Edge Sync',
    title: 'Offline Mutation Queue Inspector & Sync Resolver',
    description: 'Visual queue inspector for local IndexedDB mutations with manual sync trigger to Turso edge.',
    status: 'in_progress',
    priority: 'high',
    quarter: 'Q1 2025',
    progressPercent: 85,
    targetCapabilities: [
      'Queued mutations inspector',
      'Manual edge sync trigger',
      'Conflict resolution mode'
    ],
    actionPath: '/settings',
    actionLabel: 'Inspect Sync Queue',
    createdAt: '2026-01-03T00:00:00.000Z',
    updatedAt: '2026-01-16T00:00:00.000Z',
  },
  {
    id: 'rdm_sync_backup',
    projectId: 'offline_sync',
    projectName: 'Offline Storage & Edge Sync',
    title: 'IndexedDB State Backup & JSON Migration',
    description: 'Zero-data loss export and wipe/import controls for client Dexie local database.',
    status: 'completed',
    priority: 'critical',
    quarter: 'Q1 2025',
    progressPercent: 100,
    targetCapabilities: [
      'Dexie database JSON dump',
      'Local database wipe and re-seed',
      'Offline state persistence'
    ],
    actionPath: '/settings',
    actionLabel: 'View Storage Settings',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-12T00:00:00.000Z',
  },

  // 6. Security Enclave Guardrails & Compliance Audit
  {
    id: 'rdm_sec_killswitch',
    projectId: 'security',
    projectName: 'Security Guardrails',
    title: 'Emergency Enclave Killswitch',
    description: 'Instant 1-click global freeze of all active subscriptions, locking of key enclave, and token revocation.',
    status: 'in_progress',
    priority: 'critical',
    quarter: 'Q1 2025',
    progressPercent: 90,
    targetCapabilities: [
      '1-click global lockdown',
      'Enclave key wipe from memory',
      'Active grant revocation'
    ],
    actionPath: '/settings',
    actionLabel: 'Guardrail Controls',
    createdAt: '2026-01-04T00:00:00.000Z',
    updatedAt: '2026-01-16T00:00:00.000Z',
  },
  {
    id: 'rdm_sec_export',
    projectId: 'security',
    projectName: 'Security Guardrails',
    title: 'Settlement Audit Ledger CSV & JSON Exporter',
    description: 'Export verifiable cryptographic audit trail of all transactions and guardrail blocks.',
    status: 'completed',
    priority: 'high',
    quarter: 'Q1 2025',
    progressPercent: 100,
    targetCapabilities: [
      'CSV ledger export',
      'JSON audit log dump',
      'Proof verification'
    ],
    actionPath: '/',
    actionLabel: 'View Audit Trail',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-11T00:00:00.000Z',
  },
];
