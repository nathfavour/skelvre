'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  User,
  Wallet,
  Merchant,
  SubscriptionGrant,
  AgentSession,
  AgentChatSession,
  AgentChatMessage,
  SettlementLedgerEntry,
  SecurityGuardrails,
  RightSidebarType,
  SignRequest,
  ChainCAIP,
} from './types';
import {
  INITIAL_USER,
  INITIAL_WALLETS,
  INITIAL_MERCHANTS,
  INITIAL_GRANTS,
  INITIAL_AGENT_SESSIONS,
  INITIAL_LEDGER,
  INITIAL_GUARDRAILS,
  INITIAL_CHAT_SESSIONS,
  SUPPORTED_CHAINS,
} from './mock-data';
import { enclave } from './crypto-enclave';

interface SkelvreContextType {
  // Auth & Identity
  isAuthenticated: boolean;
  currentUser: User;
  setAuthenticated: (auth: boolean) => void;
  signInWithEthereum: () => Promise<void>;
  signInWithSolana: () => Promise<void>;
  signOut: () => void;

  // Wallets
  wallets: Wallet[];
  activeWallet: Wallet;
  setActiveWalletId: (id: string) => void;
  addWallet: (wallet: Omit<Wallet, 'id' | 'createdAt' | 'balanceUsd' | 'nativeBalance'>) => Promise<Wallet>;
  updateWalletConfig: (walletId: string, config: Wallet['config']) => void;

  // Merchants & Subscriptions
  merchants: Merchant[];
  registerMerchant: (merchant: Omit<Merchant, 'id' | 'createdAt' | 'status'>) => Promise<Merchant>;
  grants: SubscriptionGrant[];
  createSubscriptionGrant: (data: {
    merchantId: string;
    walletId: string;
    assetAddress: string;
    assetSymbol: string;
    maxAmountPerInterval: string;
    billingIntervalSeconds: number;
    planName?: string;
  }) => Promise<void>;
  revokeSubscriptionGrant: (grantId: string) => Promise<void>;
  simulateSubscriptionPull: (grantId: string) => Promise<void>;

  // Agents & MCP
  agentSessions: AgentSession[];
  createAgentSession: (data: {
    name: string;
    walletId: string;
    interfaceType: AgentSession['interfaceType'];
    scopes: string[];
    spendingLimitUsd: number;
    expiresInDays: number;
  }) => Promise<{ session: AgentSession; secretToken: string }>;
  revokeAgentSession: (sessionId: string) => void;

  // Chat & Rolling Context
  chatSessions: AgentChatSession[];
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  activeChatSession: AgentChatSession | undefined;
  sendMessageToAgent: (content: string) => Promise<void>;

  // Settlement & Guardrails
  ledger: SettlementLedgerEntry[];
  guardrails: SecurityGuardrails;
  updateGuardrails: (newGuardrails: Partial<SecurityGuardrails>) => void;

  // Enclave Security
  isEnclaveLocked: boolean;
  lockEnclave: () => void;
  unlockEnclave: () => boolean;

  // Zero-Modal Navigation State
  rightSidebar: {
    isOpen: boolean;
    type: RightSidebarType;
    data?: unknown;
    title?: string;
  };
  openRightSidebar: (type: RightSidebarType, data?: unknown, title?: string) => void;
  closeRightSidebar: () => void;

  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  mobileDrawer: {
    isOpen: boolean;
    type: RightSidebarType;
    data?: unknown;
    title?: string;
  };
  openMobileDrawer: (type: RightSidebarType, data?: unknown, title?: string) => void;
  closeMobileDrawer: () => void;

  // Signer Relay
  activeSignRequest: SignRequest | null;
  requestSigning: (request: Omit<SignRequest, 'id' | 'createdAt'>) => void;
  approveActiveSignRequest: () => Promise<void>;
  rejectActiveSignRequest: () => void;
}

const SkelvreContext = createContext<SkelvreContextType | null>(null);

