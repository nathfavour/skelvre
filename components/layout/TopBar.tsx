'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSkelvre } from '@/lib/store';
import { SUPPORTED_CHAINS } from '@/lib/mock-data';
import { Lock, Unlock, ShieldCheck, Menu } from 'lucide-react';

export function TopBar() {
  const pathname = usePathname();
  const {
    isAuthenticated,
    currentUser,
    activeWallet,
    isEnclaveLocked,
    lockEnclave,
    unlockEnclave,
    signInWithEthereum,
    signOut,
    setMobileNavOpen,
    openRightSidebar,
  } = useSkelvre();

  const chainInfo = SUPPORTED_CHAINS[activeWallet.chainCaip];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-5 py-3.5 bg-[#161412] border-b border-white/15">
      {/* Zone 1: Single text element wordmark + Mobile menu trigger */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setMobileNavOpen(true)}
          className="md:hidden p-1.5 text-zinc-400 hover:text-white transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-white hover:text-violet-400 transition-colors whitespace-nowrap shrink-0"
        >
          <span className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-mono font-bold shadow-sm shadow-violet-600/50">
            SK
          </span>
          <span>Skelvre</span>
        </Link>
      </div>

      {/* Zone 2: Clean 4–5 nav links, single-line typography */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
        <Link
          href="/"
          className={`transition-colors whitespace-nowrap shrink-0 ${
            pathname === '/' ? 'text-white' : 'hover:text-zinc-200'
          }`}
        >
          Overview
        </Link>
        <Link
          href="/wallets"
          className={`transition-colors whitespace-nowrap shrink-0 ${
            pathname === '/wallets' ? 'text-white' : 'hover:text-zinc-200'
          }`}
        >
          Wallets
        </Link>
        <Link
          href="/subscriptions"
          className={`transition-colors whitespace-nowrap shrink-0 ${
            pathname === '/subscriptions' ? 'text-white' : 'hover:text-zinc-200'
          }`}
        >
          Subscriptions
        </Link>
        <Link
          href="/agents"
          className={`transition-colors whitespace-nowrap shrink-0 ${
            pathname === '/agents' ? 'text-white' : 'hover:text-zinc-200'
          }`}
        >
          Agents & MCP
        </Link>
        <Link
          href="/developers"
          className={`transition-colors whitespace-nowrap shrink-0 ${
            pathname === '/developers' ? 'text-white' : 'hover:text-zinc-200'
          }`}
        >
          Developers
        </Link>
      </nav>

      {/* Zone 3: 1 primary action / enclave security identity */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Enclave Lock Status */}
        <button
          onClick={() => (isEnclaveLocked ? unlockEnclave() : lockEnclave())}
          title={isEnclaveLocked ? 'Enclave Locked - Click to Unlock' : 'Hardware Enclave Active - Click to Lock'}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border transition-colors whitespace-nowrap shrink-0 ${
            isEnclaveLocked
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
              : 'bg-black border-white/15 text-zinc-300 hover:border-violet-500/50'
          }`}
        >
          {isEnclaveLocked ? (
            <>
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Enclave Locked</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
              <span>WebCrypto Enclave</span>
            </>
          )}
        </button>

        {/* Primary Action Button (Sign In / Connected Identity) */}
        {isAuthenticated ? (
          <button
            onClick={() => openRightSidebar('wallet_details', activeWallet, 'Active Wallet & Keys')}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-black border border-white/15 rounded-lg hover:border-violet-500/60 hover:bg-zinc-950 transition-colors whitespace-nowrap shrink-0"
          >
            <span className="font-mono text-violet-400">{chainInfo?.icon || '⚡'}</span>
            <span className="font-mono tabular-nums">
              {activeWallet.address.slice(0, 6)}...{activeWallet.address.slice(-4)}
            </span>
          </button>
        ) : (
          <button
            onClick={() => signInWithEthereum()}
            className="px-4 py-2 text-xs font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-violet-600/30"
          >
            Connect SIWE
          </button>
        )}
      </div>
    </header>
  );
}
