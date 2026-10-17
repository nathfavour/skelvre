'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSkelvre } from '@/lib/store';
import { SUPPORTED_CHAINS } from '@/lib/mock-data';
import {
  LayoutDashboard,
  Wallet as WalletIcon,
  Repeat,
  Bot,
  Terminal,
  Settings,
  Shield,
  Plus,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export function LeftSidebar() {
  const pathname = usePathname();
  const {
    wallets,
    activeWallet,
    setActiveWalletId,
    openRightSidebar,
    isEnclaveLocked,
  } = useSkelvre();

  const navItems = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'Wallets', href: '/wallets', icon: WalletIcon },
    { label: 'Subscriptions', href: '/subscriptions', icon: Repeat },
    { label: 'Agents & MCP', href: '/agents', icon: Bot },
    { label: 'Developers & x402', href: '/developers', icon: Terminal },
    { label: 'Settings & Security', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-57px)] sticky top-[57px] bg-[#161412] border-r border-white/15 p-4 shrink-0 overflow-y-auto">
      {/* Primary Navigation */}
      <div className="space-y-1 mb-6">
        <div className="px-3 pb-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-black text-white border border-white/15 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-black/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-indigo-400' : 'text-zinc-500'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Multi-Chain Wallets Well */}
      <div className="mb-6 p-3 rounded-lg bg-black border border-white/15 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase text-zinc-400">
            Active Enclave
          </span>
          <button
            onClick={() => openRightSidebar('add_wallet', null, 'Derive New Universal Wallet')}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
            title="Derive new chain wallet"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {wallets.map((wallet) => {
            const chain = SUPPORTED_CHAINS[wallet.chainCaip];
            const isSelected = wallet.id === activeWallet.id;
            return (
              <button
                key={wallet.id}
                onClick={() => setActiveWalletId(wallet.id)}
                className={`w-full text-left p-2 rounded border transition-all text-xs ${
                  isSelected
                    ? 'bg-zinc-950 border-indigo-500/50 text-white'
                    : 'bg-black border-transparent text-zinc-400 hover:text-zinc-300 hover:bg-zinc-950/60'
                }`}
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-medium text-white truncate max-w-[120px]">
                    {wallet.label}
                  </span>
                  <span className="text-[11px] text-indigo-400">
                    {chain?.symbol || 'ETH'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono mt-1 tabular-nums">
                  <span>{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
                  <span className="text-zinc-300 font-medium">${wallet.balanceUsd.toLocaleString()}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enclave Security Status */}
      <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
        <div className="p-3 rounded-lg bg-black/60 border border-white/10 text-xs font-mono space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Key Custody</span>
            </span>
            <span className="text-[10px] text-emerald-400">Client Enclave</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
            Private entropy never leaves browser memory. Zero server-side custody.
          </p>
          <button
            onClick={() => openRightSidebar('guardrail_settings', null, 'Security Guardrail Parameters')}
            className="w-full mt-2 flex items-center justify-between text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors pt-1"
          >
            <span>Adjust Guardrails</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
}
