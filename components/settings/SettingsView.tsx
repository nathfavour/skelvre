'use client';

import React, { useState } from 'react';
import { useSkelvre } from '@/lib/store';
import {
  Settings,
  Shield,
  Key,
  Fingerprint,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Copy,
} from 'lucide-react';

export function SettingsView() {
  const {
    currentUser,
    guardrails,
    updateGuardrails,
    isEnclaveLocked,
    lockEnclave,
    unlockEnclave,
    signInWithEthereum,
    signInWithSolana,
    activeWallet,
  } = useSkelvre();

  const [maxTx, setMaxTx] = useState(guardrails.maxSingleTxUsd.toString());
  const [dailyCap, setDailyCap] = useState(guardrails.maxDailyTxUsd.toString());
  const [autoLock, setAutoLock] = useState(guardrails.autoLockMinutes.toString());
  const [requireBiometric, setRequireBiometric] = useState(guardrails.requireBiometricAlways);
  const [blockUnregistered, setBlockUnregistered] = useState(guardrails.blockUnregisteredMerchants);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveGuardrails = (e: React.FormEvent) => {
    e.preventDefault();
    updateGuardrails({
      maxSingleTxUsd: parseFloat(maxTx) || 50,
      maxDailyTxUsd: parseFloat(dailyCap) || 300,
      autoLockMinutes: parseInt(autoLock) || 15,
      requireBiometricAlways: requireBiometric,
      blockUnregisteredMerchants: blockUnregistered,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-xl bg-black border border-white/15">
        <div className="text-xs font-mono text-zinc-400">
          <span>Better Auth & Cryptographic Identities</span>
          <span aria-hidden="true"> · </span>
          <span>Security Bounds</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Settings & Local Security Enclave
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-xl">
          Manage your decentralized SIWE/SIWS profiles, hardware-backed WebCrypto keys, and execution guardrails.
        </p>
      </div>

      {/* Identity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SIWE Identity */}
        <div className="p-5 rounded-xl bg-black border border-white/15 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Better Auth Plugin</span>
            <span className="text-violet-400">EVM Identity</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-violet-950 flex items-center justify-center text-violet-400 font-bold text-sm">
              ⟠
            </span>
            <div>
              <div className="text-sm font-bold text-white">Sign In With Ethereum (SIWE)</div>
              <div className="text-xs font-mono text-zinc-500">EIP-4361 Standard</div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-zinc-950 border border-white/5 font-mono text-xs text-zinc-300 break-all">
            {currentUser.primaryAddress}
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-zinc-500 font-mono">Linked Email: {currentUser.email || 'None'}</span>
            <button
              onClick={signInWithEthereum}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium"
            >
              Re-Authenticate
            </button>
          </div>
        </div>

        {/* SIWS Identity */}
        <div className="p-5 rounded-xl bg-black border border-white/15 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Better Auth Plugin</span>
            <span className="text-violet-400">SVM Identity</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-violet-950 flex items-center justify-center text-violet-400 font-bold text-sm">
              ◎
            </span>
            <div>
              <div className="text-sm font-bold text-white">Sign In With Solana (SIWS)</div>
              <div className="text-xs font-mono text-zinc-500">CAIP-122 Ed25519</div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-zinc-950 border border-white/5 font-mono text-xs text-zinc-300 break-all">
            8r3Bf9xK2TqM5Lz7pWv4XyNeJkAa1bCdEfGhIjKlMnOp
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-emerald-400 font-mono">Active Swarm Key</span>
            <button
              onClick={signInWithSolana}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium"
            >
              Switch SVM Session
            </button>
          </div>
        </div>
      </div>

      {/* Security Enclave Configuration */}
      <div className="p-6 rounded-xl bg-black border border-white/15 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-base font-semibold text-white">
              Client Enclave & Guardrail Bounds
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Rules strictly executed within browser memory before signatures are produced.
            </p>
          </div>

          <button
            onClick={() => (isEnclaveLocked ? unlockEnclave() : lockEnclave())}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors flex items-center gap-1.5 ${
              isEnclaveLocked
                ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                : 'bg-zinc-950 border-white/15 text-zinc-300 hover:border-violet-500'
            }`}
          >
            {isEnclaveLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 text-violet-400" />}
            <span>{isEnclaveLocked ? 'Enclave Locked' : 'Enclave Active'}</span>
          </button>
        </div>

        <form onSubmit={handleSaveGuardrails} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Single Tx Hard Cap (USD)
              </label>
              <input
                type="number"
                step="1"
                required
                value={maxTx}
                onChange={(e) => setMaxTx(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-zinc-950 border border-white/15 rounded text-white focus:outline-none focus:border-violet-500"
              />
              <span className="text-[10px] text-zinc-500">
                Charges exceeding this trigger an Enclave Sign prompt.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Daily Cumulative Cap (USD)
              </label>
              <input
                type="number"
                step="5"
                required
                value={dailyCap}
                onChange={(e) => setDailyCap(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-zinc-950 border border-white/15 rounded text-white focus:outline-none focus:border-violet-500"
              />
              <span className="text-[10px] text-zinc-500">
                Resets daily at 00:00 UTC.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Idle Lock Timeout (Minutes)
              </label>
              <input
                type="number"
                required
                value={autoLock}
                onChange={(e) => setAutoLock(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-zinc-950 border border-white/15 rounded text-white focus:outline-none focus:border-violet-500"
              />
              <span className="text-[10px] text-zinc-500">
                Wipes in-memory derivation cache when idle.
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-white/5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={requireBiometric}
                onChange={(e) => setRequireBiometric(e.target.checked)}
                className="rounded border-zinc-700 bg-black text-violet-600 focus:ring-0"
              />
              <div className="text-xs">
                <span className="font-medium text-white">Require Passkey Biometric Confirmation for All Pulls</span>
                <p className="text-zinc-500 text-[11px]">Enforces WebAuthn platform authenticator verification before releasing proofs.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={blockUnregistered}
                onChange={(e) => setBlockUnregistered(e.target.checked)}
                className="rounded border-zinc-700 bg-black text-violet-600 focus:ring-0"
              />
              <div className="text-xs">
                <span className="font-medium text-white">Block Unregistered Merchant Pull Requests</span>
                <p className="text-zinc-500 text-[11px]">Rejects x402 payment challenges unless the app domain is verified in the registry.</p>
              </div>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {saveSuccess ? (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardrail parameters saved to enclave</span>
              </span>
            ) : (
              <span className="text-xs font-mono text-zinc-500">
                Local storage encrypted via AES-GCM
              </span>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors shadow-md shadow-violet-600/30"
            >
              Update Guardrail Rules
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
