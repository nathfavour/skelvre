'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSkelvre } from '@/lib/store';
import { Lock, Unlock, ShieldCheck, Power, Wifi, WifiOff, RefreshCw, HardDrive } from 'lucide-react';
import { PWAInstallButton } from '@/components/pwa/PWAInstallButton';

export function TopBar() {
  const pathname = usePathname();
  const {
    isAuthenticated,
    currentUser,
    isEnclaveLocked,
    lockEnclave,
    unlockEnclave,
    signInWithEthereum,
    signInWithSolana,
    signOut,
    openRightSidebar,
    isOnline,
    pendingSyncCount,
    syncStatus,
    syncWithEdge,
  } = useSkelvre();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-5 py-3.5 bg-[#161412] border-b border-white/15">
      {/* Zone 1: Brand Wordmark. Clicking the logo goes home. Zero 3-dots. */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:text-violet-400 transition-colors whitespace-nowrap shrink-0 group"
          title="Skelvre Home — Return to Overview"
        >
          <span className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-mono font-bold shadow-sm shadow-violet-600/50 group-hover:scale-105 transition-transform">
            SK
          </span>
          <span className="font-extrabold tracking-tight">Skelvre</span>
        </Link>
      </div>

      {/* Zone 2: Desktop clean single-line navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-400">
        <Link
          href="/"
          className={`transition-colors whitespace-nowrap shrink-0 ${
            pathname === '/' ? 'text-white font-semibold' : 'hover:text-zinc-200'
          }`}
        >
          Overview
        </Link>
        <Link
          href="/wallets"
          className={`transition-colors whitespace-nowrap shrink-0 ${
            pathname === '/wallets' ? 'text-white font-semibold' : 'hover:text-zinc-200'
          }`}
        >
          Wallets
        </Link>
        <Link
          href="/subscriptions"
          className={`transition-colors whitespace-nowrap shrink-0 ${
            pathname === '/subscriptions' ? 'text-white font-semibold' : 'hover:text-zinc-200'
          }`}
        >
          Subscriptions
        </Link>
        <Link
          href="/agents"
          className={`transition-colors whitespace-nowrap shrink-0 ${
            pathname === '/agents' ? 'text-white font-semibold' : 'hover:text-zinc-200'
          }`}
        >
          Agents & MCP
        </Link>
        <Link
          href="/developers"
          className={`transition-colors whitespace-nowrap shrink-0 ${
            pathname === '/developers' ? 'text-white font-semibold' : 'hover:text-zinc-200'
          }`}
        >
          Developers
        </Link>
      </nav>

      {/* Zone 3: Offline status, Enclave security, and Account identity (Zero wallet address string) */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* In-app PWA install button */}
        <PWAInstallButton />

        {/* Offline First & Sync Status Indicator */}
        <button
          onClick={syncWithEdge}
          title={
            !isOnline
              ? 'Device is Offline — Dexie local storage is active'
              : pendingSyncCount > 0
              ? `${pendingSyncCount} operations queued offline. Click to sync with edge.`
              : 'Offline First: Local Dexie IndexedDB Active (Optional Edge Sync Idle)'
          }
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
            !isOnline
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              : pendingSyncCount > 0
              ? 'bg-violet-950/50 border-violet-500/50 text-violet-300 hover:bg-violet-900/50'
              : 'bg-black border-white/10 text-zinc-400 hover:text-zinc-300'
          }`}
        >
          {!isOnline ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span>Offline First</span>
            </>
          ) : syncStatus === 'syncing' ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-violet-400 animate-spin" />
              <span>Syncing...</span>
            </>
          ) : pendingSyncCount > 0 ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
              <span>{pendingSyncCount} Queued</span>
            </>
          ) : (
            <>
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span>IndexedDB Active</span>
            </>
          )}
        </button>

        {/* Enclave Lock Status */}
        <button
          onClick={() => (isEnclaveLocked ? unlockEnclave() : lockEnclave())}
          title={isEnclaveLocked ? 'Enclave Locked - Click to Unlock' : 'Hardware Enclave Active - Click to Lock'}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
            isEnclaveLocked
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
              : 'bg-black border-white/15 text-zinc-300 hover:border-violet-500/50'
          }`}
        >
          {isEnclaveLocked ? (
            <>
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Locked</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
              <span>Enclave Active</span>
            </>
          )}
        </button>

        {/* Primary Action Button (Zero raw wallet addresses in topbar) */}
        {isAuthenticated ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => openRightSidebar('wallet_details', null, 'Client Enclave Identity')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-black border border-white/15 rounded-lg hover:border-violet-500/60 hover:bg-zinc-950 transition-colors whitespace-nowrap shrink-0 font-mono"
              title="Client Enclave Session Active"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold tracking-tight">
                {currentUser?.authMethod === 'siws' ? 'Solana Enclave' : 'Ethereum Enclave'}
              </span>
            </button>
            <button
              onClick={signOut}
              title="Disconnect Enclave Session"
              className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-950 transition-colors"
            >
              <Power className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => signInWithEthereum()}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-violet-600/30"
            >
              Connect SIWE
            </button>
            <button
              onClick={() => signInWithSolana()}
              className="hidden sm:inline-block px-3 py-1.5 text-xs font-medium text-zinc-300 bg-black border border-white/15 rounded-lg hover:text-white hover:border-violet-500/50 transition-colors whitespace-nowrap shrink-0 font-mono"
            >
              SIWS (SVM)
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
