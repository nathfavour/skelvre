'use client';

import React from 'react';
import Link from 'next/link';
import { useSkelvre } from '@/lib/store';

export function TopBar() {
  const { isAuthenticated, openConnectDrawer } = useSkelvre();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-5 sm:px-8 py-3.5 bg-[#161412] border-b border-white/15 rounded-b-2xl shadow-lg">
      {/* Left: App Logo (and App Name on desktop) */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:text-violet-400 transition-colors whitespace-nowrap shrink-0 group"
          title="Skelvre Home"
        >
          <span className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white text-xs font-mono font-bold shadow-md shadow-violet-600/50 group-hover:scale-105 transition-transform">
            SK
          </span>
          <span className="hidden md:inline font-extrabold tracking-tight text-base sm:text-lg">
            Skelvre
          </span>
        </Link>
      </div>

      {/* Right: Just the 'Connect' Button */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={openConnectDrawer}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-sm ${
            isAuthenticated
              ? 'bg-black border border-violet-500/50 text-white hover:bg-zinc-950 flex items-center gap-2'
              : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/30'
          }`}
        >
          {isAuthenticated ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Connected</span>
            </>
          ) : (
            <span>Connect</span>
          )}
        </button>
      </div>
    </header>
  );
}
