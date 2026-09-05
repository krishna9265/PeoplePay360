"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Mail,
  Building2,
  MapPin,
  Calendar,
  ArrowUpRight,
  Trash2,
  Edit,
  FileText,
  Clock,
  CalendarDays,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmployeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Live Smart Button stats
  const [contractCount, setContractCount] = useState<number>(0);
  const [attendanceCount, setAttendanceCount] = useState<number>(0);
  const [leaveReqCount, setLeaveReqCount] = useState<number>(0);
  const [allocationDays, setAllocationDays] = useState<number>(0);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to archive this employee?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/v1/employees/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/employees");
      } else {
        throw new Error("Failed to delete");
      }
    } catch (e) {
      alert("Error archiving employee.");
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      fetch(`/api/v1/employees/${id}`).then((r) => r.json()),
      fetch(`/api/v1/contracts?employeeId=${id}`).then((r) => r.json()).catch(() => []),
      fetch(`/api/v1/attendance?employeeId=${id}`).then((r) => r.json()).catch(() => ({ success: false })),
      fetch(`/api/v1/time-off-requests?employeeId=${id}`).then((r) => r.json()).catch(() => ({ success: false })),
      fetch(`/api/v1/allocations?employeeId=${id}`).then((r) => r.json()).catch(() => ({ success: false })),
    ]).then(([empData, contractsData, attData, leaveData, allocData]) => {
      if (empData.error || !empData.fullName) {
        setEmployee(null);
      } else {
        setEmployee(empData);
      }

      // Contracts
      if (Array.isArray(contractsData)) {
        setContractCount(contractsData.length);
      } else if (contractsData.success && Array.isArray(contractsData.data)) {
        setContractCount(contractsData.data.length);
      }

      // Attendance
      if (attData.success && Array.isArray(attData.data)) {
        setAttendanceCount(attData.data.length);
      }

      // Leave Requests
      if (leaveData.success && Array.isArray(leaveData.data)) {
        setLeaveReqCount(leaveData.data.length);
      }

      // Allocations
      if (allocData.success && Array.isArray(allocData.data)) {
        const totalRemaining = allocData.data.reduce(
          (acc: number, item: any) => acc + Number(item.remainingAmount || 0),
          0
        );
        setAllocationDays(totalRemaining);
      }

      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading Employee Profile...</span>
        </div>
      </div>
    );
  }

  if (!employee || !employee.fullName) {
    return <div className="text-rose-400 py-10">Employee not found or access denied.</div>;
  }

  const smartButtons = [
    {
      label: "Contracts",
      value: `${contractCount} Record${contractCount === 1 ? "" : "s"}`,
      sub: "Historical & Active",
      href: `/contracts?employeeId=${id}`,
      color: "text-blue-400",
      bg: "bg-blue-500/10 hover:bg-blue-500/20",
      border: "border-blue-500/20",
      icon: FileText,
    },
    {
      label: "Attendance",
      value: `${attendanceCount} Entries`,
      sub: "Check-in logs",
      href: `/attendance?employeeId=${id}`,
      color: "text-purple-400",
      bg: "bg-purple-500/10 hover:bg-purple-500/20",
      border: "border-purple-500/20",
      icon: Clock,
    },
    {
      label: "Time Off",
      value: `${leaveReqCount} Request${leaveReqCount === 1 ? "" : "s"}`,
      sub: "Leave tracking",
      href: `/time-off?employeeId=${id}`,
      color: "text-amber-400",
      bg: "bg-amber-500/10 hover:bg-amber-500/20",
      border: "border-amber-500/20",
      icon: CalendarDays,
    },
    {
      label: "Allocations",
      value: `${allocationDays} Days`,
      sub: "Remaining balance",
      href: `/time-off?tab=allocations&employeeId=${id}`,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
      border: "border-emerald-500/20",
      icon: Coins,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
        <Link href="/employees" className="hover:text-white transition-colors flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          Back to Workforce
        </Link>
      </div>

      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/10 via-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-purple-500/20 shrink-0">
            {employee.fullName.charAt(0)}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">{employee.fullName}</h1>
                <p className="text-zinc-400 mt-1 flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  {employee.jobPosition || "Staff"} at {employee.department?.name || "General"}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    employee.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                  }`}
                >
                  {employee.status}
                </span>
                {employee.status !== "Archived" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/employees/${id}/edit`)}
                      className="border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-xl"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1.5" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 rounded-xl"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      {isDeleting ? "Archiving..." : "Archive"}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6 pt-6 border-t border-zinc-800/60">
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <Mail className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-400">Email:</span>
                <span className="font-mono text-zinc-200">{employee.workEmail || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <Building2 className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-400">Company:</span>
                <span className="text-zinc-200">{employee.company || "PeoplePay360 Inc."}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <MapPin className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-400">Location:</span>
                <span className="text-zinc-200">{employee.workLocation || "Remote"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <Calendar className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-400">Schedule:</span>
                <span className="text-zinc-200">{employee.workingSchedule?.name || "Standard 40hr"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Buttons (BR-EMP-001 & 17_DEMO_FLOW.md Scenario 1) */}
        <div className="mt-8 pt-8 border-t border-zinc-800/80">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Connected Operational Hub (Click to Drill Down)
            </h2>
            <span className="text-[11px] text-zinc-400 font-mono">Live Subsystem Links</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {smartButtons.map((btn) => {
              const Icon = btn.icon;
              return (
                <Link
                  key={btn.label}
                  href={btn.href}
                  className={`p-4 rounded-2xl border ${btn.border} ${btn.bg} cursor-pointer transition-all hover:scale-[1.02] group shadow-sm flex flex-col justify-between`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${btn.color}`} />
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 group-hover:text-white transition-colors">
                        {btn.label}
                      </span>
                    </div>
                    <ArrowUpRight className={`w-4 h-4 ${btn.color} opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all`} />
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${btn.color}`}>{btn.value}</div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{btn.sub}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
