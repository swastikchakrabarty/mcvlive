"use client";

import { useState, useEffect } from "react";
import { ServerIcon, ShieldCheckIcon } from "@/components/ui/icons";

interface ClusterNode {
  city: string;
  code: string;
  jurisdiction: string;
  status: "nominal" | "active" | "encrypted";
  latency: string;
  vectors: string;
}

const NODES: ClusterNode[] = [
  {
    city: "London",
    code: "UK-LON-01",
    jurisdiction: "FCA / UK Sovereign",
    status: "nominal",
    latency: "3.2ms",
    vectors: "180M",
  },
  {
    city: "Frankfurt",
    code: "DE-FRA-01",
    jurisdiction: "BaFin / EU GDPR Vault",
    status: "nominal",
    latency: "4.1ms",
    vectors: "145M",
  },
  {
    city: "New York",
    code: "US-NYC-01",
    jurisdiction: "SEC / Reg NMS Gateway",
    status: "nominal",
    latency: "6.8ms",
    vectors: "220M",
  },
  {
    city: "Singapore",
    code: "SG-SIN-01",
    jurisdiction: "MAS / APAC Sovereign",
    status: "nominal",
    latency: "8.4ms",
    vectors: "110M",
  },
];

export function TelemetryRadar() {
  const [selectedNode, setSelectedNode] = useState<ClusterNode>(NODES[0]!);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse((p) => !p);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-6 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl space-y-5">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-3 w-3 items-center justify-center">
            <span
              className={`absolute h-3 w-3 rounded-full bg-emerald-400 opacity-75 ${
                pulse ? "animate-ping" : ""
              }`}
            />
            <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
            Global Vector Ingress Fabric
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-indigo-950/80 border border-indigo-800/60 px-2 py-0.5 text-[10px] font-mono text-indigo-300">
            Active-Active Consensus
          </span>
          <span className="rounded bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
            99.999% SLA
          </span>
        </div>
      </div>

      {/* Cluster Nodes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {NODES.map((node) => {
          const isSelected = selectedNode.code === node.code;
          return (
            <button
              key={node.code}
              type="button"
              onClick={() => setSelectedNode(node)}
              className={`rounded-xl border p-3 text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isSelected
                  ? "border-indigo-500/80 bg-indigo-950/30 shadow-md shadow-indigo-950/40"
                  : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-100">{node.city}</span>
                <span className="font-mono text-[10px] text-emerald-400 font-medium">
                  {node.latency}
                </span>
              </div>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5">{node.code}</p>
              <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-800/60">
                <span className="text-[10px] text-slate-500">Live Vectors</span>
                <span className="font-mono text-[10px] font-bold text-slate-300">
                  {node.vectors}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Node Detail Card */}
      <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <ServerIcon className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-200">
              Selected Ingress: {selectedNode.city} ({selectedNode.code})
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>{selectedNode.jurisdiction}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center font-mono">
          <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/60">
            <span className="block text-[10px] uppercase text-slate-500">P99 Query</span>
            <span className="text-xs font-bold text-emerald-400">{selectedNode.latency}</span>
          </div>
          <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/60">
            <span className="block text-[10px] uppercase text-slate-500">Vector Cache</span>
            <span className="text-xs font-bold text-indigo-300">HNSW L2</span>
          </div>
          <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/60">
            <span className="block text-[10px] uppercase text-slate-500">Throughput</span>
            <span className="text-xs font-bold text-slate-200">48,200 QPS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
