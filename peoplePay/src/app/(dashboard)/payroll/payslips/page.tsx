"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

export default function PayslipsListPage() {
  const [payslips, setPayslips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Email sending modal
  const [emailModal, setEmailModal] = useState<any | null>(null);
  const [targetEmail, setTargetEmail] = useState("");
  const [sending, setSending] = useState(false);
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
        message: `Payslip statement PDF successfully dispatched to ${targetEmail}!`,
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

  const filtered = payslips.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const name = p.employee?.fullName?.toLowerCase() || "";
    const runName = p.payrun?.name?.toLowerCase() || "";
    return name.includes(q) || runName.includes(q);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Employee Payslips</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Global repository of computed salary slips with live PDF download and instant email dispatch.
          </p>
        </div>
        <button
          onClick={loadPayslips}
          className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
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
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:opacity-80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by employee or payrun batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-950/70 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Computed">Computed</option>
              <option value="Validated">Validated</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          {filtered.length} payslips listed
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-xs uppercase bg-zinc-800/40 text-zinc-400 font-mono">
              <tr>
                <th className="px-6 py-4 font-semibold rounded-tl-xl">Employee</th>
                <th className="px-6 py-4 font-semibold">Payrun Batch</th>
                <th className="px-6 py-4 font-semibold">Period</th>
                <th className="px-6 py-4 font-semibold">Gross Salary</th>
                <th className="px-6 py-4 font-semibold">Net Salary</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Loading payslips...
                    </div>
                  </td>
                </tr>
              ) : filtered.map((p) => {
                const isPaid = p.status === "Paid";
                return (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div>{p.employee?.fullName || "Employee"}</div>
                      <span className="text-xs text-zinc-400 font-mono font-normal">
                        {p.employee?.jobPosition}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-purple-300">
                      {p.payrun?.name || "Standard Batch"}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-zinc-300">
                      {new Date(p.periodStart).toLocaleDateString()} - {new Date(p.periodEnd).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-200">
                      ₹{Number(p.grossTotal).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                      ₹{Number(p.netTotal).toLocaleString()}
                    </td>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/payroll/payslips/${p.id}`}
                          className="px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-blue-400 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition shadow-sm"
                        >
                          Details
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => openEmailModal(p)}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition shadow-sm"
                          title="Send Payslip to Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Send Email
                        </button>
                        <a
                          href={`/api/v1/payslips/${p.id}/pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
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
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    No payslips found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Email Modal */}
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
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
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
                  className="px-3.5 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
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
    </div>
  );
}
