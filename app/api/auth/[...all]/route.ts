import { NextRequest, NextResponse } from 'next/server';
import { getTursoClient } from '@/lib/turso';

export async function GET(req: NextRequest) {
  const { pathname } = new URL(req.url);

  if (pathname.endsWith('/session')) {
    // Return session or null
    return NextResponse.json({ session: null });
  }

  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}

export async function POST(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const body = await req.json();

    if (pathname.includes('/siwe')) {
      const { address, signature, message } = body;
      if (!address || !signature) {
        return NextResponse.json({ error: 'Missing SIWE credentials' }, { status: 400 });
      }

      const client = getTursoClient();
      const userId = `usr_${address.toLowerCase().slice(0, 10)}`;

      // Upsert user into Turso
      try {
        await client.execute({
          sql: `INSERT INTO users (id, email, created_at) VALUES (?, NULL, ?) ON CONFLICT (id) DO NOTHING`,
          args: [userId, new Date().toISOString()],
        });
      } catch (dbErr) {
        console.warn('Database note during SIWE:', dbErr);
      }

      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          primaryAddress: address,
          authMethod: 'siwe',
          createdAt: new Date().toISOString(),
        },
      });
    }

    if (pathname.includes('/siws')) {
      const { address, signature } = body;
      if (!address) {
        return NextResponse.json({ error: 'Missing SIWS credentials' }, { status: 400 });
      }

      const client = getTursoClient();
      const userId = `usr_${address.slice(0, 8)}`;

      try {
        await client.execute({
          sql: `INSERT INTO users (id, email, created_at) VALUES (?, NULL, ?) ON CONFLICT (id) DO NOTHING`,
          args: [userId, new Date().toISOString()],
        });
      } catch (dbErr) {
        console.warn('Database note during SIWS:', dbErr);
      }

      return NextResponse.json({
        success: true,
        user: {
          id: userId,
          primaryAddress: address,
          authMethod: 'siws',
          createdAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Auth route failure';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
