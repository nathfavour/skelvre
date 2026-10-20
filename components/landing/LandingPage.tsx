'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSkelvre } from '@/lib/store';
import {
  Shield,
  Repeat,
  Bot,
  Terminal,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle2,
  Copy,
  ChevronRight,
  HardDrive,
  KeyRound,
  ExternalLink,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export function LandingPage() {
  const { openConnectDrawer } = useSkelvre();
  const [activeCodeTab, setActiveCodeTab] = useState<'sdk' | 'mcp' | 'x402'>('sdk');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const copyCode = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const codeSnippets = {
    sdk: `import { SkelvreClient } from '@skelvre/sdk';

// Initialize zero-custody multi-chain client
const skelvre = new SkelvreClient({
  network: 'eip155:8453', // Base or Solana
  storage: 'indexeddb',   // Fundamental offline-first
});

// Authorize a cryptographically capped pull grant
const grant = await skelvre.createSubscriptionGrant({
  merchantDomain: 'api.deepseek.network',
  maxAmountPerInterval: '25.00',
  assetSymbol: 'USDC',
  intervalSeconds: 30 * 86400, // 30 days
});

console.log('Signed EIP-712 Proof:', grant.signatureProof);`,
    mcp: `{
  "mcpServers": {
    "skelvre-gateway": {
      "command": "npx",
      "args": ["-y", "@skelvre/mcp-gateway"],
      "env": {
        "SKELVRE_DEFAULT_CAIP": "eip155:8453",
        "SKELVRE_AUTO_SIGN_MAX_USD": "10.00",
        "SKELVRE_OFFLINE_STORAGE": "dexie"
      }
    }
  }
}`,
    x402: `# 1. Target resource challenges client with HTTP 402
curl -i https://api.deepseek.network/v1/reason \\
  -H "Accept: application/json"

# Response: HTTP/1.1 402 Payment Required
# WWW-Authenticate: Skelvre-x402 amount="0.25", currency="USDC", chain="eip155:8453"

# 2. Browser Enclave signs payment intent and resubmits
curl -i https://api.deepseek.network/v1/reason \\
  -H "Authorization: Skelvre-x402 sig_proof_0x8f3c7a..." \\
  -H "X-Skelvre-Signature: 0x99a1b2..."`,
  };

  return (
    <div className="space-y-24 py-6 sm:py-12 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-14 pb-8 sm:pb-16 text-center space-y-8">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[450px] bg-violet-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-xs font-mono text-violet-300 shadow-sm shadow-violet-600/20">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span>Non-Custodial Multi-Chain Payment Protocol</span>
        </div>

        {/* Headline */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.12]">
            Programmable subscriptions & autonomous agent payments.
          </h1>
          <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed text-balance font-normal">
            Skelvre replaces custodial billing with cryptographic pull allowances and x402 HTTP micro-settlements. Private entropy never leaves your browser enclave.
          </p>
        </div>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={openConnectDrawer}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-all shadow-lg shadow-violet-600/30 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>Connect & Launch App</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            href="/developers"
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-zinc-300 bg-black hover:bg-zinc-950 border border-white/15 hover:border-violet-500/50 rounded-xl transition-all flex items-center justify-center gap-2 font-mono"
          >
            <Terminal className="w-4 h-4 text-violet-400" />
            <span>Live x402 Sandbox</span>
          </Link>
        </div>

        {/* Enclave Visualizer Card */}
        <div className="pt-6 max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-black border border-white/15 p-4 sm:p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-semibold">Client Enclave Telemetry</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 hidden sm:inline">Storage: Dexie IndexedDB</span>
                <span className="text-violet-400">Zero Server Custody</span>
              </div>
            </div>

            {/* Protocol Stream Flow Visual */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 space-y-1.5 font-mono text-xs">
                <div className="text-zinc-500 text-[10px] uppercase">1. Application / Agent</div>
                <div className="font-semibold text-white">x402 Resource Request</div>
                <div className="text-zinc-400 text-[11px]">HTTP 402 Payment Required challenged by verified merchant.</div>
              </div>

              <div className="p-3.5 rounded-xl bg-violet-950/40 border border-violet-500/30 space-y-1.5 font-mono text-xs">
                <div className="text-violet-400 text-[10px] uppercase">2. Client WebCrypto</div>
                <div className="font-semibold text-white">Cryptographic Allowance</div>
                <div className="text-zinc-300 text-[11px]">EIP-712 or Ed25519 signature proof computed in local enclave.</div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 space-y-1.5 font-mono text-xs">
                <div className="text-zinc-500 text-[10px] uppercase">3. Edge Settlement</div>
                <div className="font-semibold text-white">Base & Solana Ledger</div>
                <div className="text-zinc-400 text-[11px]">Allowance pulled on-chain or off-chain with immutable audit logs.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR CORE PILLARS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono text-violet-400 uppercase tracking-wider">
            Architecture Principles
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Engineered for zero custody & autonomous intelligence.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-black border border-white/15 space-y-4 hover:border-violet-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/40 flex items-center justify-center text-violet-300">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Client-Side WebCrypto Enclaves
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Private entropy and keys never leave your browser enclaves. Derivations utilize the W3C Web Cryptography API and Passkeys. The server only receives public addresses and signature proofs.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono text-violet-400 flex items-center gap-1">
              <span>BIP-44 HD Derivations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-black border border-white/15 space-y-4 hover:border-violet-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/40 flex items-center justify-center text-violet-300">
                <Repeat className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Cryptographic Pull Subscriptions
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Replace custodial recurring debit cards with cryptographically signed pull grants. Merchants pull capped amounts strictly when their billing cycle elapses, with instant revocation rights.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono text-violet-400 flex items-center gap-1">
              <span>EIP-712 & Ed25519 Authorizations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-black border border-white/15 space-y-4 hover:border-violet-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/40 flex items-center justify-center text-violet-300">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Agentic MCP Protocol & x402
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Connect Claude Desktop, Cursor, LangChain or custom Python agent daemons. Agents execute micro-payments autonomously with SHA-256 session token hashes and hardware guardrails.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono text-violet-400 flex items-center gap-1">
              <span>Model Context Protocol Standard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-black border border-white/15 space-y-4 hover:border-violet-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/40 flex items-center justify-center text-violet-300">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Offline-First by Fundamental Principle
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Built natively on Dexie IndexedDB. Wallets, recurring grants, tokens, and audit ledgers are fundamentally stored locally. Remote edge sync to Turso is purely optional.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono text-violet-400 flex items-center gap-1">
              <span>Local IndexedDB · Optional Turso Sync</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRADITIONAL BILLING VS SKELVRE COMPARISON */}
      <section className="p-6 sm:p-8 rounded-2xl bg-black border border-white/15 space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-mono text-violet-400 uppercase tracking-wider">
            Protocol Paradigm Shift
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Traditional Custodial Billing vs. Skelvre Cryptographic Pull
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 font-mono text-xs">
                <th className="py-3 pr-4">Dimension</th>
                <th className="py-3 px-4 text-zinc-500">Traditional Web2 (Stripe / PayPal)</th>
                <th className="py-3 pl-4 text-violet-400">Skelvre Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              <tr>
                <td className="py-3.5 pr-4 font-semibold text-white font-mono text-xs">Key Custody</td>
                <td className="py-3.5 px-4 text-zinc-400">Custodial server databases</td>
                <td className="py-3.5 pl-4 text-emerald-400 font-medium">Client WebCrypto & IndexedDB Enclave</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-semibold text-white font-mono text-xs">Recurring Pull</td>
                <td className="py-3.5 px-4 text-zinc-400">Credit card vault tokens</td>
                <td className="py-3.5 pl-4 text-emerald-400 font-medium">EIP-712 & Ed25519 Allowance Proofs</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-semibold text-white font-mono text-xs">Autonomous Agents</td>
                <td className="py-3.5 px-4 text-zinc-400">Unsafe API keys with full credit lines</td>
                <td className="py-3.5 pl-4 text-emerald-400 font-medium">Scoped MCP tokens with hard USD limits</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-semibold text-white font-mono text-xs">Multi-Chain Scope</td>
                <td className="py-3.5 px-4 text-zinc-400">Fiat only (USD, EUR, GBP)</td>
                <td className="py-3.5 pl-4 text-emerald-400 font-medium">Universal CAIP-2 (Base, Ethereum, Solana)</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-semibold text-white font-mono text-xs">Offline Reliability</td>
                <td className="py-3.5 px-4 text-zinc-400">Fails immediately when offline</td>
                <td className="py-3.5 pl-4 text-emerald-400 font-medium">100% offline-first; sync is optional</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. DEVELOPER SANDBOX & CODE INTEGRATION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-violet-400 uppercase tracking-wider">
              Developer Integration
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Embed zero-custody subscriptions into any app or agent.
            </h2>
          </div>

          <div className="flex gap-1.5 p-1 bg-black rounded-xl border border-white/10 font-mono text-xs">
            <button
              onClick={() => setActiveCodeTab('sdk')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeCodeTab === 'sdk' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              TypeScript SDK
            </button>
            <button
              onClick={() => setActiveCodeTab('mcp')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeCodeTab === 'mcp' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Cursor MCP Config
            </button>
            <button
              onClick={() => setActiveCodeTab('x402')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeCodeTab === 'x402' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              cURL x402 Handshake
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl bg-black border border-white/15 p-5 font-mono text-xs overflow-x-auto shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-zinc-500 text-[11px]">
            <span>Code Snippet: {activeCodeTab.toUpperCase()}</span>
            <button
              onClick={() => copyCode(codeSnippets[activeCodeTab], activeCodeTab)}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              {copiedTab === activeCodeTab ? 'Copied' : 'Copy'}
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <pre className="text-zinc-300 leading-relaxed text-xs">
            {codeSnippets[activeCodeTab]}
          </pre>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="relative rounded-3xl bg-gradient-to-b from-violet-950/40 to-black border border-violet-500/30 p-8 sm:p-12 text-center space-y-6 overflow-hidden shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to deploy non-custodial recurring payments?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed">
            Connect via SIWE, SIWS, or derive a local hardware WebCrypto key directly in your browser enclave. Zero custodial lock-in.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={openConnectDrawer}
            className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-all shadow-lg shadow-violet-600/30 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Connect Decentralized Enclave</span>
          </button>

          <Link
            href="/developers"
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-zinc-300 bg-black hover:bg-zinc-950 border border-white/15 rounded-xl transition-all flex items-center justify-center gap-2 font-mono"
          >
            <span>Merchant Registry</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="w-5 h-5 rounded-md bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold">
            SK
          </span>
          <span className="text-white font-bold">Skelvre Protocol</span>
          <span>© 2026</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-zinc-400">
          <span>CAIP-2 Standard</span>
          <span aria-hidden="true">·</span>
          <span>EIP-712 Pull</span>
          <span aria-hidden="true">·</span>
          <span>W3C WebCrypto</span>
          <span aria-hidden="true">·</span>
          <span>Offline-First (Dexie)</span>
        </div>
      </footer>
    </div>
  );
}
