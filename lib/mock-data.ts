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
