'use client';

import React, { useState } from 'react';
import { useSkelvre } from '@/lib/store';
import { Merchant } from '@/lib/types';
import {
  Terminal,
  Code2,
  Send,
  CheckCircle2,
  Copy,
  Plus,
  Play,
  ExternalLink,
  ShieldAlert,
  Fingerprint,
} from 'lucide-react';

export function DevelopersView() {
  const {
    merchants,
    registerMerchant,
    activeWallet,
    requestSigning,
    openRightSidebar,
  } = useSkelvre();

  // New Merchant State
  const [appName, setAppName] = useState('');
  const [appDomain, setAppDomain] = useState('');
  const [appWebhook, setAppWebhook] = useState('');
  const [appCategory, setAppCategory] = useState('AI & Machine Learning');

  // Interactive x402 sandbox state
  const [sandboxStep, setSandboxStep] = useState<'idle' | '402_challenged' | 'signing' | '200_unlocked'>('idle');
  const [sandboxResponse, setSandboxResponse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'typescript' | 'python' | 'curl' | 'mcp'>('typescript');

  // Trigger x402 simulation
  const runX402Challenge = async () => {
    setSandboxStep('402_challenged');
    try {
      const res = await fetch('/api/x402');
      const data = await res.json();
      setSandboxResponse({
        status: res.status,
        headers: {
          'content-type': 'application/json',
          'www-authenticate': 'Skelvre-x402 realm="api.deepseek.network", amount="0.25", currency="USDC"',
        },
        body: data,
      });
    } catch {
      setSandboxResponse({
        status: 402,
        headers: { 'www-authenticate': 'Skelvre-x402 amount="0.25", currency="USDC"' },
        body: { error: 'Payment Required', price: '0.25 USDC' },
      });
    }
  };

  const resolveX402Payment = () => {
    requestSigning({
      type: 'x402_payment',
      title: 'Pay x402 Micro-Settlement: DeepSeek Inference',
      description: 'The endpoint /api/x402 returned HTTP 402 Payment Required. Sign authorization to transfer 0.25 USDC.',
      amount: '0.25',
      assetSymbol: 'USDC',
      amountUsd: 0.25,
      recipient: '0x49c678a1bc1b69de78a6c8e31289cfc92f15e8b0',
      merchantName: 'DeepSeek Inference Router',
      walletId: activeWallet.id,
      walletAddress: activeWallet.address,
      chainCaip: activeWallet.chainCaip,
      rawPayload: {
        url: '/api/x402',
        amount: '0.25',
        currency: 'USDC',
        nonce: Date.now(),
      },
      onApprove: async () => {
        setSandboxStep('signing');
        const res = await fetch('/api/x402', {
          headers: {
            Authorization: `Skelvre-x402 sig_proof_0x${Date.now()}`,
            'X-Skelvre-Signature': '0x71c387...enclave_signed',
          },
        });
        const data = await res.json();
        setSandboxResponse({
          status: 200,
          headers: { 'content-type': 'application/json' },
          body: data,
        });
        setSandboxStep('200_unlocked');
      },
      onReject: () => {
        setSandboxStep('402_challenged');
      },
    });
  };

  const codeSnippets = {
    typescript: `import { SkelvreClient } from '@skelvre/sdk';

// Initialize non-custodial gateway
const skelvre = new SkelvreClient({
  network: 'base', // or 'solana'
  enclaveKeyId: 'enc_local_p256'
});

// Request x402 resource with autonomous payment relay
const response = await skelvre.fetchWithWallet('https://api.deepseek.network/v1/reason', {
  method: 'POST',
  body: JSON.stringify({ prompt: 'Execute code AST optimization' })
});

console.log(await response.json());`,
    python: `from skelvre import SkelvreSession

# Autonomous Python Agent Session
session = SkelvreSession(
    token_hash="0x8f3c7a9b1d2e4f5a...",
    spending_limit_usd=100.00
)

# Intercepts 402 Payment Required and satisfies challenge
response = session.post(
    "https://api.deepseek.network/v1/reason",
    json={"prompt": "Analyze dataset"}
)
print(response.json())`,
    curl: `# 1. Query resource - returns HTTP 402 with payment challenge
curl -i https://skelvre.network/api/x402

# 2. Provide client enclave signature header to settle on Base
curl -i https://skelvre.network/api/x402 \\
  -H "Authorization: Skelvre-x402 sig_proof_0x88910" \\
  -H "X-Skelvre-Signature: 0x7a89b0...1c"`,
    mcp: `{
  "mcpServers": {
    "skelvre-gateway": {
      "command": "npx",
      "args": ["-y", "@skelvre/mcp-gateway"],
      "env": {
        "SKELVRE_AGENT_TOKEN": "skelvre_mcp_0a1b2c3d...",
        "SKELVRE_DEFAULT_CAIP": "eip155:8453",
        "SKELVRE_AUTO_SIGN_MAX_USD": "5.00"
      }
    }
  }
}`,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-xl bg-black border border-white/15">
        <div className="text-xs font-mono text-zinc-400">
          <span>Developer Platform & x402 Sandbox</span>
          <span aria-hidden="true"> · </span>
          <span>Open Protocol</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Merchant Integration & x402 Testing
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-xl">
          Register third-party APIs for automated pull grants, inspect real-time HTTP 402 payment handshakes, and embed zero-custody crypto subscriptions into any client.
        </p>
      </div>

      {/* x402 Live Interactive Sandbox */}
      <div className="p-6 rounded-xl bg-black border border-white/15 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <h2 className="text-sm font-semibold text-white">
                Live Interactive x402 Payment Required Sandbox
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Simulates real-world API micro-settlements with browser enclave signing relay
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runX402Challenge}
              className="px-4 py-2 text-xs font-mono font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-600/30"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Step 1: Send Request (Trigger 402)</span>
            </button>

            {sandboxStep === '402_challenged' && (
              <button
                onClick={resolveX402Payment}
                className="px-4 py-2 text-xs font-mono font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 animate-pulse"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Step 2: Sign & Settle (Enclave)</span>
              </button>
            )}
          </div>
        </div>

        {/* Console Viewport */}
        <div className="rounded-lg bg-zinc-950 border border-white/10 p-4 font-mono text-xs space-y-2 overflow-x-auto min-h-[160px]">
          {sandboxResponse ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-zinc-500">HTTP Status</span>
                <span
                  className={`font-bold ${
                    sandboxResponse.status === 200
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  HTTP {sandboxResponse.status}{' '}
                  {sandboxResponse.status === 200 ? 'OK (Unlocked)' : 'Payment Required'}
                </span>
              </div>

              <div>
                <span className="text-zinc-500">{'// Response Headers'}</span>
                <pre className="text-zinc-400 text-[11px] mt-0.5">
                  {JSON.stringify(sandboxResponse.headers, null, 2)}
                </pre>
              </div>

              <div>
                <span className="text-zinc-500">{'// JSON Payload'}</span>
                <pre className="text-indigo-300 text-[11px] mt-0.5">
                  {JSON.stringify(sandboxResponse.body, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-zinc-600 flex flex-col items-center justify-center py-8 space-y-2">
              <Terminal className="w-6 h-6 text-zinc-700" />
              <span>Click &ldquo;Step 1: Send Request&rdquo; to trigger an authentic x402 challenge</span>
            </div>
          )}
        </div>
      </div>

      {/* Two Column: App Registry on Left, SDK Snippets on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Merchant Registry */}
        <div className="p-6 rounded-xl bg-black border border-white/15 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Registered Merchants</h2>
            <span className="text-xs font-mono text-zinc-400">
              {merchants.length} Apps
            </span>
          </div>

          <div className="space-y-3">
            {merchants.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-lg bg-zinc-950 border border-white/10 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-semibold text-white">{m.name}</span>
                  <span className="text-emerald-400 uppercase text-[10px]">{m.status}</span>
                </div>
                <div className="text-zinc-400 text-[11px] font-mono">{m.domain}</div>
                <p className="text-zinc-500 text-[11px]">{m.metadata?.description}</p>
                <div className="text-[10px] text-zinc-600 font-mono truncate pt-1">
                  Webhook: {m.webhookUrl}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Register Box */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await registerMerchant({
                ownerUserId: 'usr_skelvre_alpha_01',
                name: appName || 'Custom API Daemon',
                domain: appDomain || 'api.example.io',
                webhookUrl: appWebhook || 'https://api.example.io/skelvre-webhook',
                publicKey: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
                metadata: {
                  category: appCategory,
                  description: 'Registered developer endpoint',
                },
              });
              setAppName('');
              setAppDomain('');
              setAppWebhook('');
            }}
            className="pt-2 border-t border-white/10 space-y-3"
          >
            <div className="text-xs font-medium text-white">Register New Merchant Application</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="App Name"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="px-3 py-2 text-xs bg-zinc-950 border border-white/15 rounded text-white placeholder-zinc-600 font-mono"
              />
              <input
                type="text"
                required
                placeholder="api.domain.com"
                value={appDomain}
                onChange={(e) => setAppDomain(e.target.value)}
                className="px-3 py-2 text-xs bg-zinc-950 border border-white/15 rounded text-white placeholder-zinc-600 font-mono"
              />
            </div>
            <input
              type="url"
              required
              placeholder="Webhook Endpoint URL (https://...)"
              value={appWebhook}
              onChange={(e) => setAppWebhook(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-zinc-950 border border-white/15 rounded text-white placeholder-zinc-600 font-mono"
            />
            <button
              type="submit"
              className="w-full py-2 text-xs font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-500 transition-colors shadow-sm"
            >
              Register Application
            </button>
          </form>
        </div>

        {/* SDK & Integration Guides */}
        <div className="p-6 rounded-xl bg-black border border-white/15 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Integration Snippets</h2>
            <div className="flex gap-1 bg-zinc-950 p-1 rounded border border-white/10 text-[11px] font-mono">
              {(['typescript', 'python', 'curl', 'mcp'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 py-0.5 rounded capitalize ${
                    activeTab === tab ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="relative rounded-lg bg-zinc-950 border border-white/10 p-4 font-mono text-xs overflow-x-auto min-h-[300px]">
            <pre className="text-zinc-300 leading-relaxed text-[11px]">
              {codeSnippets[activeTab]}
            </pre>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-white/5 text-xs text-zinc-400 space-y-1">
            <div className="font-semibold text-zinc-300">Infinite Schema Expansibility</div>
            <p className="text-[11px] leading-relaxed">
              Every table stores a generic JSON <code className="text-indigo-400">metadata</code> column. You can inject custom gas overrides, dynamic subscription scaling caps, and novel cryptographic signature schemes without database schema migrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
