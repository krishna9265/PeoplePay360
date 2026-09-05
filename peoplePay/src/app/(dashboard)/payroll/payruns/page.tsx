"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, CreditCard, Calendar, Clock, ChevronRight, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PayrunsListPage() {
  const [payruns, setPayruns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPayruns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/payruns");
      const data = await res.json();
      if (data.success) {
        setPayruns(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayruns();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Payroll Batches (Payruns)</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage payroll calculation runs through the Draft → Computed → Validated → Paid lifecycle.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadPayruns}
            className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/payroll/payruns/new"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Payrun Wizard
          </Link>
        </div>
      </div>

      {/* Payrun Cards / List */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-xs uppercase bg-zinc-800/40 text-zinc-400 font-mono">
              <tr>
                <th className="px-6 py-4 font-semibold rounded-tl-xl">Payrun Batch Name</th>
                <th className="px-6 py-4 font-semibold">Salary Structure</th>
                <th className="px-6 py-4 font-semibold">Payroll Period</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created By</th>
                <th className="px-6 py-4 font-semibold rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Loading payroll batches...
                    </div>
                  </td>
                </tr>
              ) : payruns.map((pr) => {
                const isDraft = pr.status === "Draft";
                const isComputed = pr.status === "Computed";
                const isValidated = pr.status === "Validated";
                const isPaid = pr.status === "Paid";

                return (
                  <tr key={pr.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-400" />
                        <span>{pr.name}</span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono block mt-0.5">
                        ID: {pr.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-purple-300">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-purple-400" />
                        {pr.salaryStructure?.name || "Regular Salary"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-zinc-300">
                      {new Date(pr.periodStart).toLocaleDateString()} - {new Date(pr.periodEnd).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                          isPaid
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.2)]"
                            : isValidated
                            ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                            : isComputed
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                        }`}
                      >
                        {isPaid && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        {isComputed && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                        {pr.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-400 font-mono">
                      {pr.createdBy?.workEmail?.split("@")[0] || "Manager"}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/payroll/payruns/${pr.id}`}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-blue-600/20 hover:text-blue-300 border border-zinc-700 text-xs font-semibold text-zinc-200 inline-flex items-center gap-1 transition"
                      >
                        Process Batch
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {payruns.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-500">
                    No payruns found. Launch the New Payrun Wizard to start a batch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
