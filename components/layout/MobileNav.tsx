'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSkelvre } from '@/lib/store';
import {
  X,
  LayoutDashboard,
  Wallet as WalletIcon,
  Repeat,
  Bot,
  Fingerprint,
} from 'lucide-react';
import { ConnectDrawer } from '@/components/auth/ConnectDrawer';

export function MobileNav() {
  const pathname = usePathname();
  const {
    isAuthenticated,
    mobileDrawer,
    closeMobileDrawer,
    activeSignRequest,
    approveActiveSignRequest,
    rejectActiveSignRequest,
  } = useSkelvre();

  // Exactly 4 items max for mobile bottom navbar
  const navLinks = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'Wallets', href: '/wallets', icon: WalletIcon },
    { label: 'Subs', href: '/subscriptions', icon: Repeat },
    { label: 'Agents', href: '/agents', icon: Bot },
  ];

  // User requirement: "Get rid of the bottom navbar in landing please."
  const isLandingPage = pathname === '/' && !isAuthenticated;

  return (
    <>
      {/* 1. MOBILE BOTTOM NAVBAR (Max 4 items, curved top edge facing away from bottom, hidden on landing) */}
      {!isLandingPage && (
        <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden h-16 bg-black/95 backdrop-blur-md border-t border-white/15 rounded-t-2xl px-4 flex items-center justify-around shadow-2xl">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-violet-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? 'bg-violet-950/70 border border-violet-500/40 text-violet-300 shadow-sm shadow-violet-600/20' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="mt-0.5 tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* 2. DEDICATED CONNECT BOTTOM DRAWER */}
      <ConnectDrawer />

      {/* 3. SIGNER RELAY BOTTOM DRAWER (Full interactive 85-100dvh for signing) */}
      {mobileDrawer.isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeMobileDrawer}
          />

          <div className="relative z-10 w-full h-[85dvh] max-h-[100dvh] bg-[#161412] border-t border-white/15 rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* Grab Bar & Header */}
            <div className="p-4 border-b border-white/15 bg-black rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500" />
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
                  <div className="p-4 rounded-xl bg-black border border-violet-500/40 space-y-2">
                    <div className="flex items-center gap-2 text-violet-400 text-xs font-mono uppercase">
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
                      <span className="text-violet-400">{activeSignRequest.chainCaip}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      onClick={rejectActiveSignRequest}
                      className="flex-1 py-3 text-xs font-medium text-zinc-300 bg-black border border-white/15 rounded-xl"
                    >
                      Decline
                    </button>
                    <button
                      onClick={approveActiveSignRequest}
                      className="flex-1 py-3 text-xs font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-500 flex items-center justify-center gap-2"
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
