"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sliders, Search, ChevronRight, RefreshCw } from "lucide-react";

export default function SalaryRulesListPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadRules = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/salary-rules");
      const data = await res.json();
      if (data.success) {
        setRules(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const filtered = rules.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.code?.toLowerCase().includes(q) ||
      r.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Salary Calculation Rules</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Browse all individual computational rules, percentage multipliers, and formula expressions (BR-RULE-001).
          </p>
        </div>
        <button
          onClick={loadRules}
          className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 backdrop-blur-md max-w-md">
        <div className="relative">
          <Sliders className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rules by name, code, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-xs uppercase bg-zinc-800/40 text-zinc-400 font-mono">
              <tr>
                <th className="px-6 py-4 font-semibold rounded-tl-xl">Sequence</th>
                <th className="px-6 py-4 font-semibold">Rule Name</th>
                <th className="px-6 py-4 font-semibold">Code</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Calculation Type</th>
                <th className="px-6 py-4 font-semibold">Value / Expression</th>
                <th className="px-6 py-4 font-semibold rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    Loading salary rules...
                  </td>
                </tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-purple-400">
                    #{r.sequence}
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">{r.name}</td>
                  <td className="px-6 py-4 font-mono text-zinc-400">{r.code}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded text-xs font-semibold bg-zinc-800 text-zinc-200">
                      {r.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded text-xs font-bold uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20">
                      {r.calculationType}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-emerald-400 text-xs">
                    {r.calculationValue}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/payroll/salary-rules/${r.id}`}
                      className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-blue-400 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition"
                    >
                      Configure
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
