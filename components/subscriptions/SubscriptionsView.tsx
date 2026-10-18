'use client';

import React, { useState } from 'react';
import { useSkelvre } from '@/lib/store';
import { SubscriptionGrant } from '@/lib/types';
import {
  Repeat,
  Plus,
  ShieldAlert,
  Play,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  ChevronRight,
} from 'lucide-react';

export function SubscriptionsView() {
  const {
    grants,
    merchants,
    openRightSidebar,
    revokeSubscriptionGrant,
    simulateSubscriptionPull,
  } = useSkelvre();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'revoked'>('all');
  const [copiedProofId, setCopiedProofId] = useState<string | null>(null);
  const [isPullingId, setIsPullingId] = useState<string | null>(null);

  const copyProof = (proof: string, id: string) => {
    navigator.clipboard.writeText(proof);
    setCopiedProofId(id);
    setTimeout(() => setCopiedProofId(null), 2000);
  };

  const filteredGrants = grants.filter((g) => {
    if (statusFilter === 'active') return g.status === 'active';
    if (statusFilter === 'revoked') return g.status === 'revoked';
    return true;
  });

  const totalMonthlyBurn = grants
    .filter((g) => g.status === 'active')
    .reduce((acc, g) => acc + parseFloat(g.maxAmountPerInterval), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-black border border-white/15">
        <div>
          <div className="text-xs font-mono text-zinc-400">
            <span>Cryptographic Pull Protocol</span>
            <span aria-hidden="true"> · </span>
            <span>EIP-712 & Ed25519 Allowances</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Subscription Grants & Recurring Pulls
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Authorize third-party services to pull capped recurring micro-payments without custodial access to your private keys. Every grant is verifiable and instantly revocable.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block text-right font-mono text-xs pr-2">
            <div className="text-zinc-500">Max Active Burn</div>
            <div className="text-sm font-bold text-white tabular-nums">${totalMonthlyBurn.toFixed(2)}/mo</div>
          </div>

          <button
            onClick={() => openRightSidebar('create_grant', null, 'Authorize Recurring Pull Subscription')}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors shadow-md shadow-violet-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Subscription Grant</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-black rounded-lg border border-white/10 text-xs font-mono">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded transition-colors ${
              statusFilter === 'all' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Grants ({grants.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded transition-colors ${
              statusFilter === 'active' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Active ({grants.filter((g) => g.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('revoked')}
            className={`px-3 py-1.5 rounded transition-colors ${
              statusFilter === 'revoked' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Revoked ({grants.filter((g) => g.status === 'revoked').length})
          </button>
        </div>

        <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
          Zero custodial escrow. Local client-signed proofs only.
        </span>
      </div>

      {/* Grants Cards List */}
      {filteredGrants.length === 0 ? (
        <div className="p-12 rounded-xl bg-black border border-white/15 text-center space-y-4">
          <Repeat className="w-10 h-10 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Subscription Grants</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Create a cryptographic pull grant to authorize automated recurring billing for verified merchants.
            </p>
          </div>
          <button
            onClick={() => openRightSidebar('create_grant', null, 'Authorize Recurring Pull Subscription')}
            className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors shadow-md shadow-violet-600/30"
          >
            + Authorize Subscription Grant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGrants.map((grant) => {
            const isActive = grant.status === 'active';
            const intervalDays = Math.round(grant.billingIntervalSeconds / 86400);

            return (
              <div
                key={grant.id}
                className={`p-5 rounded-xl bg-black border transition-all flex flex-col justify-between space-y-4 ${
                  isActive ? 'border-white/15 hover:border-violet-500/50' : 'border-white/5 opacity-70'
                }`}
              >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400 font-semibold">{grant.merchantName}</span>
                  <span
                    className={`text-[11px] font-medium ${
                      isActive ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isActive ? 'Active Allowance' : 'Revoked'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {grant.metadata?.planName || 'Recurring Stream'}
                </h3>

                <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                  ${grant.maxAmountPerInterval}{' '}
                  <span className="text-sm font-normal text-zinc-400">
                    {grant.assetSymbol} / {intervalDays}d
                  </span>
                </div>
              </div>

              {/* Timing & Dates */}
              <div className="p-3 rounded-lg bg-zinc-950 border border-white/5 font-mono text-xs space-y-1.5">
                <div className="flex justify-between text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Next Charge</span>
                  </span>
                  <span className="text-white tabular-nums">
                    {new Date(grant.nextChargeAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Created</span>
                  </span>
                  <span className="text-zinc-400 tabular-nums">
                    {new Date(grant.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Signature Proof snippet */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Cryptographic Proof</span>
                  <button
                    onClick={() => copyProof(grant.signatureProof, grant.id)}
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    {copiedProofId === grant.id ? 'Copied' : 'Copy'}
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-2 rounded bg-zinc-950 border border-white/5 font-mono text-[11px] text-zinc-400 truncate">
                  {grant.signatureProof}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                {isActive ? (
                  <>
                    <button
                      onClick={async () => {
                        setIsPullingId(grant.id);
                        try {
                          await simulateSubscriptionPull(grant.id);
                        } finally {
                          setIsPullingId(null);
                        }
                      }}
                      disabled={isPullingId === grant.id}
                      className="flex-1 py-2 text-xs font-mono font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-violet-600/30 disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isPullingId === grant.id ? 'Settling...' : 'Simulate Pull'}</span>
                    </button>

                    <button
                      onClick={() => revokeSubscriptionGrant(grant.id)}
                      className="p-2 text-rose-400 hover:text-rose-300 bg-rose-950/30 border border-rose-500/30 rounded-lg transition-colors"
                      title="Cryptographically Revoke Grant"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="w-full py-2 text-xs font-mono text-center text-zinc-500 bg-zinc-950 rounded-lg border border-white/5">
                    Permission Revoked On-Chain
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
    </div>
  );
}
