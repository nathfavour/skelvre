'use client';

import React, { useState } from 'react';
import { useSkelvre } from '@/lib/store';
import { SUPPORTED_CHAINS } from '@/lib/mock-data';
import { ChainCAIP, Wallet, SubscriptionGrant, AgentSession, SettlementLedgerEntry } from '@/lib/types';
import {
  X,
  ShieldAlert,
  Key,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Flame,
  AlertTriangle,
  Fingerprint,
  Trash2,
  Lock,
  ArrowRight,
} from 'lucide-react';

export function RightSidebar() {
  const {
    rightSidebar,
    closeRightSidebar,
    activeSignRequest,
    approveActiveSignRequest,
    rejectActiveSignRequest,
    addWallet,
    wallets,
    activeWallet,
    merchants,
    createSubscriptionGrant,
    revokeSubscriptionGrant,
    createAgentSession,
    guardrails,
    updateGuardrails,
  } = useSkelvre();

  // Add wallet state
  const [newWalletChain, setNewWalletChain] = useState<ChainCAIP>('eip155:8453');
  const [newWalletLabel, setNewWalletLabel] = useState('');
  const [newWalletPath, setNewWalletPath] = useState("m/44'/60'/0'/0/0");

  // Create grant state
  const [grantMerchantId, setGrantMerchantId] = useState(merchants[0]?.id || '');
  const [grantAmount, setGrantAmount] = useState('50.00');
  const [grantIntervalDays, setGrantIntervalDays] = useState('30');
  const [grantPlanName, setGrantPlanName] = useState('Pro Monthly API Stream');

  // Create agent session state
  const [agentName, setAgentName] = useState('Claude 3.7 MCP Local');
  const [agentInterface, setAgentInterface] = useState<'mcp' | 'webmcp' | 'cli' | 'discord' | 'telegram'>('mcp');
  const [agentLimit, setAgentLimit] = useState('100.00');
  const [agentScopes, setAgentScopes] = useState<string[]>(['pay:x402', 'sub:create', 'read:ledger']);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);

  // Guardrail local edit
  const [localMaxTx, setLocalMaxTx] = useState(guardrails.maxSingleTxUsd.toString());
  const [localDailyCap, setLocalDailyCap] = useState(guardrails.maxDailyTxUsd.toString());
  const [localAutoLock, setLocalAutoLock] = useState(guardrails.autoLockMinutes.toString());

  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [signingPending, setSigningPending] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (!rightSidebar.isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-[#161412] border-l border-white/15 shadow-2xl flex flex-col text-zinc-200 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/15 bg-black">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <h2 className="text-sm font-semibold text-white tracking-tight">
            {rightSidebar.title || 'Context Details'}
          </h2>
        </div>
        <button
          onClick={closeRightSidebar}
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          aria-label="Close lateral sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#161412]">
        {/* VIEW 1: SIGN REQUEST (ENCLAVE RELAY) */}
        {rightSidebar.type === 'sign_request' && activeSignRequest && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-black border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider">
                <Fingerprint className="w-4 h-4" />
                <span>Client-Side Signer Relay</span>
              </div>
              <p className="text-sm font-medium text-white">
                {activeSignRequest.title}
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {activeSignRequest.description}
              </p>
            </div>

            {/* Transaction Parameters */}
            <div className="p-4 rounded-lg bg-black border border-white/10 space-y-3 font-mono text-xs">
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider">
                Payload Verification
              </div>
              {activeSignRequest.amount && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Authorized Allowance</span>
                  <span className="text-white font-medium tabular-nums">
                    {activeSignRequest.amount} {activeSignRequest.assetSymbol}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Target Recipient</span>
                <span className="text-zinc-300 truncate max-w-[180px]">
                  {activeSignRequest.recipient}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400">Signing Key</span>
                <span className="text-zinc-300">
                  {activeSignRequest.walletAddress.slice(0, 6)}...{activeSignRequest.walletAddress.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Network CAIP</span>
                <span className="text-indigo-400">
                  {activeSignRequest.chainCaip}
                </span>
              </div>
            </div>

            {/* Cryptographic Assurance Note */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-950 border border-white/10 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Zero Server Custody. This signature is computed entirely inside your browser enclave via WebCrypto API.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={rejectActiveSignRequest}
                className="flex-1 px-4 py-2.5 text-xs font-medium text-zinc-300 bg-black border border-white/15 rounded-lg hover:bg-zinc-900 transition-colors"
              >
                Decline & Reject
              </button>
              <button
                onClick={async () => {
                  setSigningPending(true);
                  try {
                    await approveActiveSignRequest();
                  } finally {
                    setSigningPending(false);
                  }
                }}
                disabled={signingPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                <Fingerprint className="w-4 h-4" />
                <span>{signingPending ? 'Enclave Signing...' : 'Authorize & Sign'}</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: ADD WALLET */}
        {rightSidebar.type === 'add_wallet' && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const isSol = newWalletChain.startsWith('solana');
              const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
              const address = isSol
                ? 'Sol' + Array.from({ length: 41 }, () => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]).join('')
                : '0x' + randomHex;

              await addWallet({
                userId: 'usr_skelvre_alpha_01',
                chainCaip: newWalletChain,
                address,
                derivationPath: newWalletPath,
                label: newWalletLabel || `Wallet ${wallets.length + 1}`,
                isPrimary: false,
              });
              closeRightSidebar();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">Target Chain (CAIP-2 Standard)</label>
              <select
                value={newWalletChain}
                onChange={(e) => {
                  const val = e.target.value as ChainCAIP;
                  setNewWalletChain(val);
                  setNewWalletPath(val.startsWith('solana') ? "m/44'/501'/0'/0'" : "m/44'/60'/0'/0/0");
                }}
                className="w-full px-3 py-2 text-xs bg-black border border-white/15 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              >
                {Object.values(SUPPORTED_CHAINS).map((chain) => (
                  <option key={chain.caip} value={chain.caip} className="bg-black text-white">
                    {chain.name} ({chain.caip})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">Wallet Label</label>
              <input
                type="text"
                required
                placeholder="e.g. Swarm Execution Node"
                value={newWalletLabel}
                onChange={(e) => setNewWalletLabel(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-black border border-white/15 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">BIP-44 Derivation Path</label>
              <input
                type="text"
                required
                value={newWalletPath}
                onChange={(e) => setNewWalletPath(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-black border border-white/15 rounded-lg text-indigo-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="p-3 rounded-lg bg-black border border-white/10 text-xs text-zinc-400 space-y-1">
              <div className="font-semibold text-zinc-300">Client-Side Key Derivation</div>
              <p>
                Entropy is derived locally in memory using PBKDF2/WebCrypto. The server receives only public addresses and CAIP metadata.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30"
            >
              Derive & Save to Local Enclave
            </button>
          </form>
        )}

        {/* VIEW 3: WALLET DETAILS & KEYS */}
        {rightSidebar.type === 'wallet_details' && (
          <div className="space-y-4">
            {(() => {
              const wallet = (rightSidebar.data as Wallet) || activeWallet;
              const chain = SUPPORTED_CHAINS[wallet.chainCaip];
              return (
                <>
                  <div className="p-4 rounded-lg bg-black border border-white/15 space-y-2">
                    <div className="text-[11px] font-mono uppercase text-zinc-400">
                      {chain?.name} Network
                    </div>
                    <div className="text-base font-bold text-white">{wallet.label}</div>
                    <div className="text-xs font-mono text-zinc-400 break-all bg-zinc-950 p-2 rounded border border-white/5 flex items-center justify-between">
                      <span>{wallet.address}</span>
                      <button
                        onClick={() => copyToClipboard(wallet.address, 'address')}
                        className="text-zinc-500 hover:text-white ml-2 shrink-0"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {copiedText === 'address' && (
                      <span className="text-[10px] text-emerald-400">Address copied!</span>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-black border border-white/15 space-y-3 text-xs font-mono">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Total Balance</span>
                      <span className="text-white font-bold tabular-nums">
                        ${wallet.balanceUsd.toLocaleString()} ({wallet.nativeBalance})
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">BIP-44 Path</span>
                      <span className="text-indigo-400">{wallet.derivationPath}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">CAIP Identifier</span>
                      <span className="text-zinc-300">{wallet.chainCaip}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-400">Default RPC</span>
                      <span className="text-zinc-400 truncate max-w-[180px]">
                        {chain?.defaultRpc}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950 border border-white/10 text-xs text-zinc-400 space-y-1">
                    <div className="text-zinc-300 font-medium">Export Public Key Payload</div>
                    <p className="text-[11px] leading-relaxed">
                      Download verifiable signed public credentials for external agent gateways without exporting private seed keys.
                    </p>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify({ caip: wallet.chainCaip, address: wallet.address, derivation: wallet.derivationPath }), 'export')}
                      className="mt-2 px-3 py-1.5 text-xs bg-black border border-white/15 rounded text-white hover:border-indigo-500/50 transition-colors"
                    >
                      {copiedText === 'export' ? 'Copied Public Spec' : 'Copy Public Credential Spec'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* VIEW 4: CREATE RECURRING SUBSCRIPTION GRANT */}
        {rightSidebar.type === 'create_grant' && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await createSubscriptionGrant({
                merchantId: grantMerchantId,
                walletId: activeWallet.id,
                assetAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
                assetSymbol: 'USDC',
                maxAmountPerInterval: grantAmount,
                billingIntervalSeconds: parseInt(grantIntervalDays) * 86400,
                planName: grantPlanName,
              });
              closeRightSidebar();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">Target Merchant</label>
              <select
                value={grantMerchantId}
                onChange={(e) => setGrantMerchantId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-black border border-white/15 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              >
                {merchants.map((m) => (
                  <option key={m.id} value={m.id} className="bg-black text-white">
                    {m.name} ({m.domain})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">Plan Description / Purpose</label>
              <input
                type="text"
                required
                value={grantPlanName}
                onChange={(e) => setGrantPlanName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-black border border-white/15 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-300">Max Pull Cap (USDC)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={grantAmount}
                  onChange={(e) => setGrantAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-black border border-white/15 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-300">Interval (Days)</label>
                <input
                  type="number"
                  required
                  value={grantIntervalDays}
                  onChange={(e) => setGrantIntervalDays(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-black border border-white/15 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black border border-white/10 text-xs text-zinc-400 space-y-1">
              <div className="text-zinc-300 font-medium">EIP-712 Pull Allowance Mechanics</div>
              <p className="text-[11px] leading-relaxed">
                Creates an off-chain cryptographic allowance signed by your enclave. The merchant can pull up to this exact cap only when their billing cycle elapses.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30"
            >
              Sign EIP-712 Pull Grant
            </button>
          </form>
        )}

        {/* VIEW 5: CREATE AGENT SESSION */}
        {rightSidebar.type === 'create_agent_session' && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const { secretToken } = await createAgentSession({
                name: agentName,
                walletId: activeWallet.id,
                interfaceType: agentInterface,
                scopes: agentScopes,
                spendingLimitUsd: parseFloat(agentLimit),
                expiresInDays: 30,
              });
              setCreatedSecret(secretToken);
            }}
            className="space-y-4"
          >
            {createdSecret ? (
              <div className="p-4 rounded-lg bg-black border border-emerald-500/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Agent Session Token Created!</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Save this raw secret now. Skelvre stores only the SHA-256 hash in Turso:
                </p>
                <div className="p-2.5 rounded bg-zinc-950 border border-white/10 font-mono text-xs text-emerald-300 break-all flex items-center justify-between">
                  <span>{createdSecret}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(createdSecret, 'secret')}
                    className="text-zinc-400 hover:text-white ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copiedText === 'secret' && (
                  <span className="text-[10px] text-emerald-400">Copied to clipboard</span>
                )}
                <button
                  type="button"
                  onClick={closeRightSidebar}
                  className="w-full py-2 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-colors mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-300">Agent Name & Purpose</label>
                  <input
                    type="text"
                    required
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-black border border-white/15 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-300">Interface Type</label>
                  <select
                    value={agentInterface}
                    onChange={(e) => setAgentInterface(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-black border border-white/15 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="mcp" className="bg-black">Model Context Protocol (MCP)</option>
                    <option value="webmcp" className="bg-black">WebMCP Browser Agent</option>
                    <option value="cli" className="bg-black">CLI Terminal Wrapper</option>
                    <option value="telegram" className="bg-black">Telegram Bot</option>
                    <option value="discord" className="bg-black">Discord Agent Bot</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-300">Spending Limit (USD)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={agentLimit}
                    onChange={(e) => setAgentLimit(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-black border border-white/15 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-300">Capability Scopes</label>
                  <div className="space-y-1.5 p-3 rounded-lg bg-black border border-white/15 text-xs font-mono">
                    {['pay:x402', 'sub:create', 'read:ledger', 'write:enclave_proof'].map((sc) => {
                      const checked = agentScopes.includes(sc);
                      return (
                        <label key={sc} className="flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              if (e.target.checked) setAgentScopes([...agentScopes, sc]);
                              else setAgentScopes(agentScopes.filter((s) => s !== sc));
                            }}
                            className="rounded border-zinc-700 bg-black text-indigo-600 focus:ring-0"
                          />
                          <span>{sc}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30"
                >
                  Generate Agent Session Key
                </button>
              </>
            )}
          </form>
        )}

        {/* VIEW 6: AGENT ROLLING CONTEXT INSPECTOR */}
        {rightSidebar.type === 'agent_context_inspector' && (
          <div className="space-y-4">
            {(() => {
              const session = rightSidebar.data as AgentSession;
              return (
                <>
                  <div className="p-4 rounded-lg bg-black border border-white/15 space-y-2">
                    <div className="text-[11px] font-mono uppercase text-indigo-400">
                      Rolling Context State
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {session?.name || 'MCP Agent'}
                    </div>
                    <p className="text-xs text-zinc-400">
                      Continuously summarized session memory maintained at edge to bypass token context limits.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-black border border-white/15 space-y-3 font-mono text-xs">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Total Spent</span>
                      <span className="text-white tabular-nums">${session?.currentSpentUsd || '38.40'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Hard Cap</span>
                      <span className="text-indigo-400 tabular-nums">${session?.spendingLimitUsd || '150.00'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Token SHA-256</span>
                      <span className="text-zinc-300 truncate max-w-[170px]">{session?.tokenHash}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-400">Interface</span>
                      <span className="text-emerald-400 uppercase">{session?.interfaceType}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-zinc-950 border border-white/10 space-y-2">
                    <div className="text-xs font-semibold text-zinc-200">Active Capability Scopes</div>
                    <div className="flex flex-wrap gap-1.5">
                      {session?.scopes?.map((sc) => (
                        <span key={sc} className="px-2 py-0.5 rounded bg-black border border-white/15 text-[11px] font-mono text-indigo-300">
                          {sc}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* VIEW 7: SECURITY GUARDRAIL SETTINGS */}
        {rightSidebar.type === 'guardrail_settings' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateGuardrails({
                maxSingleTxUsd: parseFloat(localMaxTx),
                maxDailyTxUsd: parseFloat(localDailyCap),
                autoLockMinutes: parseInt(localAutoLock),
              });
              closeRightSidebar();
            }}
            className="space-y-4"
          >
            <div className="p-4 rounded-lg bg-black border border-white/15 space-y-1">
              <div className="text-xs font-semibold text-white">Non-Custodial Guardrail Limits</div>
              <p className="text-[11px] text-zinc-400">
                These thresholds run directly in your local enclave engine and block rogue agent commands before signing.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">Max Single Transaction Cap (USD)</label>
              <input
                type="number"
                value={localMaxTx}
                onChange={(e) => setLocalMaxTx(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-black border border-white/15 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-zinc-500">Any pull/x402 charge above this requires explicit biometric confirmation.</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">Max Daily Cumulative Spending (USD)</label>
              <input
                type="number"
                value={localDailyCap}
                onChange={(e) => setLocalDailyCap(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-black border border-white/15 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">Auto-Lock Idle Timeout (Minutes)</label>
              <input
                type="number"
                value={localAutoLock}
                onChange={(e) => setLocalAutoLock(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-black border border-white/15 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30"
            >
              Save Guardrail Rules
            </button>
          </form>
        )}

        {/* VIEW 8: SETTLEMENT LEDGER AUDIT */}
        {rightSidebar.type === 'ledger_audit' && (
          <div className="space-y-4">
            {(() => {
              const entry = rightSidebar.data as SettlementLedgerEntry;
              return (
                <>
                  <div className="p-4 rounded-lg bg-black border border-white/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase text-zinc-400">Audit Proof</span>
                      <span className={`text-xs font-mono ${
                        entry.status === 'success' ? 'text-emerald-400' :
                        entry.status === 'blocked_by_guardrail' ? 'text-amber-400' : 'text-zinc-400'
                      }`}>
                        {entry.status}
                      </span>
                    </div>
                    <div className="text-base font-bold text-white">
                      {entry.amount} {entry.assetSymbol} (${entry.amountUsd.toFixed(2)})
                    </div>
                    <div className="text-xs text-zinc-400">
                      Merchant: <span className="text-white">{entry.merchantName}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-black border border-white/15 space-y-3 font-mono text-xs">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Settlement ID</span>
                      <span className="text-zinc-300">{entry.id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Network CAIP</span>
                      <span className="text-indigo-400">{entry.chainCaip}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Wallet</span>
                      <span className="text-zinc-300 truncate max-w-[180px]">{entry.walletAddress}</span>
                    </div>
                    {entry.txHash && (
                      <div className="py-1 border-b border-white/5">
                        <div className="text-zinc-400 mb-1">On-Chain Tx Hash</div>
                        <div className="text-[11px] text-indigo-400 break-all bg-zinc-950 p-2 rounded">
                          {entry.txHash}
                        </div>
                      </div>
                    )}
                    {entry.metadata?.reason && (
                      <div className="py-1">
                        <div className="text-zinc-400 mb-1">Execution Note</div>
                        <div className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                          {entry.metadata.reason}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
