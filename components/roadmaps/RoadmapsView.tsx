'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSkelvre } from '@/lib/store';
import { ProjectRoadmapItem, ProjectCategory, RoadmapStatus, RoadmapPriority } from '@/lib/types';
import {
  Map,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Zap,
  Sliders,
  Wallet,
  Repeat,
  Bot,
  Terminal,
  HardDrive,
  Shield,
  Search,
  ArrowUpRight,
  Layers,
} from 'lucide-react';

export function RoadmapsView() {
  const { roadmaps, updateRoadmapStatus, openRightSidebar } = useSkelvre();

  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<RoadmapStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Category Icon & Color Mapping
  const categoryMeta: Record<ProjectCategory, { name: string; icon: React.ElementType; color: string }> = {
    wallets: { name: 'Universal Enclave Wallets', icon: Wallet, color: 'text-violet-400 bg-violet-950/60 border-violet-500/40' },
    subscriptions: { name: 'Recurring Pull Engine', icon: Repeat, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' },
    agents: { name: 'MCP Agent Gateway', icon: Bot, color: 'text-sky-400 bg-sky-950/60 border-sky-500/40' },
    developers: { name: 'x402 Developer Platform', icon: Terminal, color: 'text-amber-400 bg-amber-950/60 border-amber-500/40' },
    offline_sync: { name: 'Offline Storage & Edge Sync', icon: HardDrive, color: 'text-fuchsia-400 bg-fuchsia-950/60 border-fuchsia-500/40' },
    security: { name: 'Security Guardrails', icon: Shield, color: 'text-rose-400 bg-rose-950/60 border-rose-500/40' },
  };

  // Compute Overall Stats
  const totalItems = roadmaps.length;
  const completedItems = roadmaps.filter((r) => r.status === 'completed').length;
  const inProgressItems = roadmaps.filter((r) => r.status === 'in_progress').length;
  const backlogItems = roadmaps.filter((r) => r.status === 'backlog').length;
  const overallProgress = totalItems > 0 ? Math.round((roadmaps.reduce((acc, r) => acc + r.progressPercent, 0) / (totalItems * 100)) * 100) : 0;

  // Filtered Items
  const filteredRoadmaps = roadmaps.filter((r) => {
    if (selectedCategory !== 'all' && r.projectId !== selectedCategory) return false;
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.projectName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. HERO HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-black border border-white/15">
        <div>
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <Map className="w-4 h-4 text-violet-400" />
            <span>Skelvre Multi-Project Roadmaps & Capability Tracker</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Project Roadmaps & Capability Execution Hub
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Track architectural roadmaps across Skelvre pillars: Enclave Wallets, EIP-712 Subscriptions, MCP Agent Gateway, x402 Merchant Platform, Offline Storage, and Enclave Security.
          </p>
        </div>

        <button
          onClick={() => openRightSidebar('create_roadmap_item', null, 'New Project Roadmap Milestone')}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors shadow-md shadow-violet-600/30 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project Milestone</span>
        </button>
      </div>

      {/* 2. OVERALL PROGRESS GAUGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-black border border-white/15 space-y-2">
          <div className="flex justify-between text-zinc-400">
            <span>Platform Capability Score</span>
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight tabular-nums">
            {overallProgress}%
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black border border-white/15 space-y-2">
          <div className="flex justify-between text-zinc-400">
            <span>Completed Capabilities</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight tabular-nums">
            {completedItems} / {totalItems}
          </div>
          <div className="text-[11px] text-zinc-500">
            Shipped & verified on-chain
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black border border-white/15 space-y-2">
          <div className="flex justify-between text-zinc-400">
            <span>In Active Execution</span>
            <Clock className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-violet-300 tracking-tight tabular-nums">
            {inProgressItems} Milestones
          </div>
          <div className="text-[11px] text-zinc-500">
            Current sprint targets
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black border border-white/15 space-y-2">
          <div className="flex justify-between text-zinc-400">
            <span>Backlog Pipeline</span>
            <Layers className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-300 tracking-tight tabular-nums">
            {backlogItems} Upcoming
          </div>
          <div className="text-[11px] text-zinc-500">
            Scheduled feature epics
          </div>
        </div>
      </div>

      {/* 3. CONTROLS: CATEGORY TABS & SEARCH */}
      <div className="p-4 rounded-xl bg-black border border-white/15 space-y-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
              selectedCategory === 'all'
                ? 'bg-violet-600 border-violet-500 text-white font-semibold'
                : 'bg-zinc-950 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            All Projects ({roadmaps.length})
          </button>

          {(['wallets', 'subscriptions', 'agents', 'developers', 'offline_sync', 'security'] as const).map((cat) => {
            const meta = categoryMeta[cat];
            const Icon = meta.icon;
            const count = roadmaps.filter((r) => r.projectId === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-violet-600 border-violet-500 text-white font-semibold'
                    : 'bg-zinc-950 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{meta.name} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Status Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-white/10 text-xs font-mono">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 rounded transition-colors ${
                selectedStatus === 'all' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setSelectedStatus('in_progress')}
              className={`px-3 py-1 rounded transition-colors ${
                selectedStatus === 'in_progress' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              In Progress ({roadmaps.filter((r) => r.status === 'in_progress').length})
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-3 py-1 rounded transition-colors ${
                selectedStatus === 'completed' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Completed ({roadmaps.filter((r) => r.status === 'completed').length})
            </button>
            <button
              onClick={() => setSelectedStatus('backlog')}
              className={`px-3 py-1 rounded transition-colors ${
                selectedStatus === 'backlog' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Backlog ({roadmaps.filter((r) => r.status === 'backlog').length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search roadmap milestones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-950 border border-white/15 rounded-lg text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      {/* 4. ROADMAP MILESTONES GRID */}
      {filteredRoadmaps.length === 0 ? (
        <div className="p-12 rounded-xl bg-black border border-white/15 text-center space-y-3 font-mono text-xs text-zinc-500">
          <Map className="w-8 h-8 text-zinc-600 mx-auto" />
          <p>No project roadmap milestones match your selected filter.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            className="px-3 py-1.5 text-violet-300 bg-violet-950/60 border border-violet-500/30 rounded"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRoadmaps.map((item) => {
            const meta = categoryMeta[item.projectId] || {
              name: item.projectName,
              icon: Layers,
              color: 'text-violet-400 bg-violet-950/60 border-violet-500/40',
            };
            const Icon = meta.icon;

            return (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-black border border-white/15 hover:border-violet-500/50 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-medium flex items-center gap-1.5 ${meta.color}`}>
                      <Icon className="w-3 h-3" />
                      <span>{meta.name}</span>
                    </span>

                    <span className="text-zinc-500 text-[11px] font-mono">
                      {item.quarter} · <span className="uppercase text-amber-400">{item.priority}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Capability Checkbox List */}
                {item.targetCapabilities && item.targetCapabilities.length > 0 && (
                  <div className="p-3 rounded-lg bg-zinc-950 border border-white/5 space-y-1.5 font-mono text-[11px]">
                    <div className="text-zinc-500 text-[10px] uppercase tracking-wider">
                      Target Capabilities
                    </div>
                    {item.targetCapabilities.map((cap, i) => (
                      <div key={i} className="flex items-center gap-2 text-zinc-300">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                          item.status === 'completed' ? 'text-emerald-400' : 'text-zinc-600'
                        }`} />
                        <span className="truncate">{cap}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Progress Bar & Status Toggle */}
                <div className="space-y-2 pt-2 border-t border-white/10 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Execution Gauge</span>
                    <span className="text-white font-bold">{item.progressPercent}%</span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.status === 'completed' ? 'bg-emerald-500' : 'bg-violet-500'
                      }`}
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>

                  {/* Quick Action & Status Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-[11px]">
                      <button
                        onClick={() => updateRoadmapStatus(item.id, 'backlog')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          item.status === 'backlog' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Backlog
                      </button>
                      <button
                        onClick={() => updateRoadmapStatus(item.id, 'in_progress')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          item.status === 'in_progress' ? 'bg-violet-600 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateRoadmapStatus(item.id, 'completed')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          item.status === 'completed' ? 'bg-emerald-600 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Complete
                      </button>
                    </div>

                    {item.actionPath && (
                      <Link
                        href={item.actionPath}
                        className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1"
                      >
                        <span>{item.actionLabel || 'Test Feature'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
