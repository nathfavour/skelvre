import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const viewport: Viewport = {
  themeColor: '#161412',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Skelvre | Non-Custodial Multi-Chain Subscriptions & Agentic Payments',
  description: 'Non-custodial, offline-first multi-chain subscription and agentic payment platform with client-side WebCrypto enclaves and MCP gateway.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Skelvre',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Skelvre | Non-Custodial Multi-Chain Subscriptions & Agentic Payments',
    description: 'Non-custodial, offline-first multi-chain subscription and agentic payment platform with client-side WebCrypto enclaves and MCP gateway.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skelvre | Non-Custodial Multi-Chain Subscriptions & Agentic Payments',
    description: 'Non-custodial, offline-first multi-chain subscription and agentic payment platform with client-side WebCrypto enclaves and MCP gateway.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#161412] text-zinc-100 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
