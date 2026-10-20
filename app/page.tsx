'use client';

import { useSkelvre } from '@/lib/store';
import { Shell } from '@/components/layout/Shell';
import { OverviewView } from '@/components/dashboard/OverviewView';
import { LandingPage } from '@/components/landing/LandingPage';

export default function HomePage() {
  const { isAuthenticated } = useSkelvre();

  return (
    <Shell>
      {isAuthenticated ? <OverviewView /> : <LandingPage />}
    </Shell>
  );
}
