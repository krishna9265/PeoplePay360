"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Layers, Plus, ChevronRight, CheckCircle, RefreshCw, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SalaryStructuresListPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.roleName || "Employee";
  const isPayrollManager = ["HR Payroll Manager", "Admin"].includes(userRole);

  const [structures, setStructures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Structure Modal
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadStructures = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/salary-structures");
      const data = await res.json();
      if (data.success) {
        setStructures(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStructures();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/salary-structures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), active: true }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create structure");
      }
      setShowModal(false);
      setNewName("");
      await loadStructures();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Salary Structures</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Configure salary calculation models, execution pipelines, and rule sets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadStructures}
            className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          {isPayrollManager && (
            <Button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Structure
            </Button>
          )}
        </div>
      </div>

      {/* New Structure Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Create Salary Structure
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1.5">Structure Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Compensation, Sales Incentive Structure"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl p-3 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="border-zinc-700 text-zinc-300 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  {creating ? "Creating..." : "Create Structure"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {structures.map((s) => (
          <div
            key={s.id}
            className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-7 backdrop-blur-xl shadow-xl hover:border-zinc-700 transition-all group relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {s.name}
                  </h2>
                  <span className="text-xs text-zinc-400 font-mono">
                    ID: {s.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-6">
              Standard compensation structure sequencing base wage, allowances, gross calculation, standard deduction, and net pay.
            </p>

            {/* Rules Overview */}
            <div className="space-y-2 mb-6">
              <span className="text-[11px] font-semibold uppercase text-zinc-400 tracking-wider block">
                Included Salary Rules ({s.rules?.length || 0})
              </span>
              <div className="space-y-1.5">
                {s.rules?.map((rule: any) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-zinc-400 text-[11px]">#{rule.sequence}</span>
                      <span className="font-semibold text-white">{rule.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {rule.code}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-purple-400">
                      {rule.calculationType}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={`/payroll/salary-structures/${s.id}`}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-white text-xs font-semibold border border-zinc-700 transition"
            >
              Manage Structure & Sequence
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
