"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AttendanceWidget } from "@/modules/time-tracking/components/AttendanceWidget";
import {
  Clock,
  UserCheck,
  AlertCircle,
  Filter,
  CheckCircle2,
  Calendar,
  RefreshCw,
  Edit3,
  Search,
  ArrowLeft,
  X,
} from "lucide-react";

function AttendanceContent() {
  const searchParams = useSearchParams();
  const initialEmployeeId = searchParams.get("employeeId") || "";

  // Session & RBAC (BR-ATT-002)
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.roleName || "Employee";
  const userEmployeeId = (session?.user as any)?.employeeId || "";
  const isEmployee = userRole === "Employee";
  const isHRManager = ["HR Manager", "HR Payroll User", "HR Payroll Manager", "Admin"].includes(userRole);


  const [records, setRecords] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(initialEmployeeId);
  const [statusFilter, setStatusFilter] = useState("");
  const [exceptionsOnly, setExceptionsOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Correction modal
  const [correctionModal, setCorrectionModal] = useState<any | null>(null);
  const [correctionReason, setCorrectionReason] = useState("");
  const [newCheckIn, setNewCheckIn] = useState("");
  const [newCheckOut, setNewCheckOut] = useState("");
  const [correcting, setCorrecting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch employees list (only for HR Manager+)
  useEffect(() => {
    if (!isHRManager) return;  // Employee role doesn't need employee list
    fetch("/api/v1/employees")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEmployees(data);
      })
      .catch(() => {});
  }, [isHRManager]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      let url = "/api/v1/attendance";
      const params = new URLSearchParams();
      // Employee role: always scope to own records only
      if (isEmployee && userEmployeeId) {
        params.append("employeeId", userEmployeeId);
      } else if (selectedEmployeeId) {
        params.append("employeeId", selectedEmployeeId);
      }
      if (exceptionsOnly) params.append("exceptionsOnly", "true");
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setRecords(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedEmployeeId, statusFilter, exceptionsOnly, isEmployee, userEmployeeId]);

  const toLocalInputFormat = (dateStr?: string | Date | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const openCorrection = (record: any) => {
    setCorrectionModal(record);
    setNewCheckIn(toLocalInputFormat(record.checkIn));
    setNewCheckOut(toLocalInputFormat(record.checkOut));
    setCorrectionReason("");
    setActionError(null);
  };

  const submitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionModal) return;
    if (!correctionReason.trim()) {
      setActionError("Please provide a correction reason for auditing (BR-ATT-002).");
      return;
    }
    setCorrecting(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/v1/attendance/${correctionModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn: newCheckIn ? new Date(newCheckIn).toISOString() : undefined,
          checkOut: newCheckOut ? new Date(newCheckOut).toISOString() : null,
          correctionReason,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Correction failed");
      }

      setCorrectionModal(null);
      fetchRecords();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setCorrecting(false);
    }
  };

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);
  const presentCount = records.filter((r) => r.status === "Present").length;
  const lateCount = records.filter((r) => r.status === "Late").length;
  const missingCount = records.filter((r) => !r.checkOut).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {selectedEmployeeId && (
              <button
                onClick={() => setSelectedEmployeeId("")}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mr-2 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> View All
              </button>
            )}
            <h1 className="text-3xl font-bold tracking-tight text-white">Attendance Tracking</h1>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            {selectedEmployee
              ? `Displaying attendance logs and exception audit for ${selectedEmployee.fullName}.`
              : "Live worked hours computation, shift comparison, and exception flagging (BR-ATT-001 & BR-ATT-002)."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchRecords}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Entries</span>
            <Calendar className="w-4 h-4 text-zinc-500" />
          </div>
          <p className="text-3xl font-bold mt-2 text-white font-mono">{records.length}</p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Present Days</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold mt-2 text-emerald-400 font-mono">{presentCount}</p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Late Arrivals</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold mt-2 text-amber-400 font-mono">{lateCount}</p>
        </div>

        <div className="bg-zinc-900/60 border border-rose-500/30 rounded-2xl p-5 backdrop-blur-md shadow-lg bg-rose-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Missing Checkouts</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-bold mt-2 text-rose-400 font-mono">{missingCount}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-300">Filter By:</span>

          {isHRManager && (
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 outline-none focus:border-blue-500"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName}
                </option>
              ))}
            </select>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
          </select>

          <button
            onClick={() => setExceptionsOnly(!exceptionsOnly)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition border ${
              exceptionsOnly
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {exceptionsOnly ? "Showing Exceptions Only" : "Filter Exceptions"}
          </button>
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          {records.length} logs recorded
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-xs uppercase bg-zinc-800/40 text-zinc-400 font-mono">
              <tr>
                <th className="px-6 py-4 font-semibold rounded-tl-xl">Employee</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Check-In</th>
                <th className="px-6 py-4 font-semibold">Check-Out</th>
                <th className="px-6 py-4 font-semibold">Worked Hours</th>
                <th className="px-6 py-4 font-semibold">Status / Exception</th>
                <th className="px-6 py-4 font-semibold rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Loading attendance records...
                    </div>
                  </td>
                </tr>
              ) : records.map((r) => {
                const hasMissingCheckout = !r.checkOut;
                const isLate = r.status === "Late";

                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-zinc-800/30 transition-colors ${
                      hasMissingCheckout ? "bg-rose-950/15" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-white">
                      {r.employee?.fullName || "Employee"}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-zinc-300">
                      {new Date(r.checkIn).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-zinc-300">
                      {new Date(r.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">
                      {r.checkOut ? (
                        <span className="text-zinc-300">
                          {new Date(r.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          Missing Check-out
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-bold text-white">
                      {r.workedHours ? `${Number(r.workedHours).toFixed(1)} hrs` : "0.0 hrs"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                          hasMissingCheckout
                            ? "bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse"
                            : isLate
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {hasMissingCheckout
                          ? "Missing Checkout (VAL-ATT-001)"
                          : r.status}
                      </span>
                      {r.correctedAt && (
                        <span className="ml-2 text-[10px] text-blue-400 font-mono">
                          (Edited)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isHRManager && (
                        <button
                          onClick={() => openCorrection(r)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                          title="Correct Attendance (HR Manager+)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {records.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    No attendance records found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Correction Modal (BR-ATT-002) */}
      {correctionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-400" />
                Correct Attendance (BR-ATT-002)
              </h2>
              <button
                onClick={() => setCorrectionModal(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {actionError}
              </div>
            )}

            <form onSubmit={submitCorrection} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Employee</label>
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200">
                  {correctionModal.employee?.fullName}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Check In Time</label>
                  <input
                    type="datetime-local"
                    value={newCheckIn}
                    onChange={(e) => setNewCheckIn(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Check Out Time</label>
                  <input
                    type="datetime-local"
                    value={newCheckOut}
                    onChange={(e) => setNewCheckOut(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Correction Audit Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="e.g., Employee forgot badge checkout; verified manual log."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCorrectionModal(null)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={correcting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20"
                >
                  {correcting ? "Saving..." : "Stamp & Save Correction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AttendancePage() {
  return (
    <Suspense fallback={<div className="text-zinc-500 py-10">Loading Attendance...</div>}>
      <AttendanceContent />
    </Suspense>
  );
}
