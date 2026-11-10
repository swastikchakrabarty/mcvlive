"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Input,
  Select,
  Modal,
  useToast,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSkeleton,
  EmptyState,
  ErrorState,
  ShieldCheckIcon,
  CpuIcon,
  DatabaseIcon,
  ActivityIcon,
  PlusIcon,
  CheckIcon,
} from "@/components/ui";

interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  dimension: number;
  algorithm: string;
  status: "active" | "reindexing" | "standby";
  latency: string;
  vectorCount: string;
}

const INITIAL_WORKSPACES: WorkspaceItem[] = [
  {
    id: "ws-01",
    name: "Apex Core Settlement",
    slug: "apex-core-settlement",
    dimension: 1536,
    algorithm: "HNSW (Dense Cosine)",
    status: "active",
    latency: "3.2ms",
    vectorCount: "12,450,000",
  },
  {
    id: "ws-02",
    name: "Reg-Vault EU Cross-Border",
    slug: "reg-vault-eu",
    dimension: 3072,
    algorithm: "IVF-PQ Quantized",
    status: "active",
    latency: "4.5ms",
    vectorCount: "8,920,000",
  },
  {
    id: "ws-03",
    name: "Autonomous Agent Context Buffer",
    slug: "agent-context-buf",
    dimension: 1536,
    algorithm: "FLAT (Exact L2)",
    status: "standby",
    latency: "1.8ms",
    vectorCount: "1,200,000",
  },
];

