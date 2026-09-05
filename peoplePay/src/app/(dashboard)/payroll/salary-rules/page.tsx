"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sliders, Search, ChevronRight, RefreshCw, Plus, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SalaryRulesListPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.roleName || "Employee";
  const isPayrollManager = ["HR Payroll Manager", "Admin"].includes(userRole);

  const [rules, setRules] = useState<any[]>([]);
  const [structures, setStructures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // New Rule Modal state
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("Allowance");
  const [calcType, setCalcType] = useState<"Fixed" | "Percentage" | "Python Code">("Fixed");
  const [calcValue, setCalcValue] = useState("");
  const [sequence, setSequence] = useState(1);
  const [selectedStructureId, setSelectedStructureId] = useState("");
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rulesRes, structuresRes] = await Promise.all([
        fetch("/api/v1/salary-rules"),
        fetch("/api/v1/salary-structures"),
      ]);
      const rulesData = await rulesRes.json();
      const structuresData = await structuresRes.json();

      if (rulesData.success) setRules(rulesData.data || []);
      if (structuresData.success && Array.isArray(structuresData.data)) {
        setStructures(structuresData.data);
        if (structuresData.data.length > 0 && !selectedStructureId) {
          setSelectedStructureId(structuresData.data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !calcValue.trim() || !selectedStructureId) return;
    setCreating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/salary-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salaryStructureId: selectedStructureId,
          name: name.trim(),
          code: code.trim().toUpperCase(),
          category,
          calculationType: calcType,
          calculationValue: calcValue.trim(),
          sequence: Number(sequence),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create salary rule");
      }

      setShowModal(false);
      setName("");
      setCode("");
      setCalcValue("");
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setCreating(false);
    }
  };

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
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
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
              New Rule
            </Button>
          )}
        </div>
      </div>

      {/* New Rule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                Create Salary Rule
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
                <label className="text-zinc-300 font-semibold block mb-1.5">Attach to Salary Structure *</label>
                <select
                  value={selectedStructureId}
                  onChange={(e) => setSelectedStructureId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl p-2.5 text-white outline-none"
                  required
                >
                  {structures.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1.5">Rule Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Travel Allowance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1.5">Code (Identifier) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TRAV"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl p-2.5 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1.5">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl p-2.5 text-white outline-none"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Allowance">Allowance</option>
                    <option value="Gross">Gross</option>
                    <option value="Deduction">Deduction</option>
                    <option value="Net">Net</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1.5">Calculation Type *</label>
                  <select
                    value={calcType}
                    onChange={(e: any) => setCalcType(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl p-2.5 text-white outline-none"
                  >
                    <option value="Fixed">Fixed Amount</option>
                    <option value="Percentage">Percentage</option>
                    <option value="Python Code">Formula Expression</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 font-semibold block mb-1.5">Sequence *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={sequence}
                    onChange={(e) => setSequence(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl p-2.5 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1.5">
                  Calculation Value / Expression *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5000 or 10 or BASIC * 0.10"
                  value={calcValue}
                  onChange={(e) => setCalcValue(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl p-2.5 text-emerald-400 font-mono text-sm outline-none"
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
                  {creating ? "Creating..." : "Create Salary Rule"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
