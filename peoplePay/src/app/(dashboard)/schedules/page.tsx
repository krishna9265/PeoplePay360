"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreHorizontal,
  Clock,
  CalendarClock,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SchedulesListPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSchedules = () => {
    setLoading(true);
    fetch("/api/v1/schedules")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSchedules(data);
        } else {
          setSchedules([]);
        }
      })
      .catch(() => setSchedules([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the schedule "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/v1/schedules/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete schedule");
      }

      setSuccess(`Schedule "${name}" was successfully deleted.`);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      setActiveMenuId(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete schedule.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSchedules = schedules.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.type?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || s.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CalendarClock className="w-6 h-6" />
            </div>
            Working Schedules
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Define standard working hours, shift timings, and break rules for employees (BR-SCH-001).
          </p>
        </div>
        <Link
          href="/schedules/new"
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center shadow-lg shadow-emerald-500/20 gap-2"
        >
          <Plus className="w-4 h-4" />
          New Schedule
        </Link>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-200">
            <X className="w-3.5 h-3.5" />
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
              placeholder="Search schedules by name or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-emerald-500 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-zinc-950/70 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Schedule Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Shift">Shift</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          Showing {filteredSchedules.length} schedule{filteredSchedules.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="text-xs uppercase bg-zinc-800/40 text-zinc-400 font-mono">
              <tr>
                <th className="px-6 py-4 font-semibold rounded-tl-xl">Schedule Profile</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Weekly Hours</th>
                <th className="px-6 py-4 font-semibold">Active Days</th>
                <th className="px-6 py-4 font-semibold rounded-tr-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      Loading working schedules...
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((s) => {
                  const isMenuOpen = activeMenuId === s.id;

                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-zinc-800/30 transition-colors group relative"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/schedules/${s.id}`}
                          className="font-semibold text-white flex items-center gap-3 hover:text-emerald-400 transition-colors"
                        >
                          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <p>{s.name}</p>
                            <p className="text-xs text-zinc-500 font-mono font-normal">
                              {s.days?.length || 0} scheduled shifts / week
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {s.type || "Full-Time"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                        {s.weeklyHours} hrs / wk
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1.5">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => {
                            const isWorkingDay = s.days?.some(
                              (sd: any) => sd.dayOfWeek === d
                            );
                            return (
                              <span
                                key={d}
                                title={`${d}: ${isWorkingDay ? "Working" : "Off"}`}
                                className={`text-[10px] font-mono font-bold w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                                  isWorkingDay
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                    : "bg-zinc-800/40 text-zinc-600"
                                }`}
                              >
                                {d.slice(0, 2)}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/schedules/${s.id}`}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                            title="View Shift Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveMenuId(isMenuOpen ? null : s.id)
                              }
                              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-700"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                              <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-30 space-y-1 text-left animate-in fade-in zoom-in-95">
                                <Link
                                  href={`/schedules/${s.id}`}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-200 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                                  View Shift Hours
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(s.id, s.name)}
                                  disabled={deletingId === s.id}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  {deletingId === s.id ? "Deleting..." : "Delete Schedule"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              {filteredSchedules.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-500">
                    No working schedules found matching your search.
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
