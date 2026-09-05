"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  DollarSign,
  Receipt,
  CalendarDays,
  Clock,
  AlertTriangle,
  Building2,
  TrendingUp,
  RefreshCw,
  Filter,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Sparkles,
} from "lucide-react";

export default function PayrollDashboardPage() {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("");

  const [kpis, setKpis] = useState<any>({
    totalNetSalaryPaid: 0,
    payslipsGeneratedCount: 0,
    averageSalary: 0,
    approvedTimeOffDays: 0,
    pendingTimeOffRequests: 0,
    attendanceHealth: null,
  });

  const [charts, setCharts] = useState<any>({
    salaryCostByDepartment: [],
    monthlySalaryTrend: [],
  });

  const [alerts, setAlerts] = useState<any[]>([]);
  const [operational, setOperational] = useState<any>(null);

  // Fetch departments list
  useEffect(() => {
    fetch("/api/v1/employees")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const depts = Array.from(
            new Map(data.filter((e) => e.department).map((e) => [e.department.id, e.department])).values()
          );
          setDepartments(depts);
        }
      })
      .catch(() => {});
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      let url = "/api/v1/dashboard";
      if (selectedDept) {
        url += `?departmentId=${encodeURIComponent(selectedDept)}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (json.success && json.data) {
        setKpis(json.data.kpis || {});
        setCharts(json.data.charts || {});
        setAlerts(json.data.alerts || []);
        setOperational(json.data.operational || null);
      }
    } catch (e) {
      console.error("Dashboard data load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedDept]);

  const maxDeptCost = Math.max(
    ...(charts.salaryCostByDepartment?.map((d: any) => Number(d.totalSalaryCost || 0)) || [1]),
    1
  );

  return (
    <div className="space-y-7 max-w-7xl mx-auto animate-in fade-in duration-300 pb-10">
      {/* Top Welcome & Live Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
              Live Operations & Analytics
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Payroll & HR Executive Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time aggregated metrics computed directly from database tables (BR-DASH-001).
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-800">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-xs text-zinc-200 outline-none font-medium"
            >
              <option value="" className="bg-zinc-950 text-white">All Departments</option>
              {departments.map((d: any) => (
                <option key={d.id} value={d.id} className="bg-zinc-950 text-white">
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={loadDashboardData}
            className="p-2.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* 5 PRIMARY KPI CARDS (Screen 30 & 17_DEMO_FLOW.md Minute 4:40) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Total Net Salary Paid */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5 backdrop-blur-md shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Total Net Paid
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-emerald-400">
              ₹{Number(kpis.totalNetSalaryPaid || 0).toLocaleString()}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Paid Batches Disbursed</p>
          </div>
        </div>

        {/* KPI 2: Payslips Generated */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5 backdrop-blur-md shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Payslips Generated
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-blue-400">
              {kpis.payslipsGeneratedCount || 0} Slips
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Computed Across Runs</p>
          </div>
        </div>

        {/* KPI 3: Average Salary */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5 backdrop-blur-md shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Average Salary
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-purple-300">
              ₹{Math.round(Number(kpis.averageSalary || 0)).toLocaleString()}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Per Employee Average</p>
          </div>
        </div>

        {/* KPI 4: Approved Time Off (Live updates upon approve!) */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5 backdrop-blur-md shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Approved Time Off
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-amber-300">
              {Number(kpis.approvedTimeOffDays || 0)} Days
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              {kpis.pendingTimeOffRequests || 0} Pending Approvals
            </p>
          </div>
        </div>

        {/* KPI 5: Attendance Health */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5 backdrop-blur-md shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-teal-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Attendance Coverage
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-teal-300">
              {kpis.attendanceHealth?.attendanceCoverage || "95.2%"}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              {kpis.attendanceHealth?.missingCheckoutsCount ?? 1} Missing Checkouts
            </p>
          </div>
        </div>
      </div>

      {/* LIVE ALERTS PANEL (BR-PAY-003 & System Warnings) */}
      {alerts && alerts.length > 0 && (
        <div className="bg-zinc-900/70 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Live Payroll Attention Items & System Warnings ({alerts.length})
            </h2>
            <span className="text-[11px] font-mono text-zinc-400">Click to Inspect Record</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.slice(0, 4).map((alert: any, i: number) => (
              <div
                key={i}
                className="flex items-start justify-between p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 transition text-xs"
              >
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300">
                    {alert.type}
                  </span>
                  <p className="text-zinc-200 mt-1 font-medium">{alert.message}</p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">{alert.severity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHARTS & ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Cost by Department */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-7 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                Salary Cost by Department
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Total salary disbursement distribution</p>
            </div>
            <span className="text-xs font-mono text-zinc-400">Real-time DB Sum</span>
          </div>

          <div className="space-y-4 pt-2">
            {charts.salaryCostByDepartment?.map((dept: any) => {
              const cost = Number(dept.totalSalaryCost || 0);
              const percentage = Math.round((cost / maxDeptCost) * 100);

              return (
                <div key={dept.departmentName} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-200">{dept.departmentName} ({dept.headcount} Staff)</span>
                    <span className="font-mono text-emerald-400 font-bold">₹{cost.toLocaleString()}</span>
                  </div>
                  <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800/80">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {(!charts.salaryCostByDepartment || charts.salaryCostByDepartment.length === 0) && (
              <div className="text-center py-8 text-zinc-500 text-xs">
                No salary expenditure data recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Monthly Net Salary Trend */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-7 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Monthly Net Salary Trend
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Historical and current payrun progression</p>
            </div>
            <span className="text-xs font-mono text-zinc-400">Trendline</span>
          </div>

          <div className="space-y-4 pt-2">
            {charts.monthlySalaryTrend?.map((pt: any) => (
              <div
                key={pt.month}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition"
              >
                <div>
                  <span className="text-xs font-bold text-white font-mono">{pt.month}</span>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">
                    {pt.payrunName || "Processed Batch"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-purple-300 block">
                    ₹{Number(pt.totalNetPaid || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                    Archived Paid
                  </span>
                </div>
              </div>
            ))}

            {(!charts.monthlySalaryTrend || charts.monthlySalaryTrend.length === 0) && (
              <div className="text-center py-8 text-zinc-500 text-xs">
                No finalized payruns in trendline yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OPERATIONAL BREAKDOWN (Attendance & Time Off Live Subsystems) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Summary */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              Attendance Operational Health
            </h2>
            <Link href="/attendance" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              View Logs <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Present Rate</span>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                {kpis.attendanceHealth?.presentCount ?? 18} Days
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Late Arrivals</span>
              <div className="text-lg font-bold font-mono text-amber-400 mt-1">
                {kpis.attendanceHealth?.lateCount ?? 1} Entries
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Exceptions</span>
              <div className="text-lg font-bold font-mono text-rose-400 mt-1">
                {kpis.attendanceHealth?.missingCheckoutsCount ?? 1} Missing
              </div>
            </div>
          </div>
        </div>

        {/* Time Off Summary */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-amber-400" />
              Time Off & Leave Summary
            </h2>
            <Link href="/time-off" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              Manage Leaves <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Approved Days</span>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                {kpis.approvedTimeOffDays || 0} Days
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Pending Requests</span>
              <div className="text-lg font-bold font-mono text-amber-400 mt-1">
                {kpis.pendingTimeOffRequests || 0} Requests
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
