'use client';

import React, { useState } from 'react';
import { useSkelvre } from '@/lib/store';
import { AgentSession, InterfaceType } from '@/lib/types';
import {
  Bot,
  Terminal,
  Send,
  Plus,
  Zap,
  Sliders,
  CheckCircle2,
  Copy,
  Layers,
  ArrowRight,
  Shield,
  Activity,
  Sparkles,
} from 'lucide-react';

export function AgentsView() {
  const {
    agentSessions,
    activeChatSession,
    sendMessageToAgent,
    openRightSidebar,
    activeWallet,
  } = useSkelvre();

  const [promptInput, setPromptInput] = useState('');
  const [selectedInterface, setSelectedInterface] = useState<InterfaceType | 'all'>('all');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isSending) return;
    const msg = promptInput;
    setPromptInput('');
    setIsSending(true);
    try {
      await sendMessageToAgent(msg);
    } finally {
      setIsSending(false);
    }
  };

  const filteredSessions = agentSessions.filter((s) => {
    if (selectedInterface === 'all') return true;
    return s.interfaceType === selectedInterface;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-black border border-white/15">
        <div>
          <div className="text-xs font-mono text-zinc-400">
            <span>Model Context Protocol (MCP)</span>
            <span aria-hidden="true"> · </span>
            <span>Autonomous Payment Runtime</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Agentic Execution & MCP Gateway
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Authorize LLM agents (Claude Desktop, Cursor, LangChain, CLI daemons) to autonomously pay for compute, APIs, and subscriptions within cryptographically bounded spending caps.
          </p>
        </div>

        <button
          onClick={() => openRightSidebar('create_agent_session', null, 'Provision MCP Agent Session')}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors shadow-md shadow-violet-600/30 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Agent Session</span>
        </button>
      </div>

      {/* Two Column Layout: Sessions on Left, Live Canvas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Sessions & Interfaces (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-black border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Active Sessions</h2>
              <span className="text-xs font-mono text-zinc-400">
                {agentSessions.length} keys
              </span>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-1 p-1 bg-zinc-950 rounded-lg border border-white/10 text-[11px] font-mono">
              {(['all', 'mcp', 'webmcp', 'cli', 'telegram'] as const).map((iface) => (
                <button
                  key={iface}
                  onClick={() => setSelectedInterface(iface)}
                  className={`px-2 py-1 rounded uppercase transition-colors ${
                    selectedInterface === iface
                      ? 'bg-violet-600 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {iface}
                </button>
              ))}
            </div>

            {/* Sessions List */}
            <div className="space-y-2.5 pt-1">
              {filteredSessions.length === 0 ? (
                <div className="p-4 rounded-lg bg-zinc-950 border border-white/5 text-center space-y-2">
                  <p className="text-zinc-500 text-[11px]">No active agent sessions</p>
                  <button
                    onClick={() => openRightSidebar('create_agent_session', null, 'Provision MCP Agent Session')}
                    className="w-full py-1.5 px-2 text-[11px] font-mono text-violet-300 bg-violet-950/60 border border-violet-500/30 rounded hover:bg-violet-900/50 transition-colors"
                  >
                    + Generate Session
                  </button>
                </div>
              ) : (
                filteredSessions.map((session) => {
                const percentSpent = Math.min(
                  100,
                  (session.currentSpentUsd / session.spendingLimitUsd) * 100
                );
                return (
                  <div
                    key={session.id}
                    onClick={() =>
                      openRightSidebar(
                        'agent_context_inspector',
                        session,
                        'Agent Rolling Context'
                      )
                    }
                    className="p-3 rounded-lg bg-zinc-950 border border-white/10 hover:border-violet-500/50 cursor-pointer transition-all space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white truncate max-w-[170px]">
                        {session.name}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-violet-400 bg-violet-950/60 px-1.5 py-0.5 rounded border border-violet-500/40">
                        {session.interfaceType}
                      </span>
                    </div>

                    {/* Spending Limit Gauge */}
                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between text-zinc-400">
                        <span>Spent</span>
                        <span className="text-white tabular-nums">
                          ${session.currentSpentUsd.toFixed(2)} / ${session.spendingLimitUsd.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full transition-all"
                          style={{ width: `${percentSpent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1">
                      <span className="truncate max-w-[140px]">
                        Hash: {session.tokenHash.slice(0, 10)}...
                      </span>
                      <span className="text-violet-400 hover:text-violet-300">
                        Inspect →
                      </span>
                    </div>
                  </div>
                );
              }))}
            </div>
          </div>
        </div>

        {/* Right Column: Unified Chat Canvas & Tool Stream (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-black border border-white/15 flex flex-col h-[650px]">
          {/* Canvas Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-violet-400" />
              <span className="font-semibold text-white">
                {activeChatSession?.title || 'Interactive MCP Session'}
              </span>
              <span className="text-zinc-500 font-mono hidden sm:inline">
                ({activeChatSession?.interfaceOrigin.toUpperCase()})
              </span>
            </div>

            <button
              onClick={() =>
                openRightSidebar(
                  'agent_context_inspector',
                  agentSessions[0],
                  'Rolling Context Window'
                )
              }
              className="px-2.5 py-1 text-[11px] font-mono text-zinc-300 bg-zinc-950 border border-white/10 rounded hover:border-violet-500/50 transition-colors"
            >
              Rolling Context (Edge Cached)
            </button>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {(!activeChatSession?.messages || activeChatSession.messages.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 font-mono text-xs text-zinc-500">
                <Bot className="w-8 h-8 text-zinc-600" />
                <div className="space-y-1">
                  <div className="text-zinc-300 font-semibold font-sans">Skelvre MCP Agent Gateway Ready</div>
                  <p className="text-[11px] max-w-sm text-zinc-500">
                    Interact with your autonomous payment agent. You can request tool invocations, execute x402 micro-settlements, or inspect allowance status.
                  </p>
                </div>
              </div>
            ) : (
              activeChatSession.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col space-y-1.5 ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                <div className="text-[10px] font-mono text-zinc-500 px-1">
                  {msg.role === 'user' ? 'You (Client Enclave)' : 'Skelvre MCP Gateway'} ·{' '}
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>

                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-violet-950/60 border border-violet-500/40 text-white'
                      : 'bg-zinc-950 border border-white/10 text-zinc-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Tool Calls Inspector */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-white/10 pt-2 font-mono text-[11px]">
                      <div className="text-violet-400 flex items-center gap-1.5 font-semibold">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Tool Invocation: {msg.toolCalls[0].toolName}</span>
                      </div>

                      <div className="p-2 rounded bg-black border border-white/5 space-y-1 text-zinc-400">
                        <div className="text-zinc-500">{'// Parameters & Authorization'}</div>
                        <div>Target: {(msg.toolCalls[0].input as any).targetUrl}</div>
                        <div>Amount: {(msg.toolCalls[0].input as any).amount} USDC</div>
                        <div>Network: {(msg.toolCalls[0].input as any).chainCaip}</div>
                        {msg.toolCalls[0].txHash && (
                          <div className="text-emerald-400 truncate">
                            Tx: {msg.toolCalls[0].txHash}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )))}
            {isSending && (
              <div className="flex items-center gap-2 text-xs font-mono text-violet-400 p-2">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <span>Interpreting prompt & verifying spending allowances...</span>
              </div>
            )}
          </div>

          {/* Prompt Suggestions */}
          <div className="pt-2 pb-1 flex flex-wrap gap-1.5 text-[11px] font-mono">
            <button
              onClick={() => setPromptInput('Trigger x402 payment of 0.45 USDC for compiler worker')}
              className="px-2 py-1 rounded bg-zinc-950 border border-white/10 text-zinc-400 hover:text-white hover:border-violet-500/40 transition-colors"
            >
              + x402 Compiler Tool ($0.45)
            </button>
            <button
              onClick={() => setPromptInput('Check active session limits and remaining wallet balance')}
              className="px-2 py-1 rounded bg-zinc-950 border border-white/10 text-zinc-400 hover:text-white hover:border-violet-500/40 transition-colors"
            >
              + Audit Balances & Scopes
            </button>
            <button
              onClick={() => setPromptInput('Pull next recurring subscription for DeepSeek Inference')}
              className="px-2 py-1 rounded bg-zinc-950 border border-white/10 text-zinc-400 hover:text-white hover:border-violet-500/40 transition-colors"
            >
              + DeepSeek Pull
            </button>
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSubmit} className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Instruct agent (e.g. Execute x402 payment to DeepSeek, compile code, audit ledger)..."
              className="flex-1 px-4 py-2.5 text-xs bg-zinc-950 border border-white/15 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 font-mono"
            />
            <button
              type="submit"
              disabled={isSending || !promptInput.trim()}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-500 transition-colors shadow-md shadow-violet-600/30 flex items-center gap-1.5 disabled:opacity-40"
            >
              <span>Execute</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
