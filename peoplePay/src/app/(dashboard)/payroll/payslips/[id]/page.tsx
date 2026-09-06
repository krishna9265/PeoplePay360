"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Receipt,
  Download,
  Calendar,
  Layers,
  Building2,
  Briefcase,
  UserCheck,
  CheckCircle2,
  Coins,
  ShieldCheck,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PayslipDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [payslip, setPayslip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Email modal
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchPayslip = () => {
    if (!id) return;
    fetch(`/api/v1/payslips/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setPayslip(data.data);
          setTargetEmail(
            data.data.employee?.workEmail ||
              data.data.employee?.privateEmail ||
              `${data.data.employee?.fullName?.toLowerCase().replace(/\s+/g, ".")}@peoplepay.internal`
          );
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayslip();
  }, [id]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSendingEmail(true);
    setNotification(null);

    try {
      const res = await fetch(`/api/v1/payslips/${id}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch email");
      }

      setNotification({
        type: "success",
        message: `Payslip PDF statement successfully sent to ${targetEmail}!`,
      });
      setEmailModalOpen(false);
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Email dispatch failed",
      });
    } finally {
      setSendingEmail(false);
      setTimeout(() => setNotification(null), 6000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Generating Payslip Breakdown...</span>
        </div>
      </div>
    );
  }

  if (!payslip) {
    return <div className="text-rose-400 py-12 text-center">Payslip record not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
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

      {/* Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link
          href={payslip?.payrunId ? `/payroll/payruns/${payslip.payrunId}` : `/payroll/payruns`}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Payrun Processing
        </Link>

        <div className="flex items-center gap-3">
          {/* Send to Email Button */}
          <button
            onClick={() => setEmailModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            Send to Email
          </button>

          {/* Live Print Payslip Button (17_DEMO_FLOW.md Minute 3:15-4:00) */}
          <a
            href={`/api/v1/payslips/${id}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Print Payslip (Generate PDF)
          </a>
        </div>
      </div>

      {/* Payslip Document Card */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-600/10 via-purple-600/5 to-transparent rounded-bl-full pointer-events-none" />

        {/* Payslip Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-800 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Payslip: {payslip.employee?.fullName || payslip.employeeName || "Employee"}
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                  Period: {payslip.periodStart ? new Date(payslip.periodStart).toLocaleDateString() : (payslip.period?.start ? new Date(payslip.period.start).toLocaleDateString() : "—")} – {payslip.periodEnd ? new Date(payslip.periodEnd).toLocaleDateString() : (payslip.period?.end ? new Date(payslip.period.end).toLocaleDateString() : "—")}
                </p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {payslip.status}
            </span>
            <p className="text-[11px] text-zinc-400 font-mono mt-1">
              Batch: {payslip.payrun?.name || payslip.payrunName || "Payrun Batch"}
            </p>
          </div>
        </div>

        {/* Employee & Contract Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
          <div>
            <span className="text-zinc-400 uppercase text-[10px] font-semibold block">Employee</span>
            <span className="font-bold text-white mt-1 block">{payslip.employee?.fullName || payslip.employeeName || "Employee"}</span>
            <span className="text-zinc-400 font-mono text-[11px]">{payslip.employee?.workEmail || payslip.employeeEmail || "—"}</span>
          </div>

          <div>
            <span className="text-zinc-400 uppercase text-[10px] font-semibold block">Position & Dept</span>
            <span className="font-bold text-white mt-1 block">{payslip.employee?.jobPosition || "Staff"}</span>
            <span className="text-zinc-400 text-[11px]">{payslip.employee?.department?.name || "General"}</span>
          </div>

          <div>
            <span className="text-zinc-400 uppercase text-[10px] font-semibold block">Worked Days</span>
            <span className="font-bold text-white mt-1 block font-mono text-sm">
              {Number(payslip.workedDays || 0)} Days
            </span>
            <span className="text-zinc-400 text-[11px]">Computed by Schedule</span>
          </div>

          <div>
            <span className="text-zinc-400 uppercase text-[10px] font-semibold block">Unpaid Leave (LOP)</span>
            <span className={`font-bold mt-1 block font-mono text-sm ${Number(payslip.unpaidLeaveDays || 0) > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {Number(payslip.unpaidLeaveDays || 0)} Days
            </span>
            <span className="text-zinc-400 text-[11px]">{Number(payslip.unpaidLeaveDays || 0) > 0 ? 'Affects Net Pay' : 'No Deduction'}</span>
          </div>

          <div>
            <span className="text-zinc-400 uppercase text-[10px] font-semibold block">Contract</span>
            <span className="font-bold text-white mt-1 block truncate">
              {payslip.contract?.name || "Applicable Contract"}
            </span>
            <span className="text-zinc-400 text-[11px] font-mono">
              ₹{Number(payslip.contract?.wage || payslip.grossTotal || 0).toLocaleString()} Base
            </span>
          </div>
        </div>

        {/* Salary Rules Table Breakdown (Screen 25) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Salary Rule Breakdown (Screen 25)
            </h2>
            <span className="text-xs font-mono text-zinc-400">Sequence Ordered</span>
          </div>

          <div className="border border-zinc-800/80 rounded-2xl overflow-hidden bg-zinc-950/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 font-semibold border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-3.5 w-16">Seq</th>
                  <th className="px-6 py-3.5">Rule Name</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5 text-right">Computed Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {payslip.lines?.map((line: any, index: number) => {
                  const categoryName = typeof line.category === "string" ? line.category : line.category?.name || "";
                  const isGross = categoryName === "Gross";
                  const isNet = categoryName === "Net";
                  const isDeduction = categoryName === "Deductions";
                  const ruleName = line.salaryRule?.name || line.ruleName || "Salary Rule";
                  const ruleCode = line.salaryRule?.code || line.ruleCode || "";

                  return (
                    <tr
                      key={line.id || `${line.salaryRuleId || ruleCode || 'rule'}-${line.sequence ?? index}`}
                      className={`hover:bg-zinc-800/20 ${
                        isNet ? "bg-emerald-950/10 font-bold" : isGross ? "bg-blue-950/10 font-semibold" : ""
                      }`}
                    >
                      <td className="px-6 py-3.5 font-mono text-zinc-400">
                        #{line.sequence ?? index + 1}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span>{ruleName}</span>
                          {ruleCode && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                              {ruleCode}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            categoryName === "Basic"
                              ? "bg-blue-500/10 text-blue-400"
                              : categoryName === "Allowances"
                              ? "bg-purple-500/10 text-purple-400"
                              : categoryName === "Gross"
                              ? "bg-indigo-500/10 text-indigo-400"
                              : categoryName === "Deductions"
                              ? "bg-rose-500/10 text-rose-400"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {categoryName || "Rule"}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-3.5 text-right font-mono text-sm ${
                          isNet
                            ? "text-emerald-400 text-base font-bold"
                            : isDeduction
                            ? "text-rose-400"
                            : "text-zinc-200"
                        }`}
                      >
                        {isDeduction ? "-" : ""}₹{Number(line.amount).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800">
            <span className="text-xs uppercase font-semibold text-zinc-400 block">Gross Remuneration</span>
            <div className="text-3xl font-bold font-mono text-white mt-1">
              ₹{Number(payslip.grossTotal).toLocaleString()}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Sum of Basic Salary + Allowances</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-tr from-emerald-600/15 to-blue-600/10 border border-emerald-500/30">
            <span className="text-xs uppercase font-semibold text-emerald-400 block">Net Take-Home Salary</span>
            <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">
              ₹{Number(payslip.netTotal).toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-400/80 mt-1">Final disbursed compensation after statutory deductions</p>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                Dispatch Payslip via Email
              </h2>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5">
                <div className="flex justify-between text-zinc-400">
                  <span>Recipient:</span>
                  <span className="font-bold text-white">
                    {payslip.employee?.fullName}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Period:</span>
                  <span className="font-mono text-zinc-300">
                    {new Date(payslip.periodStart).toLocaleDateString()} – {new Date(payslip.periodEnd).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Net Amount:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₹{Number(payslip.netTotal).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-semibold">
                  Employee Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="employee@company.com"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl p-3 text-zinc-200 outline-none font-mono"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  The complete PDF statement with itemized salary breakdown will be delivered immediately to this address.
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {sendingEmail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Sending PDF...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send to Email
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
