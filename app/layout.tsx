import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Skelvre | Non-Custodial Multi-Chain Subscriptions & Agentic Payments',
  description: 'Non-custodial, multi-chain subscription and agentic payment platform with client-side WebCrypto enclaves and MCP gateway.',
  openGraph: {
    title: 'Skelvre | Non-Custodial Multi-Chain Subscriptions & Agentic Payments',
    description: 'Non-custodial, multi-chain subscription and agentic payment platform with client-side WebCrypto enclaves and MCP gateway.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skelvre | Non-Custodial Multi-Chain Subscriptions & Agentic Payments',
    description: 'Non-custodial, multi-chain subscription and agentic payment platform with client-side WebCrypto enclaves and MCP gateway.',
  },
};

import { Providers } from '@/components/providers';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#161412] text-zinc-100 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
