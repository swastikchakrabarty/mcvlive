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
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  EmptyState,
  ErrorState,
  CpuIcon,
  DatabaseIcon,
  PlusIcon,
} from "@/components/ui";

export default function DesignSystemShowcasePage() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputVal, setInputVal] = useState("api_key_live_mcv_vector_9983");
  const [activeScreenState, setActiveScreenState] = useState<
    "loading" | "empty" | "error" | "success"
  >("success");
  const [retryCounter, setRetryCounter] = useState(0);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 pb-24">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090D16]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-slate-100 hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-mono font-bold text-white text-sm shadow-md shadow-indigo-950">
                MCV
              </div>
              <span className="font-semibold tracking-tight text-sm sm:text-base">
                Morland Chambers Vector
              </span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs uppercase font-mono tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-2 py-0.5 rounded">
              Design System Showcase
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm">
                Corporate Portfolio
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" size="sm">
                Client Console
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16">
        {/* Title Section */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
            Design Tokens & UI Component Specifications
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            Institutional-grade design primitives engineered for high-performance sovereign software
            sales and mission-critical vector infrastructure interfaces. Conforms strictly to the
            60-30-10 color balance rule and WCAG 2.1 AA accessibility standards.
          </p>
        </div>

        {/* 1. Color Palette: 60-30-10 Principle */}
        <section aria-labelledby="colors-heading" className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 id="colors-heading" className="text-xl font-bold tracking-tight text-slate-100">
              1. Architectural Color Balance (60-30-10 Rule)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Strict visual hierarchy preserving focus, visual tranquility, and zero eye fatigue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 60% Dominant Background */}
            <div className="rounded-2xl border border-slate-800 bg-[#090D16] p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">
                  60% Dominant
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-300">
                  #090D16
                </span>
              </div>
              <div className="h-16 w-full rounded-xl bg-[#090D16] border border-slate-700/60 shadow-inner flex items-center justify-center text-xs font-mono text-slate-400">
                Deep Slate Charcoal Base
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Covers main canvas, page viewport, and full document background to establish a deep,
                distraction-free sovereign workspace tone.
              </p>
            </div>

            {/* 30% Structural Surface */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-300">
                  30% Structural
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-300">
                  #111A2E / Slate-900
                </span>
              </div>
              <div className="h-16 w-full rounded-xl bg-slate-900 border border-slate-700 shadow-inner flex items-center justify-center text-xs font-mono text-slate-300">
                Elevated Card & Border Surface
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Constitutes panels, cards, dialogs, table headers, and structural borders to
                separate content blocks with clarity.
              </p>
            </div>

            {/* 10% High-Contrast Accent */}
            <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-indigo-400">
                  10% High-Contrast Accent
                </span>
                <span className="rounded bg-indigo-950/80 border border-indigo-800/60 px-2 py-0.5 text-[11px] font-mono text-indigo-300">
                  #6366F1 / Indigo-600
                </span>
              </div>
              <div className="h-16 w-full rounded-xl bg-indigo-600 border border-indigo-400/40 shadow-lg shadow-indigo-950 flex items-center justify-center text-xs font-mono font-semibold text-white">
                Electric Indigo Focal Points
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reserved exclusively for primary action triggers, active tabs, crucial telemetry
                indicators, and conversion focal points.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Base Components: Buttons */}
        <section aria-labelledby="buttons-heading" className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 id="buttons-heading" className="text-xl font-bold tracking-tight text-slate-100">
              2. Interactive Buttons & Operational States
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Supports 6 semantic variants, 3 sizes, loading spinners, icons, and keyboard focus
              rings.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                Variants & Accents
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary (10% Accent)</Button>
                <Button variant="secondary">Secondary Surface</Button>
                <Button variant="outline">Outline Border</Button>
                <Button variant="ghost">Ghost Action</Button>
                <Button variant="emerald">Cyber Emerald</Button>
                <Button variant="danger">Destructive Danger</Button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                Operational States & Sizes
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" variant="primary">
                  Small (sm)
                </Button>
                <Button size="md" variant="primary">
                  Medium (md)
                </Button>
                <Button size="lg" variant="primary">
                  Large (lg)
                </Button>
                <Button variant="primary" isLoading>
                  Loading State
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button
                  variant="secondary"
                  iconLeft={<CpuIcon className="w-4 h-4 text-indigo-400" />}
                >
                  With Icon
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Inputs & Selects */}
        <section aria-labelledby="inputs-heading" className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 id="inputs-heading" className="text-xl font-bold tracking-tight text-slate-100">
              3. Form Inputs & Select Controls
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Full WCAG 2.1 AA compliant labels, aria-describedby inline validation, and keyboard
              navigation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <Input
              label="Standard API Ingress Point"
              placeholder="e.g. https://api.mcv.vector.corp"
              hint="Must point to an active sovereign cluster."
            />

            <Input
              label="Active Live Secret (Filled)"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              hint="Cryptographically generated token."
            />

            <Input
              label="Validation Error State"
              defaultValue="invalid-vector-dimension"
              error="Vector dimension must be 1536 or 3072 for text-embedding-3."
            />

            <Input
              label="Disabled Control"
              defaultValue="LOCKED_SOVEREIGN_PARTITION"
              disabled
              hint="Restricted by organization root administrator."
            />

            <Select
              label="Vector Index Engine Tier"
              options={[
                { value: "hnsw", label: "Hierarchical Navigable Small World (HNSW)" },
                { value: "ivf", label: "Inverted File with Product Quantization (IVF-PQ)" },
                { value: "flat", label: "Exact L2 / Inner Product (FLAT)" },
              ]}
              hint="Selected algorithm determines recall versus throughput."
            />

            <Select
              label="Deployment Region (Error State)"
              error="Selected jurisdiction (Frankfurt-01) requires Enterprise Tier SLA."
              options={[
                { value: "fra", label: "Frankfurt (DE-01) - Restricted" },
                { value: "lon", label: "London (UK-01)" },
                { value: "nyc", label: "New York (US-01)" },
              ]}
            />
          </div>
        </section>

        {/* 4. The 4 Mandatory Screen States */}
        <section aria-labelledby="screen-states-heading" className="space-y-6">
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2
                id="screen-states-heading"
                className="text-xl font-bold tracking-tight text-slate-100"
              >
                4. The 4 Comprehensive Screen States
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Every data-driven component seamlessly handles Loading, Empty, Error, and Success.
              </p>
            </div>

            {/* State Toggle Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-1">
              {(["loading", "empty", "error", "success"] as const).map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => setActiveScreenState(state)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 capitalize cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    activeScreenState === state
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  }`}
                >
                  {state} State
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 min-h-[380px] flex items-center justify-center">
            {/* STATE 1: LOADING */}
            {activeScreenState === "loading" && (
              <div className="w-full space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-9 w-32 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
                <TableSkeleton rows={4} />
              </div>
            )}

            {/* STATE 2: EMPTY */}
            {activeScreenState === "empty" && (
              <EmptyState
                icon={<DatabaseIcon className="w-7 h-7 text-indigo-400" />}
                title="No Vector Indices Provisioned"
                description="Your organization has not initialized any vector partitions. Deploy a high-throughput index blueprint to begin embedding operations."
                action={
                  <Button
                    variant="primary"
                    size="sm"
                    iconLeft={<PlusIcon className="w-4 h-4" />}
                    onClick={() => setActiveScreenState("success")}
                  >
                    Provision Vector Index
                  </Button>
                }
                secondaryAction={
                  <Button variant="outline" size="sm">
                    Read Documentation
                  </Button>
                }
              />
            )}

            {/* STATE 3: ERROR */}
            {activeScreenState === "error" && (
              <ErrorState
                errorCode="CLUSTER_TIMEOUT_504"
                title="Telemetry Aggregation Unavailable"
                message={`Connection to the Frankfurt-01 vector node timed out after 3000ms. (Retry count: ${retryCounter})`}
                onRetry={() => {
                  setRetryCounter((c) => c + 1);
                  toast({
                    type: "info",
                    title: "Retrying Cluster Connection",
                    description: "Re-establishing cryptographic TLS tunnel to Frankfurt-01...",
                  });
                }}
                homeAction={
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveScreenState("success")}
                  >
                    Simulate Recovery
                  </Button>
                }
              />
            )}

            {/* STATE 4: SUCCESS */}
            {activeScreenState === "success" && (
              <div className="w-full space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-semibold text-slate-100">
                      Active Vector Workspaces
                    </h3>
                    <p className="text-xs text-slate-400">
                      Partitioned multi-tenant instances under Apex Sovereign Systems Ltd.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    iconLeft={<PlusIcon className="w-4 h-4" />}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Create Workspace
                  </Button>
                </div>

                {/* Data Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workspace Name</TableHead>
                      <TableHead>Namespace Slug</TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold text-slate-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Apex Financial Core
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">
                        apex-fin-vector
                      </TableCell>
                      <TableCell className="font-mono text-xs text-indigo-300">
                        1536-dim (HNSW)
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 text-xs font-medium text-emerald-300">
                          Active · 4.2ms P99
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-semibold text-slate-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        Regulatory Vault Index
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">
                        reg-vault-eu
                      </TableCell>
                      <TableCell className="font-mono text-xs text-indigo-300">
                        3072-dim (IVF)
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-indigo-950/80 border border-indigo-800/60 px-2 py-0.5 text-xs font-medium text-indigo-300">
                          Reindexing (98%)
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Inspect
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </section>

        {/* 5. Modals & Toast Triggers */}
        <section aria-labelledby="dialogs-heading" className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 id="dialogs-heading" className="text-xl font-bold tracking-tight text-slate-100">
              5. Interactive Modals & Toast Notifications
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Accessible dialog with Escape key listeners, body scroll locks, and floating feedback
              toasts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-200">Accessible Dialog (Modal)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clicking opens an enterprise dialog with backdrop blur, full keyboard navigation,
                Escape key dismiss, and focus retention.
              </p>
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Open Demonstration Modal
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-200">Toast Notifications</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trigger high-contrast auto-dismissing notifications conforming to the 60-30-10
                palette.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="emerald"
                  size="sm"
                  onClick={() =>
                    toast({
                      type: "success",
                      title: "License Key Activated",
                      description: "Enterprise tier entitlements successfully verified via Stripe.",
                    })
                  }
                >
                  Trigger Success Toast
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    toast({
                      type: "error",
                      title: "Ingress Token Revoked",
                      description:
                        "API token session was immediately terminated across all 4 regions.",
                    })
                  }
                >
                  Trigger Error Toast
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({
                      type: "warning",
                      title: "Vector Capacity At 88%",
                      description: "Consider upgrading to high-throughput tier before burst load.",
                    })
                  }
                >
                  Warning Toast
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    toast({
                      type: "info",
                      title: "Background Job Queued",
                      description: "Invoice PDF synthesis dispatched to worker pool (idempotent).",
                    })
                  }
                >
                  Info Toast
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Accessible Interactive Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision Sovereign Vector Workspace"
        description="Configure a cryptographically isolated tenant partition for your enterprise organization."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                toast({
                  type: "success",
                  title: "Workspace Initialized",
                  description: "Apex Sovereign Core partition was created with zero downtime.",
                });
              }}
            >
              Provision Workspace
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Workspace Name"
            placeholder="e.g. Apex Cross-Border Settlement"
            required
            hint="Human-readable identifier for corporate audits."
          />
          <Input
            label="Namespace Slug"
            placeholder="apex-settlement-eu"
            required
            hint="URL-safe unique routing key within your organization."
          />
          <Select
            label="Vector Embedding Dimension"
            options={[
              { value: "1536", label: "1,536 Dimensions (Standard Dense)" },
              { value: "3072", label: "3,072 Dimensions (High Precision Large)" },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
