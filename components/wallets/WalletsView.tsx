'use client';

import React, { useState } from 'react';
import { useSkelvre } from '@/lib/store';
import { SUPPORTED_CHAINS } from '@/lib/mock-data';
import { ChainCAIP, Wallet } from '@/lib/types';
import {
  Wallet as WalletIcon,
  Plus,
  Shield,
  Copy,
  ExternalLink,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Lock,
  Unlock,
} from 'lucide-react';

export function WalletsView() {
  const {
    wallets,
    activeWallet,
    setActiveWalletId,
    openRightSidebar,
    isEnclaveLocked,
    lockEnclave,
    unlockEnclave,
  } = useSkelvre();

  const [filterType, setFilterType] = useState<'all' | 'evm' | 'solana'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyAddress = (addr: string, id: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredWallets = wallets.filter((w) => {
    const chain = SUPPORTED_CHAINS[w.chainCaip];
    if (filterType === 'evm') return chain?.type === 'evm';
    if (filterType === 'solana') return chain?.type === 'solana';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-black border border-white/15">
        <div>
          <div className="text-xs font-mono text-zinc-400">
            <span>Client Enclave Storage</span>
            <span aria-hidden="true"> · </span>
            <span>BIP-44 Universal Derivations</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Infinite Multi-Chain Wallets
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Skelvre decouples wallets from hardcoded chains using CAIP-2 standard identifiers. All keys are derived inside your local WebCrypto enclave.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => (isEnclaveLocked ? unlockEnclave() : lockEnclave())}
            className={`px-3 py-2 text-xs font-mono rounded-lg border transition-colors flex items-center gap-2 ${
              isEnclaveLocked
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                : 'bg-zinc-950 border-white/15 text-zinc-300 hover:border-indigo-500'
            }`}
          >
            {isEnclaveLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{isEnclaveLocked ? 'Enclave Locked' : 'Enclave Active'}</span>
          </button>

          <button
            onClick={() => openRightSidebar('add_wallet', null, 'Derive New Universal Wallet')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Derive New Wallet</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-black rounded-lg border border-white/10 text-xs font-mono">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded transition-colors ${
              filterType === 'all' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Chains ({wallets.length})
          </button>
          <button
            onClick={() => setFilterType('evm')}
            className={`px-3 py-1.5 rounded transition-colors ${
              filterType === 'evm' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            EVM (Base, ETH, Arb)
          </button>
          <button
            onClick={() => setFilterType('solana')}
            className={`px-3 py-1.5 rounded transition-colors ${
              filterType === 'solana' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Solana (SVM)
          </button>
        </div>

        <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
          Showing {filteredWallets.length} active derivation paths
        </span>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWallets.map((wallet) => {
          const chain = SUPPORTED_CHAINS[wallet.chainCaip];
          const isSelected = wallet.id === activeWallet.id;

          return (
            <div
              key={wallet.id}
              className={`p-5 rounded-xl bg-black border transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-indigo-500/60 shadow-lg shadow-indigo-950/20'
                  : 'border-white/15 hover:border-white/30'
              }`}
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span>{chain?.icon || '⚡'}</span>
                    <span className="font-semibold text-white">{chain?.name}</span>
                  </span>
                  <span className="text-[11px] text-zinc-500">{wallet.chainCaip}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <h3 className="text-base font-bold text-white truncate max-w-[180px]">
                    {wallet.label}
                  </h3>
                  {wallet.isPrimary && (
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/40">
                      Primary
                    </span>
                  )}
                </div>

                {/* Address Box */}
                <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-white/5 font-mono text-xs text-zinc-400">
                  <span className="truncate">
                    {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                  </span>
                  <button
                    onClick={() => copyAddress(wallet.address, wallet.id)}
                    className="p-1 text-zinc-500 hover:text-white transition-colors ml-2 shrink-0"
                    title="Copy address"
                  >
                    {copiedId === wallet.id ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Balances & BIP-44 */}
              <div className="p-3 rounded-lg bg-zinc-950/60 border border-white/5 font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Balance USD</span>
                  <span className="text-white font-bold tabular-nums">
                    ${wallet.balanceUsd.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Native Asset</span>
                  <span className="text-indigo-400">{wallet.nativeBalance}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-1.5 text-[11px]">
                  <span className="text-zinc-500">Derivation</span>
                  <span className="text-zinc-400">{wallet.derivationPath}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {!isSelected ? (
                  <button
                    onClick={() => setActiveWalletId(wallet.id)}
                    className="flex-1 py-1.5 text-xs font-mono font-medium text-zinc-300 bg-zinc-950 border border-white/10 rounded-lg hover:bg-zinc-900 transition-colors"
                  >
                    Set as Active
                  </button>
                ) : (
                  <div className="flex-1 py-1.5 text-xs font-mono text-center text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 rounded-lg">
                    Active Target
                  </div>
                )}

                <button
                  onClick={() => openRightSidebar('wallet_details', wallet, 'Wallet Configuration')}
                  className="p-2 text-zinc-400 hover:text-white bg-zinc-950 border border-white/10 rounded-lg transition-colors"
                  title="Configure wallet parameters & RPC"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
