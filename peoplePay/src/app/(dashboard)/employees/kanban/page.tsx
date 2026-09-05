"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  LayoutList,
  Search,
  Users,
  Building,
  Mail,
  Shield,
  ArrowRight,
  Loader2,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KanbanPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [departmentsList, setDepartmentsList] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [empRes, deptRes] = await Promise.all([
          fetch("/api/v1/employees").then((r) => r.json()).catch(() => []),
          fetch("/api/v1/departments").then((r) => r.json()).catch(() => []),
        ]);

        if (Array.isArray(empRes)) setEmployees(empRes);
        if (Array.isArray(deptRes)) setDepartmentsList(deptRes);
      } catch (e) {
        console.error("Failed to load kanban data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      emp.jobPosition?.toLowerCase().includes(search.toLowerCase()) ||
      emp.workEmail?.toLowerCase().includes(search.toLowerCase()) ||
      emp.department?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Group by department
  const grouped: Record<string, any[]> = {};
  
  // Initialize with all known departments
  departmentsList.forEach((d) => {
    grouped[d.name] = [];
  });
  if (!grouped["Unassigned"]) grouped["Unassigned"] = [];

  // Distribute employees
  filteredEmployees.forEach((emp) => {
    const dept = emp.department?.name || "Unassigned";
    if (!grouped[dept]) grouped[dept] = [];
    grouped[dept].push(emp);
  });

  const columnNames = Object.keys(grouped).filter(
    (k) => grouped[k].length > 0 || k !== "Unassigned"
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Users className="w-6 h-6" />
            </div>
            Employee Department Kanban
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Live visual overview of all team members organized by department pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/employees"
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-sm font-medium border border-zinc-800 transition-colors flex items-center gap-2"
          >
            <LayoutList className="w-4 h-4 text-zinc-400" />
            List View
          </Link>
          <Link
            href="/employees/new"
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center shadow-lg shadow-purple-500/20 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 backdrop-blur-md">
        <div className="relative min-w-[280px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by name, position, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-purple-500 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>
        <div className="text-xs text-zinc-400 font-mono">
          Total Employees: <span className="text-white font-bold">{filteredEmployees.length}</span>
        </div>
      </div>

      {/* Kanban Board Columns */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <p className="text-sm text-zinc-400">Loading department pipelines...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          {columnNames.map((deptName) => {
            const empList = grouped[deptName] || [];
            return (
              <div
                key={deptName}
                className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-5 flex flex-col backdrop-blur-xl shadow-xl space-y-4"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-400" />
                    <h3 className="font-bold text-sm text-white">{deptName}</h3>
                  </div>
                  <span className="bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs py-0.5 px-2.5 rounded-full font-mono font-semibold">
                    {empList.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 overflow-y-auto max-h-[65vh] pr-1">
                  {empList.map((emp: any) => {
                    const roleName = emp.user?.role?.name || "Employee";
                    const isStaffActive = emp.status === "Active";

                    return (
                      <Link
                        key={emp.id}
                        href={`/employees/${emp.id}`}
                        className="block bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800/90 hover:border-purple-500/40 p-4 rounded-2xl transition-all cursor-pointer group shadow-sm hover:shadow-lg hover:shadow-purple-500/5 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-purple-500/20">
                              {emp.fullName?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="font-semibold text-xs text-white group-hover:text-purple-300 transition-colors">
                                {emp.fullName}
                              </p>
                              <p className="text-[11px] text-zinc-400 font-mono">
                                {emp.jobPosition}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`w-2 h-2 rounded-full mt-1 ${
                              isStaffActive ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-zinc-600"
                            }`}
                          />
                        </div>

                        <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1 text-zinc-400 font-mono truncate max-w-[170px]">
                            <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
                            <span className="truncate">{emp.workEmail}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300">
                            {roleName}
                          </span>
                        </div>
                      </Link>
                    );
                  })}

                  {empList.length === 0 && (
                    <div className="text-center py-8 text-xs text-zinc-400 border border-dashed border-zinc-800/80 rounded-2xl">
                      No members assigned to this department.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
