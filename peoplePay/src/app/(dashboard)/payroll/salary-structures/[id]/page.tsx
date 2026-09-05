"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Layers, Sliders, CheckCircle2, ChevronRight, Plus } from "lucide-react";

export default function SalaryStructureDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [structure, setStructure] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/v1/salary-structures/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStructure(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-zinc-500 py-12 text-center">Loading structure rules...</div>;
  }

  if (!structure) {
    return <div className="text-rose-400 py-12 text-center">Structure not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <Link
          href="/payroll/salary-structures"
          className="hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Structures
        </Link>
      </div>

      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{structure.name}</h1>
                <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                  {structure.rules?.length || 0} Ordered Calculation Rules
                </p>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active
          </span>
        </div>

        {/* Ordered Rules Table */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Rule Execution Sequence (07_PAYROLL_ENGINE.md)
            </h2>
            <span className="text-[11px] text-zinc-400 font-mono">Sequential Evaluation Order</span>
          </div>

          <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/60">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-800/50 uppercase text-zinc-400 font-mono">
                <tr>
                  <th className="px-5 py-3.5">Sequence</th>
                  <th className="px-5 py-3.5">Rule Name</th>
                  <th className="px-5 py-3.5">Code</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Calculation Type</th>
                  <th className="px-5 py-3.5">Expression / Value</th>
                  <th className="px-5 py-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {structure.rules?.map((rule: any) => (
                  <tr key={rule.id} className="hover:bg-zinc-800/20">
                    <td className="px-5 py-3.5 font-mono font-bold text-purple-400">
                      #{rule.sequence}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white">{rule.name}</td>
                    <td className="px-5 py-3.5 font-mono text-zinc-400">{rule.code}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300">
                        {rule.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-blue-400 bg-blue-500/10 border border-blue-500/20">
                        {rule.calculationType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-emerald-400 text-[11px]">
                      {rule.calculationValue}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/payroll/salary-rules/${rule.id}`}
                        className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        Edit Rule
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
