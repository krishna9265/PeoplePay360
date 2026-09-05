"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Send,
  Download,
  Calendar,
  Layers,
  Users,
  Clock,
  ChevronRight,
  RefreshCw,
  FileText,
  BadgeAlert,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PayrunProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: session } = useSession();
  const userRole = (session?.user as any)?.roleName || "Employee";
  const isPayrollManager = ["HR Payroll Manager", "Admin"].includes(userRole);

  const [payrun, setPayrun] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [payslips, setPayslips] = useState<any[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPayrun = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/v1/payruns/${id}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load payrun");
      }
      setPayrun(data.data.payrun);
      setEmployees(data.data.employees || []);
      setPayslips(data.data.payslips || []);
      setWarnings(data.data.warnings || []);
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadPayrun();
  }, [id]);

  // Actions
  const handleCompute = async () => {
    setActionLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/v1/payruns/${id}/compute`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Compute execution failed");
      }
      setStatusMessage(data.message || "Payroll computed successfully!");
      await loadPayrun();
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleValidate = async () => {
    setActionLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/v1/payruns/${id}/validate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Validation failed");
      }
      setStatusMessage("Payrun batch validated successfully! Ready for payment.");
      await loadPayrun();
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    setActionLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/v1/payruns/${id}/mark-paid`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Mark Paid failed");
      }
      setStatusMessage("Payrun batch marked as PAID! All payslips archived to historical record.");
      await loadPayrun();
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendPayslips = async () => {
    setActionLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/v1/payruns/${id}/send-payslips`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Send payslips failed");
      }
      setStatusMessage(data.message || "All payslip PDFs generated and dispatched via email gateway!");
      await loadPayrun();
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading Payrun Processing View...</span>
        </div>
      </div>
    );
  }

  if (!payrun) {
    return <div className="text-rose-400 py-12 text-center">Payrun not found.</div>;
  }

  const isDraft = payrun.status === "Draft";
  const isComputed = payrun.status === "Computed";
  const isValidated = payrun.status === "Validated";
  const isPaid = payrun.status === "Paid";

  const totalGross = payslips.reduce((acc, p) => acc + Number(p.grossTotal || 0), 0);
  const totalNet = payslips.reduce((acc, p) => acc + Number(p.netTotal || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Back and Status Bar */}
      <div className="flex items-center justify-between">
        <Link href="/payroll/payruns" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Payruns
        </Link>
        <div className="text-xs font-mono text-zinc-400">
          ID: {payrun.id}
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-7 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{payrun.name}</h1>
                <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    {new Date(payrun.periodStart).toLocaleDateString()} - {new Date(payrun.periodEnd).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-purple-300">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    {payrun.salaryStructure?.name || "Regular Salary"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isPaid
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.3)]"
                  : isValidated
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                  : isComputed
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse"
                  : "bg-zinc-800 text-zinc-300 border border-zinc-700"
              }`}
            >
              Status: {payrun.status}
            </span>

            {/* ACTION BUTTONS (08_PAYRUN_STATE_MACHINE.md & 03 user role rbac.md) */}
            {isPayrollManager ? (
              <>
                {(isDraft || isComputed) && (
                  <Button
                    onClick={handleCompute}
                    disabled={actionLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-500/20 py-5"
                  >
                    <Calculator className="w-4 h-4" />
                    {actionLoading ? "Evaluating Rules..." : isComputed ? "Recompute Rules" : "Compute (Run Engine)"}
                  </Button>
                )}

                {isComputed && (
                  <Button
                    onClick={handleValidate}
                    disabled={actionLoading}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-500/20 py-5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Validate Batch
                  </Button>
                )}

                {isValidated && (
                  <Button
                    onClick={handleMarkPaid}
                    disabled={actionLoading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 py-5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Paid
                  </Button>
                )}

                {(isComputed || isValidated || isPaid) && (
                  <Button
                    onClick={handleSendPayslips}
                    disabled={actionLoading}
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 py-5"
                  >
                    <Send className="w-4 h-4 text-purple-400" />
                    Send Payslips
                  </Button>
                )}
              </>
            ) : (
              <span className="text-[11px] text-zinc-400 font-mono italic px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800">
                View-Only Payrun (Lifecycle execution reserved for HR Payroll Manager)
              </span>
            )}
          </div>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800">
            <span className="text-[11px] font-semibold uppercase text-zinc-400 block">Scoped Workforce</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">{employees.length} Staff</div>
          </div>
          <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800">
            <span className="text-[11px] font-semibold uppercase text-zinc-400 block">Payslips Generated</span>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-1">{payslips.length} Slips</div>
          </div>
          <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800">
            <span className="text-[11px] font-semibold uppercase text-zinc-400 block">Total Gross Salary</span>
            <div className="text-2xl font-bold font-mono text-zinc-200 mt-1">₹{totalGross.toLocaleString()}</div>
          </div>
          <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800">
            <span className="text-[11px] font-semibold uppercase text-zinc-400 block">Total Net Disbursement</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">₹{totalNet.toLocaleString()}</div>
          </div>
        </div>

        {/* WARNINGS PANEL (BR-PAY-003 & 17_DEMO_FLOW.md Aditya Verma check) */}
        {warnings.length > 0 && (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <BadgeAlert className="w-4 h-4 text-amber-400" />
                Payroll Issues & Warnings Surfaced ({warnings.length})
              </h2>
              <span className="text-[11px] font-mono text-amber-400">BR-PAY-003 Enforcement</span>
            </div>
            <div className="space-y-2">
              {warnings.map((w, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-3 rounded-xl bg-zinc-950/60 border border-amber-500/20 text-xs"
                >
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300">
                      {w.type}
                    </span>
                    <span className="text-zinc-200">{w.message}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400">
                    {w.severity || "Warning"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAYSLIPS SUMMARY TABLE */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Computed Payslips Breakdown
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              {payslips.length} of {employees.length} Computed
            </span>
          </div>

          <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/50">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-800/50 uppercase text-zinc-400 font-mono">
                <tr>
                  <th className="px-5 py-3.5">Employee</th>
                  <th className="px-5 py-3.5">Worked Days</th>
                  <th className="px-5 py-3.5">Gross Total</th>
                  <th className="px-5 py-3.5">Net Total</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {payslips.map((ps) => (
                  <tr key={ps.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white">
                      <div>{ps.employee?.fullName || "Employee"}</div>
                      <span className="text-[11px] text-zinc-400 font-mono font-normal">
                        {ps.employee?.jobPosition}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-zinc-300">{Number(ps.workedDays)} Days</td>
                    <td className="px-5 py-3.5 font-mono text-zinc-200">₹{Number(ps.grossTotal).toLocaleString()}</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-emerald-400">
                      ₹{Number(ps.netTotal).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {ps.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/payroll/payslips/${ps.id}`}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-blue-400 text-xs font-semibold inline-flex items-center gap-1 transition"
                        >
                          View Lines
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                        <a
                          href={`/api/v1/payslips/${ps.id}/pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                          title="Print / Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}

                {payslips.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-zinc-500">
                      No payslips computed yet. Click "Compute" above to execute the payroll calculation engine.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
