"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserPlus,
  Loader2,
  Building,
  CalendarClock,
  Mail,
  User,
  Shield,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DepartmentItem {
  id: string;
  name: string;
}

interface ScheduleItem {
  id: string;
  name: string;
}

interface RoleItem {
  id: string;
  name: string;
}

export default function NewEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    jobPosition: "",
    departmentId: "",
    workingScheduleId: "",
    roleId: "",
    password: "",
  });

  useEffect(() => {
    let isMounted = true;
    async function loadOptions() {
      try {
        const [deptRes, schedRes, roleRes] = await Promise.all([
          fetch("/api/v1/departments").then((r) => r.json()).catch(() => []),
          fetch("/api/v1/schedules").then((r) => r.json()).catch(() => []),
          fetch("/api/v1/roles").then((r) => r.json()).catch(() => []),
        ]);

        const depts: DepartmentItem[] = Array.isArray(deptRes) ? deptRes : [];
        const scheds: ScheduleItem[] = Array.isArray(schedRes) ? schedRes : [];
        const rls: RoleItem[] = Array.isArray(roleRes) ? roleRes : [];

        if (isMounted) {
          setDepartments(depts);
          setSchedules(scheds);
          setRoles(rls);

          // Find default employee role
          const empRole = rls.find((r) => r.name === "Employee") || rls[0];

          setFormData((prev) => ({
            ...prev,
            departmentId: depts[0]?.id || "",
            workingScheduleId: scheds[0]?.id || "",
            roleId: empRole?.id || "",
            password: "2305", // Default recommended password
          }));
          setDataLoading(false);
        }
      } catch (err) {
        console.error("Failed to load options", err);
        if (isMounted) {
          setDataLoading(false);
        }
      }
    }
    loadOptions();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.fullName.trim()) {
      setError("Please enter the employee's full name.");
      setLoading(false);
      return;
    }

    if (!formData.workEmail.trim() || !formData.workEmail.includes("@")) {
      setError("Please enter a valid work email address.");
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError("Please assign a login password for this user account.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          workEmail: formData.workEmail.trim().toLowerCase(),
          jobPosition: formData.jobPosition.trim() || "Staff Member",
          departmentId: formData.departmentId || null,
          workingScheduleId: formData.workingScheduleId || null,
          roleId: formData.roleId || null,
          password: formData.password.trim(),
          status: "Active",
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to create employee");
      }

      router.push("/employees");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error creating employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <p className="text-sm text-zinc-400">Loading employee configuration options...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
        <Link href="/employees" className="hover:text-white transition-colors flex items-center gap-1.5 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Employees
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <UserPlus className="w-6 h-6" />
          </div>
          Add New Employee & User Account
        </h1>
        <p className="text-zinc-400 mt-1">
          Create employee profile, assign system role, and configure login credentials.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-4 rounded-2xl text-sm flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-200">Validation Notice</p>
            <p className="text-xs text-rose-300/90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  placeholder="e.g. Veer Sharma"
                />
              </div>
            </div>

            {/* Email & Job Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Work Email (Login Username) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-zinc-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                    placeholder="veer@peoplepay360.demo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Job Position / Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.jobPosition}
                  onChange={(e) => setFormData({ ...formData, jobPosition: e.target.value })}
                  className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 px-4 text-sm text-white placeholder-zinc-500 outline-none transition-all"
                  placeholder="e.g. Full Stack Developer"
                />
              </div>
            </div>

            {/* Role & Login Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-2 bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  System Role (Permissions) <span className="text-rose-400">*</span>
                </label>
                <select
                  required
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2.5 px-3 text-sm text-white outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Select a role...</option>
                  {Array.isArray(roles) &&
                    roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                </select>
                <p className="text-[11px] text-zinc-400 mt-1">Controls sidebar navigation and action permissions</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Login Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-2.5 pl-3 pr-10 text-sm text-white placeholder-zinc-500 outline-none transition-all font-mono"
                    placeholder="Enter password..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">Used by employee to sign in to PeoplePay360</p>
              </div>
            </div>

            {/* Department & Working Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-400" />
                  Department
                </label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 px-4 text-sm text-white outline-none transition-all cursor-pointer"
                >
                  <option value="">No Department</option>
                  {Array.isArray(departments) &&
                    departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                  <CalendarClock className="w-3.5 h-3.5 text-emerald-400" />
                  Default Schedule
                </label>
                <select
                  value={formData.workingScheduleId}
                  onChange={(e) => setFormData({ ...formData, workingScheduleId: e.target.value })}
                  className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 px-4 text-sm text-white outline-none transition-all cursor-pointer"
                >
                  <option value="">No Default Schedule</option>
                  {Array.isArray(schedules) &&
                    schedules.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-zinc-800/80 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/employees")}
              className="bg-zinc-800 hover:bg-zinc-700 text-white border-0 rounded-xl px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 rounded-xl px-6 py-2.5 font-semibold text-sm shadow-lg shadow-purple-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                "Save & Create Account"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