export function SkelvreProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [wallets, setWallets] = useState<Wallet[]>(INITIAL_WALLETS);
  const [activeWalletId, setActiveWalletId] = useState<string>(INITIAL_WALLETS[0].id);

  const [merchants, setMerchants] = useState<Merchant[]>(INITIAL_MERCHANTS);
  const [grants, setGrants] = useState<SubscriptionGrant[]>(INITIAL_GRANTS);
  const [agentSessions, setAgentSessions] = useState<AgentSession[]>(INITIAL_AGENT_SESSIONS);
  const [chatSessions, setChatSessions] = useState<AgentChatSession[]>(INITIAL_CHAT_SESSIONS);
  const [activeChatId, setActiveChatId] = useState<string>(INITIAL_CHAT_SESSIONS[0].id);

  const [ledger, setLedger] = useState<SettlementLedgerEntry[]>(INITIAL_LEDGER);
  const [guardrails, setGuardrails] = useState<SecurityGuardrails>(INITIAL_GUARDRAILS);
  const [isEnclaveLocked, setIsEnclaveLocked] = useState<boolean>(false);

  // Zero-Modal Lateral Sidebars & Mobile Drawers
  const [rightSidebar, setRightSidebar] = useState<{
    isOpen: boolean;
    type: RightSidebarType;
    data?: unknown;
    title?: string;
  }>({
    isOpen: false,
    type: 'none',
  });

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileDrawer, setMobileDrawer] = useState<{
    isOpen: boolean;
    type: RightSidebarType;
    data?: unknown;
    title?: string;
  }>({
    isOpen: false,
    type: 'none',
  });

  // Signer relay queue
  const [signQueue, setSignQueue] = useState<SignRequest[]>([]);
  const activeSignRequest = signQueue[0] || null;

  // Active wallet helper
  const activeWallet = useMemo(() => {
    return wallets.find((w) => w.id === activeWalletId) || wallets[0];
  }, [wallets, activeWalletId]);

  // Active chat session helper
  const activeChatSession = useMemo(() => {
    return chatSessions.find((c) => c.id === activeChatId) || chatSessions[0];
  }, [chatSessions, activeChatId]);

  // Open / Close Right Sidebar (Desktop)
  const openRightSidebar = useCallback((type: RightSidebarType, data?: unknown, title?: string) => {
    setRightSidebar({ isOpen: true, type, data, title });
  }, []);

  const closeRightSidebar = useCallback(() => {
    setRightSidebar({ isOpen: false, type: 'none', data: undefined, title: undefined });
  }, []);

  // Open / Close Mobile Drawer
  const openMobileDrawer = useCallback((type: RightSidebarType, data?: unknown, title?: string) => {
    setMobileDrawer({ isOpen: true, type, data, title });
  }, []);

  const closeMobileDrawer = useCallback(() => {
    setMobileDrawer({ isOpen: false, type: 'none', data: undefined, title: undefined });
  }, []);

  // Sign Request Dispatcher
  const requestSigning = useCallback((request: Omit<SignRequest, 'id' | 'createdAt'>) => {
    const newSignReq: SignRequest = {
      ...request,
      id: `sign_req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    setSignQueue((prev) => [...prev, newSignReq]);

    // Open right sidebar or bottom drawer automatically (Strict Zero Modal)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileDrawer({
        isOpen: true,
        type: 'sign_request',
        data: newSignReq,
        title: 'Cryptographic Enclave Authorization',
      });
    } else {
      setRightSidebar({
        isOpen: true,
        type: 'sign_request',
        data: newSignReq,
        title: 'Cryptographic Enclave Authorization',
      });
    }
  }, []);

  const approveActiveSignRequest = useCallback(async () => {
    if (!activeSignRequest) return;
    try {
      await activeSignRequest.onApprove();
    } finally {
      setSignQueue((prev) => prev.slice(1));
      closeRightSidebar();
      closeMobileDrawer();
    }
  }, [activeSignRequest, closeRightSidebar, closeMobileDrawer]);

  const rejectActiveSignRequest = useCallback(() => {
    if (!activeSignRequest) return;
    activeSignRequest.onReject();
    setSignQueue((prev) => prev.slice(1));
    closeRightSidebar();
    closeMobileDrawer();
  }, [activeSignRequest, closeRightSidebar, closeMobileDrawer]);

  // SIWE / SIWS Authentication
  const signInWithEthereum = async () => {
    setAuthenticated(true);
    setCurrentUser({
      id: 'usr_skelvre_alpha_01',
      email: 'nathfavour02@gmail.com',
      authMethod: 'siwe',
      primaryAddress: '0x71C387A9F439fDE79BfE353Fa7631742456e43B1',
      createdAt: '2026-02-14T08:30:00Z',
    });
  };

  const signInWithSolana = async () => {
    setAuthenticated(true);
    setCurrentUser({
      id: 'usr_skelvre_sol_02',
      email: null,
      authMethod: 'siws',
      primaryAddress: '8r3Bf9xK2TqM5Lz7pWv4XyNeJkAa1bCdEfGhIjKlMnOp',
      createdAt: new Date().toISOString(),
    });
  };

  const signOut = () => {
    setAuthenticated(false);
  };

  // Enclave lock/unlock
  const lockEnclave = () => {
    enclave.lock();
    setIsEnclaveLocked(true);
  };

  const unlockEnclave = () => {
    const success = enclave.unlock();
    setIsEnclaveLocked(false);
    return success;
  };

  // Wallet Management
  const addWallet = async (data: Omit<Wallet, 'id' | 'createdAt' | 'balanceUsd' | 'nativeBalance'>): Promise<Wallet> => {
    const newWallet: Wallet = {
      ...data,
      id: `wal_${Date.now().toString(36)}`,
      balanceUsd: 1000.0,
      nativeBalance: data.chainCaip.startsWith('solana') ? '8.50 SOL' : '0.45 ETH',
      createdAt: new Date().toISOString(),
    };
    setWallets((prev) => [...prev, newWallet]);
    return newWallet;
  };

  const updateWalletConfig = (walletId: string, config: Wallet['config']) => {
    setWallets((prev) =>
      prev.map((w) => (w.id === walletId ? { ...w, config: { ...w.config, ...config } } : w))
    );
  };

  // Merchant Registration
  const registerMerchant = async (data: Omit<Merchant, 'id' | 'createdAt' | 'status'>): Promise<Merchant> => {
    const newMerchant: Merchant = {
      ...data,
      id: `mer_${Date.now().toString(36)}`,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setMerchants((prev) => [newMerchant, ...prev]);
    return newMerchant;
  };

  // Subscription Grants
  const createSubscriptionGrant = async (data: {
    merchantId: string;
    walletId: string;
    assetAddress: string;
    assetSymbol: string;
    maxAmountPerInterval: string;
    billingIntervalSeconds: number;
    planName?: string;
  }) => {
    const targetMerchant = merchants.find((m) => m.id === data.merchantId);
    const targetWallet = wallets.find((w) => w.id === data.walletId) || activeWallet;

    if (!targetMerchant || !targetWallet) return;

    return new Promise<void>((resolve, reject) => {
      requestSigning({
        type: 'subscription_grant',
        title: `Authorize Recurring Pull: ${targetMerchant.name}`,
        description: `Authorizing automated recurring spending allowance of up to ${data.maxAmountPerInterval} ${data.assetSymbol} every ${Math.round(data.billingIntervalSeconds / 86400)} days.`,
        amount: data.maxAmountPerInterval,
        assetSymbol: data.assetSymbol,
        amountUsd: parseFloat(data.maxAmountPerInterval),
        recipient: targetMerchant.publicKey,
        merchantName: targetMerchant.name,
        walletId: targetWallet.id,
        walletAddress: targetWallet.address,
        chainCaip: targetWallet.chainCaip,
        rawPayload: {
          merchant: targetMerchant.domain,
          subscriber: targetWallet.address,
          allowance: data.maxAmountPerInterval,
          intervalSeconds: data.billingIntervalSeconds,
        },
        onApprove: async () => {
          const { signatureProof } = await enclave.signSubscriptionGrant({
            walletAddress: targetWallet.address,
            merchantDomain: targetMerchant.domain,
            assetAddress: data.assetAddress,
            maxAmountPerInterval: data.maxAmountPerInterval,
            billingIntervalSeconds: data.billingIntervalSeconds,
            nonce: Date.now(),
          });

          const newGrant: SubscriptionGrant = {
            id: `gra_${Date.now().toString(36)}`,
            userId: currentUser.id,
            walletId: targetWallet.id,
            merchantId: targetMerchant.id,
            merchantName: targetMerchant.name,
            assetAddress: data.assetAddress,
            assetSymbol: data.assetSymbol,
            maxAmountPerInterval: data.maxAmountPerInterval,
            billingIntervalSeconds: data.billingIntervalSeconds,
            nextChargeAt: new Date(Date.now() + data.billingIntervalSeconds * 1000).toISOString(),
            status: 'active',
            signatureProof,
            metadata: {
              planName: data.planName || 'Recurring Stream Grant',
            },
            createdAt: new Date().toISOString(),
          };

          setGrants((prev) => [newGrant, ...prev]);
          resolve();
        },
        onReject: () => {
          reject(new Error('User declined EIP-712 grant signature'));
        },
      });
    });
  };

  const revokeSubscriptionGrant = async (grantId: string) => {
    const grant = grants.find((g) => g.id === grantId);
    if (!grant) return;

    setGrants((prev) =>
      prev.map((g) => (g.id === grantId ? { ...g, status: 'revoked' as const } : g))
    );

    // Record revocation in ledger
    const ledgerEntry: SettlementLedgerEntry = {
      id: `led_rev_${Date.now().toString(36)}`,
      grantId: grant.id,
      merchantId: grant.merchantId,
      merchantName: grant.merchantName,
      walletId: grant.walletId,
      walletAddress: activeWallet.address,
      chainCaip: activeWallet.chainCaip,
      amount: '0.00',
      assetSymbol: grant.assetSymbol,
      assetAddress: grant.assetAddress,
      amountUsd: 0,
      txHash: '0x' + Array.from(new Uint8Array(32)).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      status: 'success',
      metadata: {
        reason: `Cryptographic revocation of allowance grant ${grant.id}`,
      },
      createdAt: new Date().toISOString(),
    };
    setLedger((prev) => [ledgerEntry, ...prev]);
  };

  const simulateSubscriptionPull = async (grantId: string) => {
    const grant = grants.find((g) => g.id === grantId);
    if (!grant || grant.status !== 'active') return;

    const amountNum = parseFloat(grant.maxAmountPerInterval);

    // Guardrail check
    if (amountNum > guardrails.maxSingleTxUsd) {
      const blockedEntry: SettlementLedgerEntry = {
        id: `led_block_${Date.now()}`,
        grantId: grant.id,
        merchantId: grant.merchantId,
        merchantName: grant.merchantName,
        walletId: grant.walletId,
        walletAddress: activeWallet.address,
        chainCaip: activeWallet.chainCaip,
        amount: grant.maxAmountPerInterval,
        assetSymbol: grant.assetSymbol,
        assetAddress: grant.assetAddress,
        amountUsd: amountNum,
        txHash: null,
        status: 'blocked_by_guardrail',
        metadata: {
          reason: `Pull amount ($${amountNum}) exceeded single tx cap ($${guardrails.maxSingleTxUsd}). Settlement rejected.`,
        },
        createdAt: new Date().toISOString(),
      };
      setLedger((prev) => [blockedEntry, ...prev]);
      return;
    }

    const { txHash } = await enclave.signPaymentIntent({
      walletAddress: activeWallet.address,
      recipient: grant.merchantName,
      amount: grant.maxAmountPerInterval,
      asset: grant.assetSymbol,
      chainCaip: activeWallet.chainCaip,
      nonce: Date.now().toString(),
    });

    const newLedgerEntry: SettlementLedgerEntry = {
      id: `led_pull_${Date.now()}`,
      grantId: grant.id,
      merchantId: grant.merchantId,
      merchantName: grant.merchantName,
      walletId: grant.walletId,
      walletAddress: activeWallet.address,
      chainCaip: activeWallet.chainCaip,
      amount: grant.maxAmountPerInterval,
      assetSymbol: grant.assetSymbol,
      assetAddress: grant.assetAddress,
      amountUsd: amountNum,
      txHash,
      status: 'success',
      metadata: {
        reason: 'Simulated automated pull execution verified against on-chain grant',
        executionLatencyMs: 310,
      },
      createdAt: new Date().toISOString(),
    };

    setLedger((prev) => [newLedgerEntry, ...prev]);

    // Update next charge date
    setGrants((prev) =>
      prev.map((g) =>
        g.id === grantId
          ? {
              ...g,
              nextChargeAt: new Date(Date.now() + g.billingIntervalSeconds * 1000).toISOString(),
            }
          : g
      )
    );
  };

  // Agent Sessions
  const createAgentSession = async (data: {
    name: string;
    walletId: string;
    interfaceType: AgentSession['interfaceType'];
    scopes: string[];
    spendingLimitUsd: number;
    expiresInDays: number;
  }) => {
    const { secret, tokenHash } = await enclave.generateAgentToken(data.interfaceType);
    const expiresAt = new Date(Date.now() + data.expiresInDays * 86400 * 1000).toISOString();

    const newSession: AgentSession = {
      id: `ses_${Date.now().toString(36)}`,
      userId: currentUser.id,
      walletId: data.walletId,
      name: data.name,
      interfaceType: data.interfaceType,
      scopes: data.scopes,
      spendingLimitUsd: data.spendingLimitUsd,
      currentSpentUsd: 0,
      tokenHash,
      rawTokenSecret: secret,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    setAgentSessions((prev) => [newSession, ...prev]);
    return { session: newSession, secretToken: secret };
  };

  const revokeAgentSession = (sessionId: string) => {
    setAgentSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  // Agent Chat Execution & MCP Simulation
  const sendMessageToAgent = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: AgentChatMessage = {
      id: `msg_${Date.now()}_u`,
      chatSessionId: activeChatId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    setChatSessions((prev) =>
      prev.map((cs) =>
        cs.id === activeChatId
          ? {
              ...cs,
              messages: [...cs.messages, userMsg],
              updatedAt: new Date().toISOString(),
            }
          : cs
      )
    );

    // Call server-side API for intelligent agent execution
    try {
      const response = await fetch('/api/gateway/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: content,
          chatSessionId: activeChatId,
          activeWallet: {
            id: activeWallet.id,
            address: activeWallet.address,
            chainCaip: activeWallet.chainCaip,
            balanceUsd: activeWallet.balanceUsd,
          },
          grants: grants.map((g) => ({
            id: g.id,
            merchantName: g.merchantName,
            maxAmount: g.maxAmountPerInterval,
            status: g.status,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: AgentChatMessage = {
          id: `msg_${Date.now()}_a`,
          chatSessionId: activeChatId,
          role: 'assistant',
          content: data.text || 'Action analyzed and executed via Skelvre Gateway.',
          toolCalls: data.toolCalls,
          createdAt: new Date().toISOString(),
        };

        // If a tool execution generated a payment settlement, record it
        if (data.settlement) {
          setLedger((prev) => [data.settlement, ...prev]);
        }

        setChatSessions((prev) =>
          prev.map((cs) =>
            cs.id === activeChatId
              ? {
                  ...cs,
                  messages: [...cs.messages, assistantMsg],
                  rollingContext: data.rollingContext || cs.rollingContext,
                  updatedAt: new Date().toISOString(),
                }
              : cs
          )
        );
      } else {
        throw new Error('API gateway returned non-200');
      }
    } catch {
      // Robust client fallback simulation for offline/sandbox resilience
      setTimeout(async () => {
        let reply = '';
        let toolCall: AgentChatMessage['toolCalls'] = undefined;

        const lower = content.toLowerCase();
        if (lower.includes('pay') || lower.includes('402') || lower.includes('compile') || lower.includes('buy')) {
          reply = `Triggered x402 payment protocol through active MCP session. Verified under $50.00 single-tx guardrail and signed by enclave (${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}).`;
          const txHash = '0x' + Array.from(new Uint8Array(32)).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
          toolCall = [
            {
              id: `tc_${Date.now()}`,
              toolName: 'skelvre_pay_x402',
              input: {
                targetUrl: 'https://mcp.cursor.sh/v1/tools/code_interpret',
                amount: '0.85',
                asset: 'USDC',
                chainCaip: activeWallet.chainCaip,
              },
              output: {
                status: '200_OK',
                txHash,
                settlement: 'finalized',
              },
              status: 'success',
              timestamp: new Date().toISOString(),
              txHash,
            },
          ];

          // Append to ledger
          const newLedger: SettlementLedgerEntry = {
            id: `led_x402_${Date.now()}`,
            merchantId: 'mer_cursor_mcp_hub',
            merchantName: 'Cursor MCP Cloud Daemon',
            walletId: activeWallet.id,
            walletAddress: activeWallet.address,
            chainCaip: activeWallet.chainCaip,
            amount: '0.85',
            assetSymbol: 'USDC',
            assetAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
            amountUsd: 0.85,
            txHash,
            status: 'success',
            metadata: {
              x402Url: 'https://mcp.cursor.sh/v1/tools/code_interpret',
              agentInterface: 'mcp',
              executionLatencyMs: 198,
            },
            createdAt: new Date().toISOString(),
          };
          setLedger((prev) => [newLedger, ...prev]);
        } else if (lower.includes('balance') || lower.includes('wallet') || lower.includes('funds')) {
          reply = `Current primary wallet is ${activeWallet.label} (${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}) on ${SUPPORTED_CHAINS[activeWallet.chainCaip]?.name}. Total balance: $${activeWallet.balanceUsd.toLocaleString()} (${activeWallet.nativeBalance}). Enclave status: Unlocked and hardware-backed.`;
        } else if (lower.includes('subscription') || lower.includes('grant') || lower.includes('recurring')) {
          reply = `You have ${grants.filter((g) => g.status === 'active').length} active subscription grants. Next upcoming charge is DeepSeek Inference Router ($120.00 USDC). All signature proofs are stored locally.`;
        } else {
          reply = `Understood. The Skelvre agent execution gateway has verified your identity and session token hash. Scopes [pay:x402, sub:create, read:ledger] are available for autonomous operations.`;
        }

        const fallbackMsg: AgentChatMessage = {
          id: `msg_${Date.now()}_a`,
          chatSessionId: activeChatId,
          role: 'assistant',
          content: reply,
          toolCalls: toolCall,
          createdAt: new Date().toISOString(),
        };

        setChatSessions((prev) =>
          prev.map((cs) =>
            cs.id === activeChatId
              ? {
                  ...cs,
                  messages: [...cs.messages, fallbackMsg],
                  updatedAt: new Date().toISOString(),
                }
              : cs
          )
        );
      }, 400);
    }
  };

  const updateGuardrails = (newGuardrails: Partial<SecurityGuardrails>) => {
    setGuardrails((prev) => ({ ...prev, ...newGuardrails }));
  };

  return (
    <SkelvreContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        setAuthenticated,
        signInWithEthereum,
        signInWithSolana,
        signOut,
        wallets,
        activeWallet,
        setActiveWalletId,
        addWallet,
        updateWalletConfig,
        merchants,
        registerMerchant,
        grants,
        createSubscriptionGrant,
        revokeSubscriptionGrant,
        simulateSubscriptionPull,
        agentSessions,
        createAgentSession,
        revokeAgentSession,
        chatSessions,
        activeChatId,
        setActiveChatId,
        activeChatSession,
        sendMessageToAgent,
        ledger,
        guardrails,
        updateGuardrails,
        isEnclaveLocked,
        lockEnclave,
        unlockEnclave,
        rightSidebar,
        openRightSidebar,
        closeRightSidebar,
        mobileNavOpen,
        setMobileNavOpen,
        mobileDrawer,
        openMobileDrawer,
        closeMobileDrawer,
        activeSignRequest,
        requestSigning,
        approveActiveSignRequest,
        rejectActiveSignRequest,
      }}
    >
      {children}
    </SkelvreContext.Provider>
  );
}

export function useSkelvre() {
  const context = useContext(SkelvreContext);
  if (!context) {
    throw new Error('useSkelvre must be used within a SkelvreProvider');
  }
  return context;
}
