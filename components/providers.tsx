'use client';

import React from 'react';
import { SkelvreProvider } from '@/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SkelvreProvider>{children}</SkelvreProvider>;
}
