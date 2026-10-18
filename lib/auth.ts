/**
 * Better Auth & Cryptographic Identity Gateway
 *
 * Implements SIWE (Sign In With Ethereum, EIP-4361) and SIWS (Sign In With Solana)
 * mapping decentralized cryptographic accounts to user profiles, backed by Turso.
 */

export interface AuthSession {
  user: {
    id: string;
    primaryAddress: string;
    chain: 'evm' | 'solana';
    email?: string | null;
    createdAt: string;
  };
  expiresAt: string;
}

export async function createSiweMessage(address: string, chainId: number = 8453): Promise<{ message: string; nonce: string }> {
  const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const domain = typeof window !== 'undefined' ? window.location.host : 'skelvre.network';
  const uri = typeof window !== 'undefined' ? window.location.origin : 'https://skelvre.network';
  const issuedAt = new Date().toISOString();

  const message = `${domain} wants you to sign in with your Ethereum account:
${address}

Sign In With Ethereum (SIWE) to access Skelvre non-custodial gateway.

URI: ${uri}
Version: 1
Chain ID: ${chainId}
Nonce: ${nonce}
Issued At: ${issuedAt}`;

  return { message, nonce };
}

export async function createSiwsMessage(address: string): Promise<{ message: string; nonce: string }> {
  const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const domain = typeof window !== 'undefined' ? window.location.host : 'skelvre.network';
  const issuedAt = new Date().toISOString();

  const message = `${domain} wants you to sign in with your Solana account:
${address}

Sign In With Solana (SIWS) for Skelvre edge agent session.

Nonce: ${nonce}
Issued At: ${issuedAt}`;

  return { message, nonce };
}
