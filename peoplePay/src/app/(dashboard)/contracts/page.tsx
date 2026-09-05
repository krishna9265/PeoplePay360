"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Search, Filter, AlertCircle, ArrowLeft, CheckCircle, Clock } from "lucide-react";

function ContractsContent() {
  const searchParams = useSearchParams();
  const initialEmployeeId = searchParams.get("employeeId") || "";

  const [contracts, setContracts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(initialEmployeeId);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch employees list for dropdown
  useEffect(() => {
    fetch("/api/v1/employees")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEmployees(data);
      })
      .catch(() => {});
  }, []);

  // Fetch contracts
  useEffect(() => {
    setLoading(true);
    let url = "/api/v1/contracts";
    if (selectedEmployeeId) {
      url += `?employeeId=${encodeURIComponent(selectedEmployeeId)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setContracts(data);
        } else if (data.success && Array.isArray(data.data)) {
          setContracts(data.data);
        } else {
          setContracts([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedEmployeeId]);

  const filteredContracts = contracts.filter((c) => {
    if (!search) return true;
    const query = search.toLowerCase();
    const name = c.employee?.fullName?.toLowerCase() || "";
    const pos = c.jobPosition?.toLowerCase() || "";
    const dept = c.department?.name?.toLowerCase() || "";
    return name.includes(query) || pos.includes(query) || dept.includes(query);
  });

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            {selectedEmployeeId && (
              <button
                onClick={() => setSelectedEmployeeId("")}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mr-2 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Clear Filter
              </button>
            )}
            <h1 className="text-3xl font-bold tracking-tight text-white">Employment Contracts</h1>
          </div>
          <p className="text-zinc-400 mt-1 text-sm">
            {selectedEmployee
              ? `Viewing contract history for ${selectedEmployee.fullName} (BR-CON-001 period-based resolution).`
              : "Manage active, expired, and historical employee contracts across all departments."}
          </p>
        </div>
        <Link
          href="/contracts/new"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Contract
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by employee, title, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="bg-zinc-950/70 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          Showing {filteredContracts.length} contract{filteredContracts.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-xs uppercase bg-zinc-800/40 text-zinc-400 font-mono">
              <tr>
                <th className="px-6 py-4 font-semibold rounded-tl-xl">Employee</th>
                <th className="px-6 py-4 font-semibold">Effective Window</th>
                <th className="px-6 py-4 font-semibold">Base Wage</th>
                <th className="px-6 py-4 font-semibold">Schedule</th>
                <th className="px-6 py-4 font-semibold">Structure</th>
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
                      Loading contracts...
                    </div>
                  </td>
                </tr>
              ) : filteredContracts.map((c) => {
                const isActive = c.status === "Active";
                const isExpired = c.status === "Expired";

                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-zinc-800/30 transition-colors ${
                      isActive ? "bg-purple-950/10" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white flex items-center gap-2">
                        {c.employee?.fullName || "Unknown"}
                      </div>
                      <span className="text-xs text-zinc-400 font-mono">
                        {c.employee?.jobPosition || "Staff"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">
                      <div className="text-zinc-200">
                        {new Date(c.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-zinc-500">
                        to {c.endDate ? new Date(c.endDate).toLocaleDateString() : "Open-ended (Active)"}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                      ₹{Number(c.wage).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-300">
                      {c.workingSchedule?.name || "Standard 40hr"}
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-300">
                      {c.salaryStructure?.name || "Regular Salary"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                          isActive
                            ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                            : isExpired
                            ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />}
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/contracts/${c.id}`}
                        className="text-xs font-medium text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredContracts.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    No contracts found for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ContractsListPage() {
  return (
    <Suspense fallback={<div className="text-zinc-500 py-10">Loading Contracts...</div>}>
      <ContractsContent />
    </Suspense>
  );
}
