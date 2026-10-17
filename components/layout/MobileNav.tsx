'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSkelvre } from '@/lib/store';
import { SUPPORTED_CHAINS } from '@/lib/mock-data';
import {
  X,
  LayoutDashboard,
  Wallet as WalletIcon,
  Repeat,
  Bot,
  Terminal,
  Settings,
  Shield,
  Plus,
  Fingerprint,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const {
    mobileNavOpen,
    setMobileNavOpen,
    mobileDrawer,
    closeMobileDrawer,
    wallets,
    activeWallet,
    setActiveWalletId,
    activeSignRequest,
    approveActiveSignRequest,
    rejectActiveSignRequest,
    openMobileDrawer,
    isEnclaveLocked,
  } = useSkelvre();

  const navLinks = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'Wallets', href: '/wallets', icon: WalletIcon },
    { label: 'Subscriptions', href: '/subscriptions', icon: Repeat },
    { label: 'Agents & MCP', href: '/agents', icon: Bot },
    { label: 'Developers & x402', href: '/developers', icon: Terminal },
    { label: 'Settings & Security', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* 1. MOBILE TOP DRAWER (Navigation Sheet) */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-start">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />

          <div className="relative z-10 w-full bg-[#161412] border-b border-white/15 p-5 shadow-2xl space-y-4 animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white text-xs font-mono font-bold">
                  SK
                </span>
                <span className="font-bold text-white tracking-tight">Skelvre Menu</span>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-black border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="grid grid-cols-2 gap-2">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-2.5 p-3 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-black text-white border border-indigo-500/50 shadow-sm'
                        : 'bg-black/40 text-zinc-400 hover:text-zinc-200 border border-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Wallet Switcher */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="text-zinc-400">
                Active: <span className="text-white font-medium">{activeWallet.label}</span>
              </div>
              <span className="text-indigo-400 tabular-nums">
                ${activeWallet.balanceUsd.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. MOBILE BOTTOM DRAWER (Pulls up to 100dvh for detailed interactions) */}
      {mobileDrawer.isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeMobileDrawer}
          />

          <div className="relative z-10 w-full h-[85dvh] max-h-[100dvh] bg-[#161412] border-t border-white/15 rounded-t-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* Grab Bar & Header */}
            <div className="p-4 border-b border-white/15 bg-black rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <h3 className="text-sm font-semibold text-white">
                  {mobileDrawer.title || 'Interactive Drawer'}
                </h3>
              </div>
              <button
                onClick={closeMobileDrawer}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {mobileDrawer.type === 'sign_request' && activeSignRequest && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-black border border-indigo-500/40 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase">
                      <Fingerprint className="w-4 h-4" />
                      <span>Signer Relay Authorization</span>
                    </div>
                    <p className="text-sm font-medium text-white">{activeSignRequest.title}</p>
                    <p className="text-xs text-zinc-400">{activeSignRequest.description}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-black border border-white/10 font-mono text-xs space-y-2">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Allowance</span>
                      <span className="text-white font-medium">
                        {activeSignRequest.amount} {activeSignRequest.assetSymbol}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-400">Network</span>
                      <span className="text-indigo-400">{activeSignRequest.chainCaip}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      onClick={rejectActiveSignRequest}
                      className="flex-1 py-3 text-xs font-medium text-zinc-300 bg-black border border-white/15 rounded-lg"
                    >
                      Decline
                    </button>
                    <button
                      onClick={approveActiveSignRequest}
                      className="flex-1 py-3 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 flex items-center justify-center gap-2"
                    >
                      <Fingerprint className="w-4 h-4" />
                      <span>Authorize Enclave</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
