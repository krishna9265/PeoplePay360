"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, Plus, ChevronRight, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SalaryStructuresListPage() {
  const [structures, setStructures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Salary Structures</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Configure salary calculation models, execution pipelines, and rule sets.
          </p>
        </div>
        <button
          onClick={loadStructures}
          className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

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
