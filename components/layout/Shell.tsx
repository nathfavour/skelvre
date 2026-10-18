'use client';

import React from 'react';
import { TopBar } from './TopBar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { MobileNav } from './MobileNav';

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#161412] text-zinc-100 flex flex-col font-sans selection:bg-violet-600 selection:text-white">
      {/* Top Bar (Sticky, 3-zone contract) */}
      <TopBar />

      <div className="flex-1 flex max-w-[1920px] w-full mx-auto relative">
        {/* Left Sidebar (Desktop Fixed) */}
        <LeftSidebar />

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
          {children}
        </main>

        {/* Right Sidebar (Desktop Dynamic Lateral Drawer) */}
        <RightSidebar />
      </div>

      {/* Mobile Top & Bottom Drawers */}
      <MobileNav />
    </div>
  );
}
