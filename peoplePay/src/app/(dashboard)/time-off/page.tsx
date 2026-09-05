"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  Coins,
  FileText,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  ArrowLeft,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function TimeOffContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as any) || "requests";
  const initialEmployeeId = searchParams.get("employeeId") || "";

  const [tab, setTab] = useState<"requests" | "allocations" | "types">(
    initialTab === "allocations" ? "allocations" : initialTab === "types" ? "types" : "requests"
  );
  const [employeeFilter, setEmployeeFilter] = useState(initialEmployeeId);

  const [requests, setRequests] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [newRequestModal, setNewRequestModal] = useState(false);
  const [newAllocModal, setNewAllocModal] = useState(false);
  const [newTypeModal, setNewTypeModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Form states
  const [reqEmpId, setReqEmpId] = useState("");
  const [reqTypeId, setReqTypeId] = useState("");
  const [reqStart, setReqStart] = useState("");
  const [reqEnd, setReqEnd] = useState("");
  const [reqReason, setReqReason] = useState("");

  const [allocEmpId, setAllocEmpId] = useState("");
  const [allocTypeId, setAllocTypeId] = useState("");
  const [allocDays, setAllocDays] = useState("10");

  const [typeName, setTypeName] = useState("");
  const [typeUnit, setTypeUnit] = useState<"Days" | "Hours">("Days");
  const [typeReqAlloc, setTypeReqAlloc] = useState(true);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [reqRes, allocRes, typeRes, empRes] = await Promise.all([
        fetch("/api/v1/time-off-requests").then((r) => r.json()),
        fetch("/api/v1/allocations").then((r) => r.json()),
        fetch("/api/v1/time-off-types").then((r) => r.json()),
        fetch("/api/v1/employees").then((r) => r.json()),
      ]);

      if (reqRes.success) setRequests(reqRes.data || []);
      if (allocRes.success) setAllocations(allocRes.data || []);
      if (typeRes.success) setTypes(typeRes.data || []);
      if (Array.isArray(empRes)) setEmployees(empRes);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load time off records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Approve Request (Scenario 2 - Devansh Rao)
  const handleApproveRequest = async (id: string) => {
    setProcessingId(id);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/v1/time-off-requests/${id}/approve`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Approval failed");
      }

      setSuccessMsg("Time off request approved! Allocation balance updated live (BR-LEAVE-002).");
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setProcessingId(null);
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  // Refuse Request (BR-LEAVE-003)
  const handleRefuseRequest = async (id: string) => {
    setProcessingId(id);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/v1/time-off-requests/${id}/refuse`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Refusal failed");
      }

      setSuccessMsg("Request refused. Allocation balance remains 100% untouched (BR-LEAVE-003).");
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setProcessingId(null);
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  // Submit Request
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/time-off-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: reqEmpId,
          timeOffTypeId: reqTypeId,
          startDate: reqStart,
          endDate: reqEnd,
          reason: reqReason,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Submission failed");

      setNewRequestModal(false);
      setSuccessMsg("Leave request submitted successfully.");
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Submit Allocation
  const handleSubmitAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/allocations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: allocEmpId,
          timeOffTypeId: allocTypeId,
          allocatedAmount: Number(allocDays),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Allocation failed");

      setNewAllocModal(false);
      setSuccessMsg("Allocation grant created successfully.");
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Approve Allocation (BR-LEAVE-001)
  const handleApproveAllocation = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/allocations/${id}/approve`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Approval failed");
      setSuccessMsg("Allocation approved and made usable for leave requests (BR-LEAVE-001).");
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (employeeFilter && r.employeeId !== employeeFilter) return false;
    return true;
  });

  const filteredAllocations = allocations.filter((a) => {
    if (employeeFilter && a.employeeId !== employeeFilter) return false;
    return true;
  });

  const selectedEmployee = employees.find((e) => e.id === employeeFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {employeeFilter && (
              <button
                onClick={() => setEmployeeFilter("")}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mr-2 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Clear Employee Filter
              </button>
            )}
            <h1 className="text-3xl font-bold tracking-tight text-white">Time Off & Leave Management</h1>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            {selectedEmployee
              ? `Displaying leave records and balances for ${selectedEmployee.fullName}.`
              : "Handle leave requests, allocation balances, and time off policies (BR-LEAVE-001..003)."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {tab === "requests" && (
            <Button
              onClick={() => setNewRequestModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Leave Request
            </Button>
          )}
          {tab === "allocations" && (
            <Button
              onClick={() => setNewAllocModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Grant Allocation
            </Button>
          )}
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setTab("requests")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            tab === "requests"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Leave Requests ({requests.length})
        </button>

        <button
          onClick={() => setTab("allocations")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            tab === "allocations"
              ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          <Coins className="w-4 h-4" />
          Leave Allocations ({allocations.length})
        </button>

        <button
          onClick={() => setTab("types")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            tab === "types"
              ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          Time Off Types ({types.length})
        </button>
      </div>

      {/* TAB 1: REQUESTS */}
      {tab === "requests" && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="text-xs uppercase bg-zinc-800/40 text-zinc-400 font-mono">
                <tr>
                  <th className="px-6 py-4 font-semibold rounded-tl-xl">Requester</th>
                  <th className="px-6 py-4 font-semibold">Leave Type</th>
                  <th className="px-6 py-4 font-semibold">Period</th>
                  <th className="px-6 py-4 font-semibold">Duration</th>
                  <th className="px-6 py-4 font-semibold">Reason</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-zinc-500">
                      Loading leave requests...
                    </td>
                  </tr>
                ) : filteredRequests.map((r) => {
                  const isPending = r.status === "Pending";
                  const isApproved = r.status === "Approved";

                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-zinc-800/30 transition-colors ${
                        isPending ? "bg-amber-950/10" : ""
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-white">
                        {r.employee?.fullName || "Employee"}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-blue-400">
                        {r.timeOffType?.name || "Leave"}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-zinc-300">
                        {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono font-bold text-white">
                        {Number(r.duration)} {r.timeOffType?.unit || "Days"}
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-400 max-w-xs truncate">
                        {r.reason || "Personal"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                            isPending
                              ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse"
                              : isApproved
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isPending ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApproveRequest(r.id)}
                              disabled={processingId === r.id}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRefuseRequest(r.id)}
                              disabled={processingId === r.id}
                              className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Refuse
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-500 font-mono">Archived</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredRequests.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-zinc-500">
                      No leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ALLOCATIONS */}
      {tab === "allocations" && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="text-xs uppercase bg-zinc-800/40 text-zinc-400 font-mono">
                <tr>
                  <th className="px-6 py-4 font-semibold rounded-tl-xl">Employee</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Total Allocated</th>
                  <th className="px-6 py-4 font-semibold">Taken</th>
                  <th className="px-6 py-4 font-semibold">Remaining Balance</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-zinc-500">
                      Loading allocations...
                    </td>
                  </tr>
                ) : filteredAllocations.map((a) => (
                  <tr key={a.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      {a.employee?.fullName || "Employee"}
                    </td>
                    <td className="px-6 py-4 text-xs text-emerald-400 font-semibold">
                      {a.timeOffType?.name || "Leave"}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-bold text-zinc-300">
                      {Number(a.allocatedAmount)} {a.timeOffType?.unit || "Days"}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-zinc-400">
                      {Number(a.takenAmount)} {a.timeOffType?.unit || "Days"}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono font-bold text-emerald-400">
                      {Number(a.remainingAmount)} {a.timeOffType?.unit || "Days"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          a.status === "Approved"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {a.status === "Draft" ? (
                        <button
                          onClick={() => handleApproveAllocation(a.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm"
                        >
                          Approve (BR-LEAVE-001)
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-500 font-mono">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TYPES */}
      {tab === "types" && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="text-xs uppercase bg-zinc-800/40 text-zinc-400 font-mono">
                <tr>
                  <th className="px-6 py-4 font-semibold rounded-tl-xl">Leave Policy</th>
                  <th className="px-6 py-4 font-semibold">Unit</th>
                  <th className="px-6 py-4 font-semibold">Requires Allocation</th>
                  <th className="px-6 py-4 font-semibold">Requires Approval</th>
                  <th className="px-6 py-4 font-semibold">Payroll Integration</th>
                  <th className="px-6 py-4 font-semibold rounded-tr-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {types.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-800/30">
                    <td className="px-6 py-4 font-semibold text-white">{t.name}</td>
                    <td className="px-6 py-4 text-xs font-mono text-zinc-300">{t.unit}</td>
                    <td className="px-6 py-4 text-xs">
                      {t.requiresAllocation ? "Yes (Tracked Balance)" : "No (Unlimited)"}
                    </td>
                    <td className="px-6 py-4 text-xs">{t.requiresApproval ? "Yes (Manager Signoff)" : "Auto-approved"}</td>
                    <td className="px-6 py-4 text-xs">{t.affectsPayroll ? "Deducts Unpaid from Gross" : "Standard Paid"}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: New Leave Request */}
      {newRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-400" />
                Submit Time Off Request
              </h2>
              <button
                onClick={() => setNewRequestModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Employee</label>
                <select
                  required
                  value={reqEmpId}
                  onChange={(e) => setReqEmpId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none"
                >
                  <option value="">Select Employee...</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Leave Type</label>
                <select
                  required
                  value={reqTypeId}
                  onChange={(e) => setReqTypeId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none"
                >
                  <option value="">Select Policy...</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={reqStart}
                    onChange={(e) => setReqStart(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={reqEnd}
                    onChange={(e) => setReqEnd(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Reason / Justification</label>
                <textarea
                  rows={2}
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  placeholder="e.g. Annual vacation travel"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewRequestModal(false)}
                  className="px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Allocation */}
      {newAllocModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400" />
                Grant Leave Allocation
              </h2>
              <button
                onClick={() => setNewAllocModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAllocation} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Employee</label>
                <select
                  required
                  value={allocEmpId}
                  onChange={(e) => setAllocEmpId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none"
                >
                  <option value="">Select Employee...</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Leave Type</label>
                <select
                  required
                  value={allocTypeId}
                  onChange={(e) => setAllocTypeId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none"
                >
                  <option value="">Select Policy...</option>
                  {types.filter(t => t.requiresAllocation).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Allocated Amount (Days)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={allocDays}
                  onChange={(e) => setAllocDays(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-200 outline-none font-mono"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewAllocModal(false)}
                  className="px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/20"
                >
                  Create Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TimeOffPage() {
  return (
    <Suspense fallback={<div className="text-zinc-500 py-10">Loading Time Off...</div>}>
      <TimeOffContent />
    </Suspense>
  );
}
