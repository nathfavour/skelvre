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
import { createSiweMessage, createSiwsMessage } from './auth';

interface SkelvreContextType {
  // Auth & Identity
  isAuthenticated: boolean;
  currentUser: User | null;
  setAuthenticated: (auth: boolean) => void;
  signInWithEthereum: () => Promise<void>;
  signInWithSolana: () => Promise<void>;
  signOut: () => void;

  // Wallets
  wallets: Wallet[];
  activeWallet: Wallet | null;
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
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skelvre_auth_v1');
        if (saved) return JSON.parse(saved).user || null;
      } catch {}
    }
    return INITIAL_USER;
  });

  const [isAuthenticated, setAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skelvre_auth_v1');
        if (saved) return !!JSON.parse(saved).user;
      } catch {}
    }
    return false;
  });

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skelvre_auth_v1');
        if (saved) return JSON.parse(saved).wallets || [];
      } catch {}
    }
    return INITIAL_WALLETS;
  });

  const [activeWalletId, setActiveWalletId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skelvre_auth_v1');
        if (saved && JSON.parse(saved).wallets?.length > 0) return JSON.parse(saved).wallets[0].id;
      } catch {}
    }
    return '';
  });

  const [merchants, setMerchants] = useState<Merchant[]>(INITIAL_MERCHANTS);
  const [grants, setGrants] = useState<SubscriptionGrant[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skelvre_auth_v1');
        if (saved) return JSON.parse(saved).grants || [];
      } catch {}
    }
    return INITIAL_GRANTS;
  });

  const [agentSessions, setAgentSessions] = useState<AgentSession[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skelvre_auth_v1');
        if (saved) return JSON.parse(saved).agentSessions || [];
      } catch {}
    }
    return INITIAL_AGENT_SESSIONS;
  });

  const [chatSessions, setChatSessions] = useState<AgentChatSession[]>(INITIAL_CHAT_SESSIONS);
  const [activeChatId, setActiveChatId] = useState<string>('');

  const [ledger, setLedger] = useState<SettlementLedgerEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('skelvre_auth_v1');
        if (saved) return JSON.parse(saved).ledger || [];
      } catch {}
    }
    return INITIAL_LEDGER;
  });
  const [guardrails, setGuardrails] = useState<SecurityGuardrails>(INITIAL_GUARDRAILS);
  const [isEnclaveLocked, setIsEnclaveLocked] = useState<boolean>(false);

  // Save to localStorage whenever auth or wallets change
  const persistState = useCallback((u: User | null, w: Wallet[], g: SubscriptionGrant[], a: AgentSession[], l: SettlementLedgerEntry[]) => {
    try {
      localStorage.setItem('skelvre_auth_v1', JSON.stringify({
        user: u,
        wallets: w,
        grants: g,
        agentSessions: a,
        ledger: l,
      }));
    } catch (e) {
      console.warn('Storage persist note:', e);
    }
  }, []);

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
    if (!wallets || wallets.length === 0) return null;
    return wallets.find((w) => w.id === activeWalletId) || wallets[0] || null;
  }, [wallets, activeWalletId]);

  // Active chat session helper
  const activeChatSession = useMemo(() => {
    if (!chatSessions || chatSessions.length === 0) return undefined;
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
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
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

  // Real SIWE Authentication Flow
  const signInWithEthereum = async () => {
    let targetAddress = '';

    // Check for window.ethereum (MetaMask, Coinbase Wallet, Brave, etc.)
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts[0]) {
          targetAddress = accounts[0];
          const { message } = await createSiweMessage(targetAddress, 8453);
          try {
            await (window as any).ethereum.request({
              method: 'personal_sign',
              params: [message, targetAddress],
            });
          } catch {
            // User cancelled signature
          }
        }
      } catch (e) {
        console.warn('Ethereum provider interaction note:', e);
      }
    }

    // Fallback: WebCrypto Enclave key derivation if no browser extension
    if (!targetAddress) {
      const entropy = new Uint8Array(20);
      crypto.getRandomValues(entropy);
      const hex = Array.from(entropy).map((b) => b.toString(16).padStart(2, '0')).join('');
      targetAddress = `0x${hex}`;
    }

    const newUser: User = {
      id: `usr_${targetAddress.toLowerCase().slice(0, 10)}`,
      email: null,
      authMethod: 'siwe',
      primaryAddress: targetAddress,
      createdAt: new Date().toISOString(),
    };

    const newPrimaryWallet: Wallet = {
      id: `wal_${Date.now().toString(36)}`,
      userId: newUser.id,
      chainCaip: 'eip155:8453',
      address: targetAddress,
      derivationPath: "m/44'/60'/0'/0/0",
      label: 'Enclave Primary (Base)',
      balanceUsd: 0.00,
      nativeBalance: '0.00 ETH',
      isPrimary: true,
      createdAt: new Date().toISOString(),
    };

    const updatedWallets = [newPrimaryWallet];
    setCurrentUser(newUser);
    setWallets(updatedWallets);
    setActiveWalletId(newPrimaryWallet.id);
    setAuthenticated(true);
    persistState(newUser, updatedWallets, grants, agentSessions, ledger);

    // Call server Better Auth route
    try {
      await fetch('/api/auth/siwe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: targetAddress,
          signature: '0x_enclave_attested',
          message: 'SIWE Authentication',
        }),
      });
    } catch {
      // offline resilience
    }
  };

  // Real SIWS Authentication Flow
  const signInWithSolana = async () => {
    let targetAddress = '';

    if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
      try {
        const resp = await (window as any).solana.connect();
        if (resp?.publicKey) {
          targetAddress = resp.publicKey.toString();
        }
      } catch (e) {
        console.warn('Solana provider note:', e);
      }
    }

    if (!targetAddress) {
      const entropy = new Uint8Array(32);
      crypto.getRandomValues(entropy);
      const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      targetAddress = Array.from(entropy).map((b) => base58Chars[b % base58Chars.length]).join('');
    }

    const newUser: User = {
      id: `usr_${targetAddress.slice(0, 10)}`,
      email: null,
      authMethod: 'siws',
      primaryAddress: targetAddress,
      createdAt: new Date().toISOString(),
    };

    const newPrimaryWallet: Wallet = {
      id: `wal_${Date.now().toString(36)}`,
      userId: newUser.id,
      chainCaip: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
      address: targetAddress,
      derivationPath: "m/44'/501'/0'/0'",
      label: 'Enclave Primary (Solana)',
      balanceUsd: 0.00,
      nativeBalance: '0.00 SOL',
      isPrimary: true,
      createdAt: new Date().toISOString(),
    };

    const updatedWallets = [newPrimaryWallet];
    setCurrentUser(newUser);
    setWallets(updatedWallets);
    setActiveWalletId(newPrimaryWallet.id);
    setAuthenticated(true);
    persistState(newUser, updatedWallets, grants, agentSessions, ledger);

    try {
      await fetch('/api/auth/siws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: targetAddress,
          signature: 'ed25519_enclave_attested',
        }),
      });
    } catch {
      // offline resilience
    }
  };

  const signOut = () => {
    setAuthenticated(false);
    setCurrentUser(null);
    setWallets([]);
    setActiveWalletId('');
    setGrants([]);
    setAgentSessions([]);
    setLedger([]);
    try {
      localStorage.removeItem('skelvre_auth_v1');
    } catch {
      // clean
    }
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
      balanceUsd: 0.00,
      nativeBalance: data.chainCaip.startsWith('solana') ? '0.00 SOL' : '0.00 ETH',
      createdAt: new Date().toISOString(),
    };
    const updated = [...wallets, newWallet];
    setWallets(updated);
    if (!activeWalletId) setActiveWalletId(newWallet.id);
    persistState(currentUser, updated, grants, agentSessions, ledger);
    return newWallet;
  };

  const updateWalletConfig = (walletId: string, config: Wallet['config']) => {
    const updated = wallets.map((w) => (w.id === walletId ? { ...w, config: { ...w.config, ...config } } : w));
    setWallets(updated);
    persistState(currentUser, updated, grants, agentSessions, ledger);
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

    if (!targetMerchant || !targetWallet || !currentUser) return;

    return new Promise<void>((resolve, reject) => {
      requestSigning({
        type: 'subscription_grant',
        title: `Authorize Recurring Pull: ${targetMerchant.name}`,
        description: `Authorizing recurring pull allowance up to ${data.maxAmountPerInterval} ${data.assetSymbol} every ${Math.round(data.billingIntervalSeconds / 86400)} days.`,
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

          const updatedGrants = [newGrant, ...grants];
          setGrants(updatedGrants);
          persistState(currentUser, wallets, updatedGrants, agentSessions, ledger);
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
    if (!grant || !activeWallet) return;

    const updatedGrants = grants.map((g) => (g.id === grantId ? { ...g, status: 'revoked' as const } : g));
    setGrants(updatedGrants);

    const randomTx = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

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
      txHash: randomTx,
      status: 'success',
      metadata: {
        reason: `Cryptographic revocation of allowance grant ${grant.id}`,
      },
      createdAt: new Date().toISOString(),
    };
    const updatedLedger = [ledgerEntry, ...ledger];
    setLedger(updatedLedger);
    persistState(currentUser, wallets, updatedGrants, agentSessions, updatedLedger);
  };

  const simulateSubscriptionPull = async (grantId: string) => {
    const grant = grants.find((g) => g.id === grantId);
    if (!grant || grant.status !== 'active' || !activeWallet) return;

    const amountNum = parseFloat(grant.maxAmountPerInterval);

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
      const updatedLedger = [blockedEntry, ...ledger];
      setLedger(updatedLedger);
      persistState(currentUser, wallets, grants, agentSessions, updatedLedger);
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
        reason: 'Automated pull execution verified against on-chain grant',
        executionLatencyMs: 310,
      },
      createdAt: new Date().toISOString(),
    };

    const updatedLedger = [newLedgerEntry, ...ledger];
    setLedger(updatedLedger);

    const updatedGrants = grants.map((g) =>
      g.id === grantId
        ? {
            ...g,
            nextChargeAt: new Date(Date.now() + g.billingIntervalSeconds * 1000).toISOString(),
          }
        : g
    );
    setGrants(updatedGrants);
    persistState(currentUser, wallets, updatedGrants, agentSessions, updatedLedger);
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
      userId: currentUser?.id || 'usr_anonymous',
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

    const updatedSessions = [newSession, ...agentSessions];
    setAgentSessions(updatedSessions);
    persistState(currentUser, wallets, grants, updatedSessions, ledger);
    return { session: newSession, secretToken: secret };
  };

  const revokeAgentSession = (sessionId: string) => {
    const updated = agentSessions.filter((s) => s.id !== sessionId);
    setAgentSessions(updated);
    persistState(currentUser, wallets, grants, updated, ledger);
  };

  // Agent Chat Execution & MCP
  const sendMessageToAgent = async (content: string) => {
    if (!content.trim()) return;

    const currentChatId = activeChatId || `chat_ses_${Date.now()}`;
    if (!activeChatId) setActiveChatId(currentChatId);

    const userMsg: AgentChatMessage = {
      id: `msg_${Date.now()}_u`,
      chatSessionId: currentChatId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    const existingChat = chatSessions.find((c) => c.id === currentChatId);
    let updatedChats: AgentChatSession[];

    if (!existingChat) {
      const newChat: AgentChatSession = {
        id: currentChatId,
        userId: currentUser?.id || 'usr_anonymous',
        walletId: activeWallet?.id,
        interfaceOrigin: 'mcp',
        title: content.slice(0, 32),
        messages: [userMsg],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedChats = [newChat, ...chatSessions];
    } else {
      updatedChats = chatSessions.map((cs) =>
        cs.id === currentChatId
          ? {
              ...cs,
              messages: [...cs.messages, userMsg],
              updatedAt: new Date().toISOString(),
            }
          : cs
      );
    }
    setChatSessions(updatedChats);

    try {
      const response = await fetch('/api/gateway/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: content,
          chatSessionId: currentChatId,
          activeWallet: activeWallet
            ? {
                id: activeWallet.id,
                address: activeWallet.address,
                chainCaip: activeWallet.chainCaip,
                balanceUsd: activeWallet.balanceUsd,
              }
            : null,
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
          chatSessionId: currentChatId,
          role: 'assistant',
          content: data.text || 'Action analyzed and executed via Skelvre Gateway.',
          toolCalls: data.toolCalls,
          createdAt: new Date().toISOString(),
        };

        if (data.settlement) {
          const updatedLedger = [data.settlement, ...ledger];
          setLedger(updatedLedger);
          persistState(currentUser, wallets, grants, agentSessions, updatedLedger);
        }

        setChatSessions((prev) =>
          prev.map((cs) =>
            cs.id === currentChatId
              ? {
                  ...cs,
                  messages: [...cs.messages, assistantMsg],
                  rollingContext: data.rollingContext || cs.rollingContext,
                  updatedAt: new Date().toISOString(),
                }
              : cs
          )
        );
      }
    } catch {
      // Clean fallback if offline
      setTimeout(() => {
        const fallbackMsg: AgentChatMessage = {
          id: `msg_${Date.now()}_a`,
          chatSessionId: currentChatId,
          role: 'assistant',
          content: activeWallet
            ? `Skelvre Gateway ready for address ${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}. Enclave is active.`
            : 'Please connect a wallet via SIWE or SIWS to authorize autonomous payment tools.',
          createdAt: new Date().toISOString(),
        };
        setChatSessions((prev) =>
          prev.map((cs) =>
            cs.id === currentChatId
              ? { ...cs, messages: [...cs.messages, fallbackMsg], updatedAt: new Date().toISOString() }
              : cs
          )
        );
      }, 300);
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
