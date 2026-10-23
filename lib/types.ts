export type ChainCAIP = 
  | 'eip155:8453'   // Base
  | 'eip155:1'      // Ethereum Mainnet
  | 'eip155:42161'  // Arbitrum One
  | 'eip155:10'     // Optimism
  | 'eip155:137'    // Polygon
  | 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'; // Solana Mainnet

export interface ChainMetadata {
  caip: ChainCAIP;
  name: string;
  symbol: string;
  type: 'evm' | 'solana';
  icon: string;
  defaultRpc: string;
  explorerUrl: string;
  testnet?: boolean;
}

export interface User {
  id: string;
  email?: string | null;
  authMethod: 'siwe' | 'siws' | 'passkey' | 'email';
  primaryAddress: string;
  createdAt: string;
}

export interface WalletConfig {
  rpcOverride?: string;
  customGasGwei?: number;
  autoSignUnderUsd?: number;
  experimentalFeatures?: boolean;
}

export interface Wallet {
  id: string;
  userId: string;
  chainCaip: ChainCAIP;
  address: string;
  derivationPath: string;
  label: string;
  balanceUsd: number;
  nativeBalance: string;
  config?: WalletConfig;
  isPrimary: boolean;
  createdAt: string;
}

export interface Merchant {
  id: string;
  ownerUserId: string;
  name: string;
  domain: string;
  webhookUrl: string;
  publicKey: string;
  metadata?: {
    category?: string;
    description?: string;
    avatarUrl?: string;
    pricingModel?: string;
  };
  status: 'active' | 'suspended';
  createdAt: string;
}

export type GrantStatus = 'active' | 'revoked' | 'exhausted' | 'expired';

export interface SubscriptionGrant {
  id: string;
  userId: string;
  walletId: string;
  merchantId: string;
  merchantName: string;
  assetAddress: string;
  assetSymbol: string;
  maxAmountPerInterval: string;
  billingIntervalSeconds: number;
  nextChargeAt: string;
  status: GrantStatus;
  signatureProof: string; // EIP-712 or Ed25519 authorization payload
  metadata?: {
    planName?: string;
    dynamicScalingCap?: string;
    gracePeriodHours?: number;
    description?: string;
  };
  createdAt: string;
}

export type InterfaceType = 'mcp' | 'webmcp' | 'discord' | 'telegram' | 'cli';

export interface AgentSession {
  id: string;
  userId: string;
  walletId: string;
  name: string;
  interfaceType: InterfaceType;
  scopes: string[]; // e.g. ["pay:x402", "sub:create", "read:ledger"]
  spendingLimitUsd: number;
  currentSpentUsd: number;
  tokenHash: string;
  rawTokenSecret?: string; // Only shown upon initial generation
  expiresAt: string;
  createdAt: string;
}

export interface ToolCallExecution {
  id: string;
  toolName: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: 'pending' | 'success' | 'failed' | 'requires_signature';
  timestamp: string;
  txHash?: string;
}

export interface AgentChatMessage {
  id: string;
  chatSessionId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  toolCalls?: ToolCallExecution[];
  createdAt: string;
}

export interface AgentChatSession {
  id: string;
  userId: string;
  walletId?: string | null;
  sessionId?: string | null; // Links to agent_sessions
  interfaceOrigin: InterfaceType;
  title: string;
  rollingContext?: {
    summary: string;
    activeGrants: string[];
    authorizedSpendingRemaining: number;
    lastAuditTimestamp: string;
  };
  messages: AgentChatMessage[];
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export type SettlementStatus = 'pending' | 'success' | 'failed' | 'blocked_by_guardrail';

export interface SettlementLedgerEntry {
  id: string;
  grantId?: string | null;
  merchantId: string;
  merchantName: string;
  walletId: string;
  walletAddress: string;
  chainCaip: ChainCAIP;
  amount: string;
  assetSymbol: string;
  assetAddress: string;
  amountUsd: number;
  txHash?: string | null;
  status: SettlementStatus;
  metadata?: {
    x402Url?: string;
    mcpRequestId?: string;
    agentInterface?: string;
    reason?: string;
    executionLatencyMs?: number;
  };
  createdAt: string;
}

export interface SecurityGuardrails {
  maxSingleTxUsd: number;
  maxDailyTxUsd: number;
  autoLockMinutes: number;
  requireBiometricAlways: boolean;
  blockUnregisteredMerchants: boolean;
}

export type ProjectCategory =
  | 'wallets'
  | 'subscriptions'
  | 'agents'
  | 'developers'
  | 'offline_sync'
  | 'security';

export type RoadmapStatus = 'backlog' | 'in_progress' | 'completed';

export type RoadmapPriority = 'critical' | 'high' | 'medium' | 'low';

export interface ProjectRoadmapItem {
  id: string;
  projectId: ProjectCategory;
  projectName: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  priority: RoadmapPriority;
  quarter: string;
  progressPercent: number;
  targetCapabilities: string[];
  actionPath?: string;
  actionLabel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignRequest {
  id: string;
  type: 'x402_payment' | 'subscription_grant' | 'contract_execution' | 'wallet_message';
  title: string;
  description: string;
  amount?: string;
  assetSymbol?: string;
  amountUsd?: number;
  recipient: string;
  merchantName?: string;
  walletId: string;
  walletAddress: string;
  chainCaip: ChainCAIP;
  rawPayload: Record<string, unknown>;
  createdAt: string;
  onApprove: () => Promise<void> | void;
  onReject: () => void;
}

export type RightSidebarType =
  | 'none'
  | 'connect'
  | 'sign_request'
  | 'wallet_details'
  | 'add_wallet'
  | 'merchant_details'
  | 'grant_details'
  | 'create_grant'
  | 'create_agent_session'
  | 'agent_context_inspector'
  | 'guardrail_settings'
  | 'ledger_audit'
  | 'create_roadmap_item';
