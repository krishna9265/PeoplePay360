"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileSignature,
  Loader2,
  Calendar,
  Layers,
  Clock,
  AlertCircle,
  CalendarDays,
  User,
  IndianRupee,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeOption {
  id: string;
  fullName: string;
  workEmail: string;
  jobPosition: string;
  department?: { name: string };
  workingScheduleId?: string;
}

interface OptionItem {
  id: string;
  name: string;
}

function parseList(res: any): any[] {
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.data)) return res.data;
  return [];
}

export default function NewContractPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [structures, setStructures] = useState<OptionItem[]>([]);
  const [schedules, setSchedules] = useState<OptionItem[]>([]);

  const [formData, setFormData] = useState({
    employeeId: "",
    salaryStructureId: "",
    workingScheduleId: "",
    wage: "60000",
    startDate: "2026-09-01",
    endDate: "",
    status: "Active",
  });

  useEffect(() => {
    let isMounted = true;
    async function loadFormPrerequisites() {
      try {
        const [empRes, structRes, schedRes] = await Promise.all([
          fetch("/api/v1/employees").then((r) => r.json()).catch(() => []),
          fetch("/api/v1/salary-structures").then((r) => r.json()).catch(() => []),
          fetch("/api/v1/schedules").then((r) => r.json()).catch(() => []),
        ]);

        const emps: EmployeeOption[] = parseList(empRes);
        const structs: OptionItem[] = parseList(structRes);
        const scheds: OptionItem[] = parseList(schedRes);

        if (isMounted) {
          setEmployees(emps);
          setStructures(structs);
          setSchedules(scheds);

          if (emps.length > 0) {
            setFormData((prev) => ({
              ...prev,
              employeeId: prev.employeeId || emps[0].id,
              salaryStructureId: prev.salaryStructureId || structs[0]?.id || "",
              workingScheduleId: prev.workingScheduleId || emps[0].workingScheduleId || scheds[0]?.id || "",
            }));
          }
          setDataLoading(false);
        }
      } catch (err: any) {
        console.error("Failed to load prerequisites", err);
        if (isMounted) {
          setError("Could not load options. You can still input contract parameters.");
          setDataLoading(false);
        }
      }
    }

    loadFormPrerequisites();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleEmployeeChange = (empId: string) => {
    const selected = employees.find((e) => e.id === empId);
    setFormData((prev) => ({
      ...prev,
      employeeId: empId,
      workingScheduleId: selected?.workingScheduleId || schedules[0]?.id || prev.workingScheduleId,
    }));
  };

  const setQuickStartDate = (dateStr: string) => {
    setFormData((prev) => ({ ...prev, startDate: dateStr }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.employeeId) {
      setError("Please select an employee.");
      setLoading(false);
      return;
    }

    if (!formData.wage || Number(formData.wage) <= 0) {
      setError("Please enter a valid base wage amount.");
      setLoading(false);
      return;
    }

    if (!formData.startDate) {
      setError("Please select a contract start date.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: formData.employeeId,
          salaryStructureId: formData.salaryStructureId || undefined,
          workingScheduleId: formData.workingScheduleId || undefined,
          wage: Number(formData.wage),
          startDate: formData.startDate,
          endDate: formData.endDate || null,
          status: formData.status,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to create contract");
      }

      router.push("/contracts");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error creating contract. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <p className="text-sm text-zinc-400">Loading contract configuration options...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
        <Link href="/contracts" className="hover:text-white transition-colors flex items-center gap-1.5 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Contracts
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <FileSignature className="w-6 h-6" />
          </div>
          Create Employment Contract
        </h1>
        <p className="text-zinc-400 mt-1">
          Assign an active employment contract, working schedule, and salary structure to an employee.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-4 rounded-2xl text-sm flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-200">Notice</p>
            <p className="text-xs text-rose-300/90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" />
              Select Employee <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <select
                required
                value={formData.employeeId}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all cursor-pointer appearance-none"
              >
                <option value="" disabled>Choose an employee...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} — {emp.jobPosition} ({emp.workEmail})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-zinc-500 text-xs">
                ▼
              </div>
            </div>
            {employees.length === 0 && (
              <p className="text-xs text-amber-400 mt-1.5">
                No employees found. <Link href="/employees/new" className="underline">Create an employee first</Link>.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Wage */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                Base Wage / Salary (Monthly) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 font-bold">
                  ₹
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={formData.wage}
                  onChange={(e) => setFormData({ ...formData, wage: e.target.value })}
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3 pl-9 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all font-mono font-bold"
                  placeholder="60000"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Contract Status
              </label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="Active">Active (Ready for Payroll Calculation)</option>
                  <option value="Draft">Draft (Pending Review)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-zinc-500 text-xs">
                  ▼
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Salary Structure */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                Salary Structure <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.salaryStructureId}
                  onChange={(e) => setFormData({ ...formData, salaryStructureId: e.target.value })}
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all cursor-pointer appearance-none"
                >
                  {structures.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                  {structures.length === 0 && (
                    <option value="">Default Salary Structure</option>
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-zinc-500 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Working Schedule */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Working Schedule <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.workingScheduleId}
                  onChange={(e) => setFormData({ ...formData, workingScheduleId: e.target.value })}
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all cursor-pointer appearance-none"
                >
                  {schedules.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                  {schedules.length === 0 && (
                    <option value="">Standard 40hr</option>
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-zinc-500 text-xs">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Dates with Calendar picker & Quick Pickers */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  Start Date (Click to open Calendar) <span className="text-rose-400">*</span>
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onClick={(e) => (e.target as any).showPicker?.()}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-zinc-950/80 border border-zinc-800 group-hover:border-purple-500/70 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all cursor-pointer font-mono"
                  />
                </div>
                {/* Quick Date Presets */}
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setQuickStartDate("2026-09-01")}
                    className="text-[11px] px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  >
                    Sep 1, 2026
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickStartDate("2026-10-01")}
                    className="text-[11px] px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  >
                    Oct 1, 2026
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickStartDate(new Date().toISOString().split("T")[0])}
                    className="text-[11px] px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  >
                    Today
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  End Date (Optional / Open-Ended)
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    value={formData.endDate}
                    onClick={(e) => (e.target as any).showPicker?.()}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-zinc-950/80 border border-zinc-800 group-hover:border-purple-500/70 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all cursor-pointer font-mono"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, endDate: "" }))}
                    className="text-[11px] px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  >
                    No End Date (Permanent)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-5 border-t border-zinc-800/80 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/contracts")}
              className="bg-zinc-800 hover:bg-zinc-700 text-white border-0 rounded-xl px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-0 rounded-xl px-6 py-2.5 font-semibold text-sm shadow-lg shadow-purple-500/20 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Contract...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save & Activate Contract
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
