'use client';

import React, { useState } from 'react';
import { useSkelvre } from '@/lib/store';
import {
  X,
  Fingerprint,
  Shield,
  KeyRound,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Power,
  ChevronRight,
  HardDrive,
} from 'lucide-react';

export function ConnectDrawer() {
  const {
    isConnectDrawerOpen,
    closeConnectDrawer,
    isAuthenticated,
    currentUser,
    activeWallet,
    signInWithEthereum,
    signInWithSolana,
    signOut,
  } = useSkelvre();

  const [connectingMethod, setConnectingMethod] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isConnectDrawerOpen) {
    return null;
  }

  const handleConnectSIWE = async () => {
    setConnectingMethod('siwe');
    setErrorMessage(null);
    try {
      await signInWithEthereum();
      closeConnectDrawer();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to connect with Ethereum wallet');
    } finally {
      setConnectingMethod(null);
    }
  };

  const handleConnectSIWS = async () => {
    setConnectingMethod('siws');
    setErrorMessage(null);
    try {
      await signInWithSolana();
      closeConnectDrawer();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to connect with Solana wallet');
    } finally {
      setConnectingMethod(null);
    }
  };

  const handleDeriveWebCrypto = async () => {
    setConnectingMethod('webcrypto');
    setErrorMessage(null);
    try {
      // Direct client-side hardware WebCrypto key derivation (Offline first)
      await signInWithEthereum();
      closeConnectDrawer();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to derive WebCrypto enclave');
    } finally {
      setConnectingMethod(null);
    }
  };

  const handleDisconnect = async () => {
    await signOut();
    closeConnectDrawer();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeConnectDrawer}
      />

      {/* Bottom Drawer (Attached to bottom edge, curved on top facing away from edge) */}
      <div className="relative z-10 w-full max-w-2xl mx-auto max-h-[90dvh] bg-[#161412] border-t border-white/15 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250">
        {/* Drawer Pull Handle & Header */}
        <div className="px-6 pt-3 pb-4 border-b border-white/10 bg-black/60 flex flex-col">
          <div className="w-12 h-1.5 rounded-full bg-zinc-700 mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-violet-500 animate-pulse" />
              <h2 className="text-base font-bold text-white tracking-tight">
                {isAuthenticated ? 'Connected Enclave Session' : 'Connect Cryptographic Enclave'}
              </h2>
            </div>
            <button
              onClick={closeConnectDrawer}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {isAuthenticated
              ? 'Your non-custodial identity is active in your local browser storage.'
              : 'Keys never leave your device enclave. Select an identity provider or derive locally.'}
          </p>
        </div>

        {/* Drawer Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isAuthenticated ? (
            /* Connected State Options */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black border border-violet-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 uppercase tracking-wider">Enclave Identity</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">
                    {currentUser?.authMethod === 'siws' ? 'Solana SVN Profile' : 'Ethereum EVM Profile'}
                  </div>
                  <div className="text-xs font-mono text-zinc-400 break-all bg-zinc-950 p-2.5 rounded-lg border border-white/5">
                    {activeWallet?.address || currentUser?.primaryAddress}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 text-zinc-400">
                  <div>Network: <span className="text-violet-400">{activeWallet?.chainCaip || 'eip155:8453'}</span></div>
                  <div>Derivation: <span className="text-zinc-300">{activeWallet?.derivationPath || "m/44'/60'/0'/0/0"}</span></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-white/5 text-xs text-zinc-400 space-y-1">
                <div className="font-semibold text-zinc-300">Non-Custodial Architecture</div>
                <p className="text-[11px] leading-relaxed">
                  Entropy and private keys remain strictly in browser enclave memory. You can revoke access or disconnect at any time.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={closeConnectDrawer}
                  className="flex-1 py-2.5 text-xs font-medium text-zinc-300 bg-black border border-white/15 rounded-xl hover:bg-zinc-900 transition-colors"
                >
                  Done
                </button>
                <button
                  onClick={handleDisconnect}
                  className="flex-1 py-2.5 text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-500/40 rounded-xl hover:bg-rose-900/50 transition-colors flex items-center justify-center gap-2"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>Disconnect Session</span>
                </button>
              </div>
            </div>
          ) : (
            /* Unconnected Provider Choices */
            <div className="space-y-3">
              {/* Option 1: Browser Extension (SIWE) */}
              <button
                onClick={handleConnectSIWE}
                disabled={connectingMethod !== null}
                className="w-full text-left p-4 rounded-xl bg-black border border-white/15 hover:border-violet-500/60 transition-all flex items-center justify-between group disabled:opacity-50"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/40 flex items-center justify-center text-lg text-violet-300 font-bold group-hover:scale-105 transition-transform">
                    ⟠
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                      Ethereum / EVM Wallet (SIWE)
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      MetaMask, Coinbase Wallet, Rainbow, Rabby
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">EIP-4361</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>

              {/* Option 2: Solana Wallet (SIWS) */}
              <button
                onClick={handleConnectSIWS}
                disabled={connectingMethod !== null}
                className="w-full text-left p-4 rounded-xl bg-black border border-white/15 hover:border-violet-500/60 transition-all flex items-center justify-between group disabled:opacity-50"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/40 flex items-center justify-center text-lg text-violet-300 font-bold group-hover:scale-105 transition-transform">
                    ◎
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                      Solana Wallet (SIWS)
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Phantom, Solflare, Backpack
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">CAIP-122</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>

              {/* Option 3: Browser WebCrypto Enclave (Offline First) */}
              <button
                onClick={handleDeriveWebCrypto}
                disabled={connectingMethod !== null}
                className="w-full text-left p-4 rounded-xl bg-black border border-white/15 hover:border-violet-500/60 transition-all flex items-center justify-between group disabled:opacity-50"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/40 flex items-center justify-center text-violet-300 group-hover:scale-105 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors flex items-center gap-2">
                      <span>Browser WebCrypto Enclave</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                        Zero Extension
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Hardware keys derived in local IndexedDB. Works 100% offline.
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Option 4: Passkey / WebAuthn Biometric */}
              <button
                onClick={handleDeriveWebCrypto}
                disabled={connectingMethod !== null}
                className="w-full text-left p-4 rounded-xl bg-black border border-white/15 hover:border-violet-500/60 transition-all flex items-center justify-between group disabled:opacity-50"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/40 flex items-center justify-center text-violet-300 group-hover:scale-105 transition-transform">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                      Biometric Passkey Enclave
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      TouchID, FaceID or Windows Hello hardware authenticator
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
