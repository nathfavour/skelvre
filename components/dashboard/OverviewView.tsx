'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSkelvre } from '@/lib/store';
import { SUPPORTED_CHAINS } from '@/lib/mock-data';
import {
  Wallet as WalletIcon,
  Repeat,
  Bot,
  Activity,
  ChevronRight,
  Terminal,
  ShieldCheck,
  Plus,
  KeyRound,
  HardDrive,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react';

export function OverviewView() {
  const {
    isAuthenticated,
    wallets,
    grants,
    agentSessions,
    ledger,
    openRightSidebar,
    signInWithEthereum,
    signInWithSolana,
    isOnline,
    pendingSyncCount,
    syncStatus,
    syncWithEdge,
  } = useSkelvre();

  const [filterLedger, setFilterLedger] = useState<'all' | 'success' | 'blocked'>('all');

  // Compute key totals from real active user data (zero fake figures)
  const totalBalanceUsd = wallets.reduce((acc, w) => acc + (w.balanceUsd || 0), 0);
  const activeGrants = grants.filter((g) => g.status === 'active');
  const monthlyBurnUsd = activeGrants.reduce(
    (acc, g) => acc + (parseFloat(g.maxAmountPerInterval) || 0),
    0
  );
  const totalSettledUsd = ledger
    .filter((l) => l.status === 'success')
    .reduce((acc, l) => acc + (l.amountUsd || 0), 0);

  const filteredLedger = ledger.filter((item) => {
    if (filterLedger === 'success') return item.status === 'success';
    if (filterLedger === 'blocked') return item.status === 'blocked_by_guardrail';
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. HERO / COMMAND CENTER HEADER */}
      <div className="relative rounded-2xl bg-black border border-white/15 p-6 sm:p-8 overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono">
            <span>Skelvre Multi-Chain Gateway</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Offline First (Dexie)</span>
            <span aria-hidden="true">·</span>
            <span>Optional Edge Sync</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Modal Architecture</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white text-balance">
            Non-custodial subscriptions & autonomous agentic payments.
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Programmable recurring billing and x402 micro-settlements across EVM and Solana. Runs fundamentally offline in local IndexedDB — edge sync to Turso is purely optional.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => signInWithEthereum()}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors shadow-md shadow-violet-600/30 flex items-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Connect with SIWE</span>
                </button>
                <button
                  onClick={() => signInWithSolana()}
                  className="px-4 py-2.5 text-xs font-semibold text-zinc-200 bg-black border border-white/15 rounded-lg hover:border-violet-500/50 hover:bg-zinc-950 transition-colors flex items-center gap-2"
                >
                  <span>Connect with SIWS</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openRightSidebar('create_grant', null, 'Authorize Recurring Pull Subscription')}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors shadow-md shadow-violet-600/30 flex items-center gap-2"
                >
                  <Repeat className="w-4 h-4" />
                  <span>Authorize New Subscription</span>
                </button>

                <button
                  onClick={() => openRightSidebar('create_agent_session', null, 'Provision MCP Agent Session')}
                  className="px-4 py-2.5 text-xs font-semibold text-zinc-200 bg-black border border-white/15 rounded-lg hover:border-violet-500/50 hover:bg-zinc-950 transition-colors flex items-center gap-2"
                >
                  <Bot className="w-4 h-4" />
                  <span>Deploy MCP Session</span>
                </button>
              </>
            )}

            <Link
              href="/developers"
              className="px-4 py-2.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Terminal className="w-4 h-4" />
              <span>x402 Sandbox</span>
            </Link>
          </div>
        </div>

        {/* Hero Background Illustration */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 opacity-25 pointer-events-none hidden md:block">
          <Image
            src="/assets/enclave_core.jpg"
            alt="Cryptographic Enclave Architecture"
            width={400}
            height={400}
            className="rounded-full object-cover border border-white/10"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* 2. STATS & REVENUE METRICS ROW (Strictly Real Active Figures) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl bg-black border border-white/15 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Universal Balance</span>
            <WalletIcon className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            ${totalBalanceUsd.toFixed(2)}
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            Across {wallets.length} active derivation paths
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl bg-black border border-white/15 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Monthly Pull Burn</span>
            <Repeat className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            ${monthlyBurnUsd.toFixed(2)}
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            {activeGrants.length} active EIP-712 recurring grants
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl bg-black border border-white/15 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Agent Sessions</span>
            <Bot className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            {agentSessions.length} Active
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            MCP, WebMCP, CLI & Telegram bots
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl bg-black border border-white/15 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Cumulative Settled</span>
            <Activity className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            ${totalSettledUsd.toFixed(2)}
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            {ledger.length} immutable ledger events
          </div>
        </div>
      </div>

      {/* 3. OFFLINE-FIRST ARCHITECTURE BANNER */}
      <div className="p-4 rounded-xl bg-black border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-violet-950/60 border border-violet-500/40 text-violet-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Offline-First Architecture Active</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Dexie IndexedDB
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              All keys, grants, agent sessions, and ledgers are fundamentally stored in browser storage. Syncing to Turso edge is completely optional.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right font-mono text-xs hidden sm:block">
            <span className="text-zinc-500">Sync Queue: </span>
            <span className="text-white font-medium">{pendingSyncCount} mutations</span>
          </div>

          <button
            onClick={syncWithEdge}
            disabled={syncStatus === 'syncing'}
            className="px-3.5 py-2 text-xs font-mono font-medium text-white bg-black border border-white/15 rounded-lg hover:border-violet-500/60 hover:bg-zinc-950 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-violet-400 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync Edge (Optional)'}</span>
          </button>
        </div>
      </div>

      {/* 4. MULTI-CHAIN WALLETS & ACTIVE RECURRING PULLS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Universal Wallets */}
        <div className="p-5 rounded-xl bg-black border border-white/15 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Universal Multi-Chain Wallets</h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                CAIP-2 Decoupled Derivations (IndexedDB)
              </p>
            </div>
            <button
              onClick={() => openRightSidebar('add_wallet', null, 'Derive New Universal Wallet')}
              className="text-xs text-violet-400 hover:text-violet-300 font-mono flex items-center gap-1"
            >
              <span>Derive Wallet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {wallets.length === 0 ? (
              <div className="p-6 rounded-lg bg-zinc-950 border border-white/5 text-center space-y-3">
                <WalletIcon className="w-6 h-6 text-zinc-600 mx-auto" />
                <div className="text-xs text-zinc-400">No multi-chain wallets derived yet</div>
                <button
                  onClick={() => openRightSidebar('add_wallet', null, 'Derive New Universal Wallet')}
                  className="px-3 py-1.5 text-xs font-mono text-violet-300 bg-violet-950/60 border border-violet-500/40 rounded-lg hover:bg-violet-900/50 transition-colors"
                >
                  + Derive Enclave Wallet
                </button>
              </div>
            ) : (
              wallets.map((w) => {
                const chain = SUPPORTED_CHAINS[w.chainCaip];
                return (
                  <div
                    key={w.id}
                    onClick={() => openRightSidebar('wallet_details', w, 'Wallet Parameters')}
                    className="p-3 rounded-lg bg-zinc-950 border border-white/10 hover:border-violet-500/50 cursor-pointer transition-all flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{chain?.icon || '⚡'}</span>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{w.label}</span>
                          {w.isPrimary && (
                            <span className="text-[10px] text-violet-400 font-mono bg-violet-950/60 px-1.5 py-0.2 rounded border border-violet-500/40">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-zinc-500 font-mono text-[11px] mt-0.5">
                          {w.address.slice(0, 8)}...{w.address.slice(-6)} · {chain?.name}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono tabular-nums">
                      <div className="font-bold text-white">${(w.balanceUsd || 0).toFixed(2)}</div>
                      <div className="text-[11px] text-zinc-400">{w.nativeBalance || '0.00 ETH'}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Subscription Grants */}
        <div className="p-5 rounded-xl bg-black border border-white/15 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Recurring Pull Subscriptions</h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                EIP-712 & Ed25519 Allowance Authorizations
              </p>
            </div>
            <Link
              href="/subscriptions"
              className="text-xs text-violet-400 hover:text-violet-300 font-mono flex items-center gap-1"
            >
              <span>View All ({grants.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {grants.length === 0 ? (
              <div className="p-6 rounded-lg bg-zinc-950 border border-white/5 text-center space-y-3">
                <Repeat className="w-6 h-6 text-zinc-600 mx-auto" />
                <div className="text-xs text-zinc-400">No active subscription pull grants</div>
                <button
                  onClick={() => openRightSidebar('create_grant', null, 'Authorize Recurring Pull Subscription')}
                  className="px-3 py-1.5 text-xs font-mono text-violet-300 bg-violet-950/60 border border-violet-500/40 rounded-lg hover:bg-violet-900/50 transition-colors"
                >
                  + Authorize First Subscription
                </button>
              </div>
            ) : (
              grants.slice(0, 3).map((g) => (
                <div
                  key={g.id}
                  onClick={() => openRightSidebar('grant_details', g, 'Allowance Grant Proof')}
                  className="p-3 rounded-lg bg-zinc-950 border border-white/10 hover:border-violet-500/50 cursor-pointer transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{g.merchantName}</div>
                    <div className="text-zinc-400 text-[11px] font-mono mt-0.5">
                      {g.metadata?.planName || 'Recurring Stream'} · Every {Math.round(g.billingIntervalSeconds / 86400)}d
                    </div>
                  </div>

                  <div className="text-right font-mono tabular-nums">
                    <div className="font-bold text-white">
                      ${g.maxAmountPerInterval} {g.assetSymbol}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Next: {new Date(g.nextChargeAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 5. SETTLEMENT LEDGER AUDIT TRAIL */}
      <div className="p-5 rounded-xl bg-black border border-white/15 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Settlement Audit Ledger</h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Immutable local verification entries & guardrail enforcement logs (Stored in Dexie)
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-lg border border-white/10 text-xs font-mono">
            <button
              onClick={() => setFilterLedger('all')}
              className={`px-3 py-1 rounded transition-colors ${
                filterLedger === 'all' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Events ({ledger.length})
            </button>
            <button
              onClick={() => setFilterLedger('success')}
              className={`px-3 py-1 rounded transition-colors ${
                filterLedger === 'success' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Success
            </button>
            <button
              onClick={() => setFilterLedger('blocked')}
              className={`px-3 py-1 rounded transition-colors ${
                filterLedger === 'blocked' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Guardrail Blocked
            </button>
          </div>
        </div>

        {filteredLedger.length === 0 ? (
          <div className="py-10 text-center font-mono text-xs text-zinc-500 space-y-1">
            <Activity className="w-5 h-5 mx-auto text-zinc-600" />
            <div>No settlement transactions recorded yet in local storage</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 pb-2">
                  <th className="py-2.5 font-medium">Timestamp</th>
                  <th className="py-2.5 font-medium">Merchant / Destination</th>
                  <th className="py-2.5 font-medium">Amount</th>
                  <th className="py-2.5 font-medium">Network</th>
                  <th className="py-2.5 font-medium">Status</th>
                  <th className="py-2.5 font-medium text-right">Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLedger.map((entry) => {
                  const chain = SUPPORTED_CHAINS[entry.chainCaip];
                  return (
                    <tr
                      key={entry.id}
                      onClick={() => openRightSidebar('ledger_audit', entry, 'Settlement Audit Details')}
                      className="hover:bg-zinc-950/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 text-zinc-400 tabular-nums">
                        {new Date(entry.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="py-3 text-white font-sans font-medium">
                        {entry.merchantName}
                      </td>
                      <td className="py-3 text-white tabular-nums font-bold">
                        {entry.amount} {entry.assetSymbol}
                      </td>
                      <td className="py-3 text-zinc-400">
                        {chain?.name || entry.chainCaip}
                      </td>
                      <td className="py-3">
                        {entry.status === 'success' && (
                          <span className="text-emerald-400">Settled</span>
                        )}
                        {entry.status === 'blocked_by_guardrail' && (
                          <span className="text-amber-400">Blocked by Cap</span>
                        )}
                        {entry.status === 'pending' && (
                          <span className="text-zinc-400">Pending</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {entry.txHash ? (
                          <span className="text-violet-400 hover:text-violet-300">
                            {entry.txHash.slice(0, 6)}...{entry.txHash.slice(-4)}
                          </span>
                        ) : (
                          <span className="text-zinc-600">None</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. ARCHITECTURAL SHOWCASE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="p-6 rounded-xl bg-black border border-white/15 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-mono text-violet-400 uppercase tracking-wider">
              Offline-First & Zero-Custody
            </div>
            <h3 className="text-lg font-bold text-white">
              Private entropy never leaves browser enclave memory
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Skelvre uses the W3C Web Cryptography API and Dexie IndexedDB. Wallets, pull subscriptions, and agent tokens exist locally first. You can run disconnected indefinitely.
            </p>
          </div>

          <div className="rounded-lg overflow-hidden border border-white/10 relative h-48">
            <Image
              src="/assets/agent_network.jpg"
              alt="Autonomous Agent Network Conduits"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="p-6 rounded-xl bg-black border border-white/15 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-mono text-violet-400 uppercase tracking-wider">
              Agentic MCP Protocol
            </div>
            <h3 className="text-lg font-bold text-white">
              Deterministic tool authorization for AI models
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Connect Cursor, Claude Desktop, or autonomous daemons. Agents execute micro-payments with verified SHA-256 session tokens and automated guardrail bounds.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-zinc-950 border border-white/10 font-mono text-xs text-zinc-300 space-y-2">
            <div className="text-zinc-500">{'// MCP Client Configuration snippet'}</div>
            <div className="text-violet-400">
              {`{ "mcpServers": { "skelvre": { "command": "npx", "args": ["-y", "@skelvre/mcp-gateway"] } } }`}
            </div>
            <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Status: Gateway Ready</span>
              <Link href="/agents" className="text-violet-400 hover:text-violet-300">
                Launch Agent Canvas →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
