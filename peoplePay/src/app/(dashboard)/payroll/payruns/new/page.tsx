"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Users, Layers, Calendar, CreditCard, AlertCircle, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewPayrunWizardPage() {
  const router = useRouter();

  // Wizard Step: 1 = Define Scope, 2 = Select Employees
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 State
  const [name, setName] = useState("October 2026 Payroll");
  const [salaryStructureId, setSalaryStructureId] = useState("");
  const [periodStart, setPeriodStart] = useState("2026-10-01");
  const [periodEnd, setPeriodEnd] = useState("2026-10-31");

  // Structures and Employees list
  const [structures, setStructures] = useState<any[]>([]);
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>([]);
  const [empSearch, setEmpSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch active structures
    fetch("/api/v1/salary-structures")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setStructures(data.data);
          if (data.data.length > 0) {
            setSalaryStructureId(data.data[0].id);
          }
        }
      })
      .catch(() => {});

    // Fetch employees
    fetch("/api/v1/employees")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllEmployees(data);
          // Default select all active
          setSelectedEmpIds(data.map((e: any) => e.id));
        }
      })
      .catch(() => {});
  }, []);

  // Step 1 -> Step 2 validation (BR-PAY-001: in-memory only, no DB mutation)
  const handleContinueToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Payrun batch name is required.");
      return;
    }
    if (!salaryStructureId) {
      setError("Please select a Salary Structure.");
      return;
    }
    if (!periodStart || !periodEnd) {
      setError("Please specify both period start and end dates.");
      return;
    }
    if (new Date(periodStart) >= new Date(periodEnd)) {
      setError("Period end date must be after period start date.");
      return;
    }

    setStep(2);
  };

  const toggleEmployee = (empId: string) => {
    setSelectedEmpIds((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEmpIds.length === allEmployees.length) {
      setSelectedEmpIds([]);
    } else {
      setSelectedEmpIds(allEmployees.map((e) => e.id));
    }
  };

  // Step 2 -> Persist Payrun (BR-PAY-001 & VAL-PAY-001)
  const handleCreatePayrun = async () => {
    setError(null);
    if (selectedEmpIds.length === 0) {
      setError("Select at least one employee (VAL-PAY-001).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/payruns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          salaryStructureId,
          periodStart,
          periodEnd,
          employeeIds: selectedEmpIds,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create payrun");
      }

      router.push(`/payroll/payruns/${data.data.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const filteredEmployees = allEmployees.filter((e) =>
    e.fullName?.toLowerCase().includes(empSearch.toLowerCase()) ||
    e.department?.name?.toLowerCase().includes(empSearch.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <Link href="/payroll/payruns" className="hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Payruns
        </Link>
      </div>

      {/* Wizard Progress Stepper */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between relative mb-8">
          <div className="w-full absolute top-1/2 -translate-y-1/2 h-0.5 bg-zinc-800" />
          
          <div className="relative z-10 flex items-center gap-3 bg-zinc-900 pr-4">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                step === 1
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-500/20"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {step > 1 ? <Check className="w-5 h-5" /> : "1"}
            </div>
            <div>
              <p className="text-xs font-bold text-white">Step 1: Batch Scope</p>
              <p className="text-[11px] text-zinc-400">Structure & Period (Unsaved)</p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 bg-zinc-900 pl-4">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                step === 2
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-500/20"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              2
            </div>
            <div>
              <p className="text-xs font-bold text-white">Step 2: Employee Scope</p>
              <p className="text-[11px] text-zinc-400">Filter & Persist Batch</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1 FORM */}
        {step === 1 && (
          <form onSubmit={handleContinueToStep2} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Payrun Batch Name *</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. October 2026 Payroll"
                  className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Salary Structure *</label>
              <div className="relative">
                <Layers className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  required
                  value={salaryStructureId}
                  onChange={(e) => setSalaryStructureId(e.target.value)}
                  className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white outline-none"
                >
                  {structures.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rules?.length || 5} Rules)
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                The structure defines calculation rules, category ordering, and deductions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Period Start Date *</label>
                <input
                  type="date"
                  required
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 rounded-xl p-2.5 text-xs text-white outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Period End Date *</label>
                <input
                  type="date"
                  required
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 rounded-xl p-2.5 text-xs text-white outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 py-5 px-6"
              >
                Continue to Employee Selection (BR-PAY-001)
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2 FORM */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/60 p-3.5 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white"
                >
                  {selectedEmpIds.length === allEmployees.length ? (
                    <CheckSquare className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-500" />
                  )}
                  Select All ({allEmployees.length})
                </button>
                <span className="text-xs text-zinc-400">|</span>
                <span className="text-xs text-blue-400 font-mono font-bold">
                  {selectedEmpIds.length} Selected
                </span>
              </div>

              <input
                type="text"
                placeholder="Filter employees..."
                value={empSearch}
                onChange={(e) => setEmpSearch(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 outline-none w-48"
              />
            </div>

            {/* Employee Checkbox List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-zinc-800/40">
              {filteredEmployees.map((emp) => {
                const isSelected = selectedEmpIds.includes(emp.id);
                return (
                  <div
                    key={emp.id}
                    onClick={() => toggleEmployee(emp.id)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-600/10 border border-blue-500/25 text-white"
                        : "bg-zinc-950/40 border border-transparent text-zinc-400 hover:bg-zinc-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-blue-400">
                        {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-zinc-600" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{emp.fullName}</p>
                        <p className="text-[11px] text-zinc-400 font-mono">
                          {emp.jobPosition || "Staff"} • {emp.department?.name || "General"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400">{emp.workEmail}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="border-zinc-700 text-zinc-300 rounded-xl text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Scope
              </Button>

              <Button
                type="button"
                onClick={handleCreatePayrun}
                disabled={loading || selectedEmpIds.length === 0}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/20 py-5 px-6"
              >
                {loading ? "Persisting Batch..." : `Create Payrun (${selectedEmpIds.length} Employees)`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
