import { NextRequest, NextResponse } from 'next/server';
import { getTursoClient, initTursoSchema } from '@/lib/turso';

export async function POST(req: NextRequest) {
  try {
    const { mutations } = await req.json();

    if (!Array.isArray(mutations)) {
      return NextResponse.json({ error: 'Mutations must be an array' }, { status: 400 });
    }

    // Initialize schema if not present
    await initTursoSchema();

    const client = getTursoClient();
    const results = [];

    for (const item of mutations) {
      const { table, action, recordId, payload } = item;

      try {
        if (table === 'wallets') {
          if (action === 'insert') {
            await client.execute({
              sql: `INSERT OR REPLACE INTO wallets (id, user_id, chain_caip, address, derivation_path, label, config, is_primary, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                payload.id || recordId,
                payload.userId || 'usr_anonymous',
                payload.chainCaip,
                payload.address,
                payload.derivationPath,
                payload.label,
                JSON.stringify(payload.config || {}),
                payload.isPrimary ? 1 : 0,
                payload.createdAt || new Date().toISOString(),
              ],
            });
          }
        } else if (table === 'grants') {
          if (action === 'insert') {
            await client.execute({
              sql: `INSERT OR REPLACE INTO subscription_grants (id, user_id, wallet_id, merchant_id, asset_address, max_amount_per_interval, billing_interval_seconds, next_charge_at, status, signature_proof, metadata, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                payload.id || recordId,
                payload.userId || 'usr_anonymous',
                payload.walletId,
                payload.merchantId,
                payload.assetAddress,
                payload.maxAmountPerInterval,
                payload.billingIntervalSeconds,
                payload.nextChargeAt,
                payload.status || 'active',
                payload.signatureProof || '',
                JSON.stringify(payload.metadata || {}),
                payload.createdAt || new Date().toISOString(),
              ],
            });
          } else if (action === 'update') {
            await client.execute({
              sql: `UPDATE subscription_grants SET status = ? WHERE id = ?`,
              args: [payload.status || 'revoked', recordId],
            });
          }
        } else if (table === 'ledger') {
          if (action === 'insert') {
            await client.execute({
              sql: `INSERT OR REPLACE INTO settlement_ledger (id, grant_id, merchant_id, wallet_id, amount, asset_address, tx_hash, status, metadata, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                payload.id || recordId,
                payload.grantId || null,
                payload.merchantId,
                payload.walletId,
                payload.amount,
                payload.assetAddress,
                payload.txHash || null,
                payload.status,
                JSON.stringify(payload.metadata || {}),
                payload.createdAt || new Date().toISOString(),
              ],
            });
          }
        }

        results.push({ recordId, status: 'synced' });
      } catch (err: any) {
        console.warn(`Turso sync mutation error for ${table}:`, err?.message);
        results.push({ recordId, status: 'error', error: err?.message });
      }
    }

    return NextResponse.json({
      success: true,
      syncedCount: results.filter((r) => r.status === 'synced').length,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Sync failed' }, { status: 500 });
  }
}
