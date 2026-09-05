"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, Calendar, DollarSign, Clock, Layers, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [wage, setWage] = useState("");
  const [status, setStatus] = useState("Draft");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id || id === "new") {
      setLoading(false);
      return;
    }
    fetch(`/api/v1/contracts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setContract(data);
        if (data) {
          setWage(data.wage?.toString() || "");
          setStatus(data.status || "Draft");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/v1/contracts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wage: Number(wage),
          status,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setContract(data);
        setMessage("Contract updated successfully.");
      } else {
        setMessage(data.error || "Update failed.");
      }
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-zinc-500 py-12 text-center">Loading contract details...</div>;
  }

  if (!contract || !contract.employee) {
    return <div className="text-rose-400 py-12 text-center">Contract record not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <Link href="/contracts" className="hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Contracts
        </Link>
      </div>

      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Contract: {contract.employee.fullName}
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                  ID: {contract.id}
                </p>
              </div>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              contract.status === "Active"
                ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                : "bg-zinc-800 text-zinc-400 border border-zinc-700"
            }`}
          >
            {contract.status}
          </span>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Employee</label>
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200">
                {contract.employee.fullName} ({contract.employee.workEmail})
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Department</label>
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200">
                {contract.department?.name || contract.employee.department?.name || "General"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Start Date</label>
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-200">
                {new Date(contract.startDate).toLocaleDateString()}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">End Date</label>
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-200">
                {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "Open-ended (No expiry)"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Monthly Base Wage (₹)</label>
              <input
                type="number"
                value={wage}
                onChange={(e) => setWage(e.target.value)}
                required
                className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-emerald-400 font-bold focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:border-blue-500 outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Working Schedule</label>
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300">
                {contract.workingSchedule?.name || "Standard 40hr"} ({contract.workingSchedule?.weeklyHours} hrs/wk)
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Salary Structure</label>
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300">
                {contract.salaryStructure?.name || "Regular Salary"}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/contracts")}
              className="border-zinc-700 text-zinc-300 rounded-xl text-xs"
            >
              Back to List
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
