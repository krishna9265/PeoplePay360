"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Sliders, Save, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SalaryRuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: session } = useSession();
  const userRole = (session?.user as any)?.roleName || "Employee";
  const isPayrollManager = ["HR Payroll Manager", "Admin"].includes(userRole);

  const [rule, setRule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [calcValue, setCalcValue] = useState("");
  const [sequence, setSequence] = useState(1);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/v1/salary-rules`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const found = data.data.find((r: any) => r.id === id);
          if (found) {
            setRule(found);
            setName(found.name);
            setCalcValue(found.calculationValue);
            setSequence(found.sequence);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPayrollManager) return;
    setSaving(true);
    setStatusMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/v1/salary-rules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          calculationValue: calcValue,
          sequence: Number(sequence),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update salary rule");
      }

      setStatusMsg("Salary rule updated successfully (BR-RULE-001).");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-zinc-500 py-12 text-center">Loading salary rule configuration...</div>;
  }

  if (!rule) {
    return <div className="text-rose-400 py-12 text-center">Salary rule not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <Link href="/payroll/salary-rules" className="hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Salary Rules
        </Link>
      </div>

      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{rule.name}</h1>
              <p className="text-xs text-zinc-400 font-mono">Code: {rule.code}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded text-xs font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {rule.calculationType}
          </span>
        </div>

        {!isPayrollManager && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Read-Only View: Modifying salary calculation rules requires HR Payroll Manager or Admin role.</span>
          </div>
        )}

        {statusMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {statusMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 font-semibold block mb-1.5">Rule Name</label>
              <input
                type="text"
                required
                disabled={!isPayrollManager}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-blue-500 disabled:opacity-60"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-semibold block mb-1.5">Short Code</label>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-400 font-mono">
                {rule.code} (Read-only identifier)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 font-semibold block mb-1.5">Execution Sequence</label>
              <input
                type="number"
                required
                min="1"
                disabled={!isPayrollManager}
                value={sequence}
                onChange={(e) => setSequence(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-blue-500 font-mono disabled:opacity-60"
              />
            </div>
            <div>
              <label className="text-zinc-400 font-semibold block mb-1.5">Category</label>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-300">
                {rule.category}
              </div>
            </div>
          </div>

          <div>
            <label className="text-zinc-400 font-semibold block mb-1.5">
              Calculation Value / Formula Expression (BR-RULE-001)
            </label>
            <input
              type="text"
              required
              disabled={!isPayrollManager}
              value={calcValue}
              onChange={(e) => setCalcValue(e.target.value)}
              placeholder="e.g. BASIC + TRANSPORT or 10 or = Contract.wage"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-emerald-400 font-mono text-sm outline-none focus:border-blue-500 disabled:opacity-60"
            />
            <p className="text-[11px] text-zinc-400 mt-1.5 font-mono">
              Supports: arithmetic operators (+, -, *, /), percentage values, and references to earlier sequenced codes (e.g. BASIC, TRANSPORT).
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/payroll/salary-rules")}
              className="border-zinc-700 text-zinc-300 rounded-xl text-xs"
            >
              {isPayrollManager ? "Cancel" : "Back to Rules"}
            </Button>
            {isPayrollManager && (
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? "Saving..." : "Save Rule Configuration"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
