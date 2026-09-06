"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Receipt,
  Search,
  Filter,
  Download,
  ChevronRight,
  RefreshCw,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  X,
  CheckSquare,
  Square,
  Layers,
  Sparkles,
  Users,
} from "lucide-react";

export default function PayslipsListPage() {
  const [payslips, setPayslips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Single Email sending modal
  const [emailModal, setEmailModal] = useState<any | null>(null);
  const [targetEmail, setTargetEmail] = useState("");
  const [sending, setSending] = useState(false);

  // Batch Email modal
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchSending, setBatchSending] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{
    sent: number;
    total: number;
    failed: number;
  } | null>(null);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadPayslips = async () => {
    setLoading(true);
    try {
      let url = "/api/v1/payslips";
      if (statusFilter) url += `?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPayslips(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayslips();
  }, [statusFilter]);

  // Extract unique payrun batches for filtering
  const uniqueBatches = useMemo(() => {
    const batches = new Map<string, string>();
    payslips.forEach((p) => {
      if (p.payrun?.id && p.payrun?.name) {
        batches.set(p.payrun.id, p.payrun.name);
      }
    });
    return Array.from(batches.entries()).map(([id, name]) => ({ id, name }));
  }, [payslips]);

  // Filtered payslips
  const filtered = useMemo(() => {
    return payslips.filter((p) => {
      if (batchFilter && p.payrunId !== batchFilter && p.payrun?.id !== batchFilter) {
        return false;
      }
      if (!search) return true;
      const q = search.toLowerCase();
      const name = p.employee?.fullName?.toLowerCase() || "";
      const runName = p.payrun?.name?.toLowerCase() || "";
      const deptName = p.employee?.department?.name?.toLowerCase() || "";
      return name.includes(q) || runName.includes(q) || deptName.includes(q);
    });
  }, [payslips, batchFilter, search]);

  // Checkbox Selection Helpers
  const isAllSelected = filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id));
  const isSomeSelected = selectedIds.size > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      const next = new Set(selectedIds);
      filtered.forEach((p) => next.add(p.id));
      setSelectedIds(next);
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const selectCurrentBatchOnly = (batchId: string) => {
    const next = new Set<string>();
    payslips.filter((p) => p.payrunId === batchId || p.payrun?.id === batchId).forEach((p) => next.add(p.id));
    setSelectedIds(next);
  };

  // Single Email Modal
  const openEmailModal = (payslip: any) => {
    setEmailModal(payslip);
    setTargetEmail(
      payslip.employee?.workEmail ||
        payslip.employee?.privateEmail ||
        `${payslip.employee?.fullName?.toLowerCase().replace(/\s+/g, ".")}@peoplepay.internal`
    );
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModal) return;

    setSending(true);
    setNotification(null);

    try {
      const res = await fetch(`/api/v1/payslips/${emailModal.id}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send payslip email");
      }

      setNotification({
        type: "success",
        message: `Payslip PDF successfully dispatched to ${targetEmail}!`,
      });
      setEmailModal(null);
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to dispatch email",
      });
    } finally {
      setSending(false);
      setTimeout(() => setNotification(null), 6000);
    }
  };

  // Batch Email Dispatch
  const handleBatchSend = async () => {
    const idsToSend = Array.from(selectedIds);
    if (idsToSend.length === 0) return;

    setBatchSending(true);
    setBatchProgress({ sent: 0, total: idsToSend.length, failed: 0 });

    try {
      const res = await fetch("/api/v1/payslips/batch-send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payslipIds: idsToSend }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send batch emails");
      }

      setNotification({
        type: "success",
        message: `Batch email complete: ${data.sentCount} payslips sent successfully!`,
      });
      setBatchModalOpen(false);
      setSelectedIds(new Set());
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Batch email dispatch encountered an error",
      });
    } finally {
      setBatchSending(false);
      setBatchProgress(null);
      setTimeout(() => setNotification(null), 7000);
    }
  };

  // Selected items summary for modal
  const selectedPayslips = useMemo(() => {
    return payslips.filter((p) => selectedIds.has(p.id));
  }, [payslips, selectedIds]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-bold tracking-tight text-white">Employee Payslips</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Batch Enabled
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Global repository of computed salary slips with live PDF download, multi-selection, and batch email dispatch.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadPayslips}
            className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition shadow-sm cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between gap-3 animate-in fade-in border ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:opacity-80 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by employee, department, or payrun batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
            />
          </div>

          {/* Payrun Batch Filter */}
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="bg-zinc-950/70 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="">All Payrun Batches</option>
              {uniqueBatches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-950/70 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Computed">Computed</option>
              <option value="Validated">Validated</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {batchFilter && (
            <button
              onClick={() => selectCurrentBatchOnly(batchFilter)}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1.5 cursor-pointer underline underline-offset-4"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Select All in this Batch
            </button>
          )}
          <div className="text-xs text-zinc-400 font-mono">
            {filtered.length} payslips listed
          </div>
        </div>
      </div>

      {/* Bulk Action Sticky Bar (appears when items are selected) */}
      {isSomeSelected && (
        <div className="bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-purple-950/80 border border-blue-500/40 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl backdrop-blur-xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
              {selectedIds.size}
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {selectedIds.size} Payslip{selectedIds.size > 1 ? "s" : ""} Selected
              </p>
              <p className="text-[11px] text-zinc-400">
                Ready for one-click batch email dispatch to employee accounts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition cursor-pointer"
            >
              Clear Selection
            </button>
            <button
              onClick={() => setBatchModalOpen(true)}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition hover:scale-105 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              Send Batch Emails ({selectedIds.size})
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-xs uppercase bg-zinc-800/40 text-zinc-400 font-mono">
              <tr>
                <th className="px-4 py-4 w-10 text-center rounded-tl-xl">
                  <button
                    onClick={toggleSelectAll}
                    className="p-1 hover:text-white transition cursor-pointer"
                    title={isAllSelected ? "Deselect all" : "Select all"}
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Payrun Batch</th>
                <th className="px-6 py-4 font-semibold">Period</th>
                <th className="px-6 py-4 font-semibold">Gross Salary</th>
                <th className="px-6 py-4 font-semibold">Net Salary</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold rounded-tr-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Loading payslips...
                    </div>
                  </td>
                </tr>
              ) : filtered.map((p) => {
                const isPaid = p.status === "Paid";
                const isSelected = selectedIds.has(p.id);

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-blue-950/20 hover:bg-blue-950/30"
                        : "hover:bg-zinc-800/30"
                    }`}
                  >
                    {/* Checkbox Column */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggleSelectOne(p.id)}
                        className="p-1 hover:text-white transition cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Square className="w-4 h-4 text-zinc-600 hover:text-zinc-400" />
                        )}
                      </button>
                    </td>

                    {/* Employee Info */}
                    <td className="px-6 py-4 font-semibold text-white">
                      <div>{p.employee?.fullName || "Employee"}</div>
                      <div className="text-xs text-zinc-400 font-mono font-normal flex items-center gap-2">
                        <span>{p.employee?.jobPosition}</span>
                        {p.employee?.department?.name && (
                          <span className="text-[10px] text-zinc-500 font-sans">
                            • {p.employee.department.name}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Payrun Batch */}
                    <td className="px-6 py-4 text-xs font-semibold text-purple-300">
                      {p.payrun?.name || "Standard Batch"}
                    </td>

                    {/* Period */}
                    <td className="px-6 py-4 text-xs font-mono text-zinc-300">
                      <div>
                        {new Date(p.periodStart).toLocaleDateString()} -{" "}
                        {new Date(p.periodEnd).toLocaleDateString()}
                      </div>
                      {Number(p.unpaidLeaveDays || 0) > 0 && (
                        <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 inline-block mt-1 font-sans">
                          {Number(p.unpaidLeaveDays)}d Unpaid LOP
                        </span>
                      )}
                    </td>

                    {/* Gross */}
                    <td className="px-6 py-4 font-mono text-zinc-200">
                      ₹{Number(p.grossTotal).toLocaleString()}
                    </td>

                    {/* Net */}
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                      ₹{Number(p.netTotal).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                          isPaid
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/payroll/payslips/${p.id}`}
                          className="px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-blue-400 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition shadow-sm"
                        >
                          Details
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => openEmailModal(p)}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                          title="Send Payslip to Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Send Email
                        </button>
                        <a
                          href={`/api/v1/payslips/${p.id}/pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-500">
                    No payslips found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Single Email Modal */}
      {emailModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                Send Payslip to Employee Email
              </h2>
              <button
                onClick={() => setEmailModal(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5">
                <div className="flex justify-between text-zinc-400">
                  <span>Employee:</span>
                  <span className="font-bold text-white">
                    {emailModal.employee?.fullName}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Payrun Batch:</span>
                  <span className="font-mono text-purple-300">
                    {emailModal.payrun?.name || "Standard Batch"}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Net Salary:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₹{Number(emailModal.netTotal).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-semibold">
                  Recipient Work Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="employee@company.com"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl p-3 text-zinc-200 outline-none font-mono"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  The generated PDF statement with official earnings breakdown will be dispatched directly to this address.
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEmailModal(null)}
                  className="px-3.5 py-2 rounded-xl text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {sending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Dispatching...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Payslip Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Email Confirmation & Progress Modal */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-400" />
                Batch Send Payslips via Email
              </h2>
              <button
                onClick={() => !batchSending && setBatchModalOpen(false)}
                disabled={batchSending}
                className="p-1 rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center text-zinc-300">
                  <span>Total Recipients to Dispatch:</span>
                  <span className="text-base font-extrabold text-white font-mono">
                    {selectedIds.size} Payslips
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Each employee will receive their verified PDF salary breakdown statement directly to their registered email address.
                </p>
              </div>

              {/* Sample list of recipients preview */}
              <div className="space-y-1.5">
                <span className="text-zinc-400 font-semibold block">
                  Recipients in this Batch:
                </span>
                <div className="max-h-40 overflow-y-auto border border-zinc-800/80 rounded-xl bg-zinc-950/60 p-2 divide-y divide-zinc-800/40">
                  {selectedPayslips.slice(0, 15).map((p) => (
                    <div
                      key={p.id}
                      className="py-1.5 px-2 flex justify-between items-center text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-zinc-200 font-medium">{p.employee?.fullName}</span>
                      </div>
                      <span className="text-zinc-400 font-mono">
                        {p.employee?.workEmail || `${p.employee?.fullName?.toLowerCase().replace(/\s+/g, ".")}@peoplepay.internal`}
                      </span>
                    </div>
                  ))}
                  {selectedPayslips.length > 15 && (
                    <div className="text-center py-1 text-[10px] text-purple-400 font-mono">
                      + {selectedPayslips.length - 15} more recipients
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar when sending */}
              {batchSending && (
                <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-2">
                  <div className="flex justify-between text-[11px] text-zinc-300">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                      Generating PDFs & Dispatching...
                    </span>
                    <span className="font-mono text-purple-400 font-bold">
                      {selectedIds.size} Payslips
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full animate-pulse w-full" />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2 text-xs">
              <button
                type="button"
                disabled={batchSending}
                onClick={() => setBatchModalOpen(false)}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={batchSending}
                onClick={handleBatchSend}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 cursor-pointer"
              >
                {batchSending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Sending Batch...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Dispatch All {selectedIds.size} Payslips
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