export default function ClientDashboardPage() {
  const { toast } = useToast();
  const [selectedOrg, setSelectedOrg] = useState("apex");
  const [activeTab, setActiveTab] = useState<"workspaces" | "team" | "billing" | "audit">(
    "workspaces",
  );
  const [screenState, setScreenState] = useState<"success" | "loading" | "empty" | "error">(
    "success",
  );
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>(INITIAL_WORKSPACES);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [newWsSlug, setNewWsSlug] = useState("");
  const [newWsDim, setNewWsDim] = useState("1536");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim() || newWsName.length < 2) {
      setFormError("Workspace name must be at least 2 characters.");
      return;
    }
    const slugRegex = /^[a-z0-9-]+$/;
    const cleanSlug = newWsSlug.trim() || newWsName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (!slugRegex.test(cleanSlug)) {
      setFormError("Slug may only contain lowercase letters, numbers, and hyphens.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    // Simulate backend round-trip
    await new Promise((r) => setTimeout(r, 600));

    const newWs: WorkspaceItem = {
      id: `ws-${Date.now()}`,
      name: newWsName.trim(),
      slug: cleanSlug,
      dimension: parseInt(newWsDim, 10),
      algorithm: "HNSW Dense",
      status: "active",
      latency: "3.4ms",
      vectorCount: "0",
    };

    setWorkspaces((prev) => [newWs, ...prev]);
    setIsSubmitting(false);
    setIsCreateModalOpen(false);
    setNewWsName("");
    setNewWsSlug("");

    toast({
      type: "success",
      title: "Workspace Partition Initialized",
      description: `Tenant partition "${newWs.name}" is active under organization scope.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 selection:bg-indigo-500 selection:text-white pb-24">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090D16]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-slate-100 hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-mono font-bold text-white text-sm shadow-md shadow-indigo-950">
                MCV
              </div>
              <span className="font-bold tracking-tight text-sm sm:text-base hidden sm:inline">
                Morland Chambers Vector
              </span>
            </Link>

            <span className="text-slate-700 hidden sm:inline">/</span>

            {/* Organization Switcher */}
            <div className="relative">
              <select
                aria-label="Active Tenant Organization Context"
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="appearance-none rounded-lg border border-slate-800 bg-slate-900 py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="apex">Apex Sovereign Systems Ltd (Enterprise)</option>
                <option value="helios">Helios Global Vector Inc (Professional)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center rounded-full bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 text-[11px] font-mono text-emerald-300">
              ● Active Enterprise SLA
            </span>

            <Link href="/design">
              <Button variant="outline" size="sm">
                Design System
              </Button>
            </Link>

            <Link href="/">
              <Button variant="secondary" size="sm">
                Corporate Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Organization Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {selectedOrg === "apex" ? "Apex Sovereign Systems Ltd" : "Helios Global Vector Inc"}
              </h1>
              <span className="rounded-md bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-0.5 text-xs font-mono font-medium text-indigo-300">
                {selectedOrg === "apex" ? "Enterprise Tier" : "Professional Tier"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active Tenant ID:{" "}
              <span className="font-mono text-slate-300">
                {selectedOrg === "apex"
                  ? "88e5dc3c-bd02-4ff1-aea9-f58cfe6f18e6"
                  : "d4b97603-dda9-43cd-8f14-e698e462a5ae"}
              </span>{" "}
              · Anti-BOLA Security Engine Active
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              iconLeft={<PlusIcon className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Provision Workspace
            </Button>
          </div>
        </div>

        {/* Real-Time Operational Telemetry Cards */}
        <section
          aria-label="Tenant Telemetry Overview"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400">Monthly Vectors</span>
              <DatabaseIcon className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-100">22.5M</span>
              <span className="text-xs text-slate-500 font-mono">/ 100M cap</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full w-[22.5%]" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400">P99 Query Latency</span>
              <ActivityIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-400">3.8 ms</span>
              <span className="text-xs text-slate-500">London Edge</span>
            </div>
            <p className="text-[11px] text-slate-400">Sub-5ms institutional guarantee</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400">Worker Jobs</span>
              <CpuIcon className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-100">142</span>
              <span className="text-xs text-emerald-400 font-mono">0 Failed</span>
            </div>
            <p className="text-[11px] text-slate-400">Idempotent queue with backoff</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400">IAM Role Access</span>
              <ShieldCheckIcon className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-100">Owner</span>
              <span className="text-xs text-slate-500">Root Scope</span>
            </div>
            <p className="text-[11px] text-slate-400">Full tenant administration</p>
          </div>
        </section>

        {/* Tab Navigation & State Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-3">
          <nav
            aria-label="Dashboard views"
            className="flex items-center gap-6 text-sm font-semibold"
          >
            {(
              [
                { id: "workspaces", label: "Vector Workspaces" },
                { id: "team", label: "Team & Permissions" },
                { id: "billing", label: "Subscription & Limits" },
                { id: "audit", label: "Cryptographic Audit Trail" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 border-b-2 font-medium text-xs sm:text-sm transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Screen State Simulator for Workspaces */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 p-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 px-2">State:</span>
            {(["success", "loading", "empty", "error"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScreenState(s)}
                className={`rounded px-2.5 py-1 text-[11px] font-medium capitalize transition-all cursor-pointer ${
                  screenState === s
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Vector Workspaces (Handling 4 Comprehensive Screen States) */}
        {activeTab === "workspaces" && (
          <div className="space-y-4">
            {screenState === "loading" && (
              <div className="space-y-4">
                <TableSkeleton rows={4} />
              </div>
            )}

            {screenState === "empty" && (
              <EmptyState
                icon={<DatabaseIcon className="w-8 h-8 text-indigo-400" />}
                title="Zero Tenant Partitions Configured"
                description="This organization does not currently possess any active vector workspaces. Initialize your first partition to begin querying."
                action={
                  <Button
                    variant="primary"
                    size="sm"
                    iconLeft={<PlusIcon className="w-4 h-4" />}
                    onClick={() => {
                      setScreenState("success");
                      setIsCreateModalOpen(true);
                    }}
                  >
                    Provision First Workspace
                  </Button>
                }
              />
            )}

            {screenState === "error" && (
              <ErrorState
                errorCode="INGRESS_LOOKUP_TIMEOUT"
                title="Failed to Load Tenant Workspaces"
                message="The cluster gateway did not respond within the 2000ms deadline. Zero data was leaked."
                onRetry={() => {
                  setScreenState("success");
                  toast({
                    type: "info",
                    title: "Ingress Re-established",
                    description: "Loaded active workspace telemetry from local cache.",
                  });
                }}
              />
            )}

            {screenState === "success" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workspace Name</TableHead>
                    <TableHead>Slug Identifier</TableHead>
                    <TableHead>Embedding Specs</TableHead>
                    <TableHead>Stored Vectors</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workspaces.map((ws) => (
                    <TableRow key={ws.id}>
                      <TableCell className="font-semibold text-slate-100 flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            ws.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                          }`}
                        />
                        {ws.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">{ws.slug}</TableCell>
                      <TableCell className="font-mono text-xs text-indigo-300">
                        {ws.dimension}-dim ({ws.algorithm})
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-300">
                        {ws.vectorCount}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium font-mono ${
                            ws.status === "active"
                              ? "bg-emerald-950/80 border border-emerald-800/60 text-emerald-300"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {ws.status} · {ws.latency}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toast({
                              type: "info",
                              title: `Workspace "${ws.name}"`,
                              description: `Selected partition ${ws.id} for telemetry stream.`,
                            })
                          }
                        >
                          Configure
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        {/* Tab 2: Team & IAM */}
        {activeTab === "team" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100">Organization Members</h3>
                <p className="text-xs text-slate-400">
                  Enforces RBAC matrix across Owner, Admin, Member, and Viewer roles.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                iconLeft={<PlusIcon className="w-4 h-4" />}
                onClick={() =>
                  toast({
                    type: "info",
                    title: "Invite Teammate",
                    description: "Dispatches a cryptographically signed 7-day invite email.",
                  })
                }
              >
                Invite Member
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions Scope</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold text-slate-100">
                    Dr. Julian Morland (You)
                  </TableCell>
                  <TableCell>
                    <span className="rounded bg-indigo-950 border border-indigo-800/60 px-2 py-0.5 text-xs font-mono text-indigo-300 font-bold">
                      Owner
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    Full billing, member removal, ownership transfer
                  </TableCell>
                  <TableCell className="text-emerald-400 text-xs">Active Session</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-slate-100">
                    Elena Rostova (CTO)
                  </TableCell>
                  <TableCell>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-300 font-medium">
                      Admin
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    Workspace creation, vector index tuning
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs">Active</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {/* Tab 3: Billing & Entitlements */}
        {activeTab === "billing" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100">Subscription & Feature Gates</h3>
                <p className="text-xs text-slate-400">
                  Stripe webhook verified subscription state and active tier entitlements.
                </p>
              </div>
              <span className="rounded-full bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 text-xs font-mono text-emerald-300 font-bold">
                Enterprise Tier · Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <span className="text-xs text-slate-400 uppercase font-mono">
                  Custom Blueprints
                </span>
                <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckIcon className="w-5 h-5" /> Enabled
                </p>
                <p className="text-[11px] text-slate-500">FastAPI vector synthesis</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <span className="text-xs text-slate-400 uppercase font-mono">
                  Inference Throughput
                </span>
                <p className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckIcon className="w-5 h-5" /> High Throughput
                </p>
                <p className="text-[11px] text-slate-500">Unrestricted QPS scaling</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <span className="text-xs text-slate-400 uppercase font-mono">SLA Guarantee</span>
                <p className="text-lg font-bold text-indigo-400 flex items-center gap-1.5">
                  <CheckIcon className="w-5 h-5" /> 1-Hour Emergency
                </p>
                <p className="text-[11px] text-slate-500">Dedicated systems engineer</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Log */}
        {activeTab === "audit" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Cryptographic Audit Trail</h3>
            <p className="text-xs text-slate-400">
              Immutable operational log with SHA-256 state hashes and tenant isolation proofs.
            </p>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Operation</TableHead>
                  <TableHead>Resource ID</TableHead>
                  <TableHead className="text-right">Verification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-xs text-slate-400">Just now</TableCell>
                  <TableCell className="font-medium text-slate-200">
                    julian@apexsovereign.com
                  </TableCell>
                  <TableCell className="font-mono text-xs text-indigo-300">
                    workspace.create
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-400">
                    ws-apex-core-settlement
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-emerald-400">
                    HMAC Verified
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs text-slate-400">42m ago</TableCell>
                  <TableCell className="font-medium text-slate-200">
                    stripe_webhook_worker
                  </TableCell>
                  <TableCell className="font-mono text-xs text-indigo-300">
                    subscription.updated
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-400">
                    sub_mcv_live_enterprise
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-emerald-400">
                    Idempotent (0 dup)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Workspace Creation Modal with Full Client Validation */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Provision Sovereign Vector Workspace"
        description="Allocate an isolated multi-tenant partition with custom vector dimensionality."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateWorkspace}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Allocating..." : "Provision Partition"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          <Input
            label="Workspace Name"
            placeholder="e.g. Apex High-Frequency Vector Index"
            required
            value={newWsName}
            error={formError}
            onChange={(e) => setNewWsName(e.target.value)}
          />

          <Input
            label="Namespace Routing Slug"
            placeholder="apex-hft-vector"
            hint="Lowercase alphanumeric with hyphens only."
            value={newWsSlug}
            onChange={(e) => setNewWsSlug(e.target.value)}
          />

          <Select
            label="Embedding Dimension & Algorithm"
            value={newWsDim}
            onChange={(e) => setNewWsDim(e.target.value)}
            options={[
              { value: "1536", label: "1,536 Dimensions - Dense HNSW (Sub-5ms)" },
              { value: "3072", label: "3,072 Dimensions - High Precision IVF-PQ" },
              { value: "768", label: "768 Dimensions - Ultra Lightweight" },
            ]}
          />
        </form>
      </Modal>
    </div>
  );
}
