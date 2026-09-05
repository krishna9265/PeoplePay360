"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarClock, Clock, Users, CheckCircle2 } from "lucide-react";

export default function ScheduleDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/v1/schedules/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setSchedule(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-zinc-500 py-12 text-center">Loading schedule pattern...</div>;
  }

  if (!schedule || !schedule.name) {
    return <div className="text-rose-400 py-12 text-center">Schedule not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-3 text-sm text-zinc-400">
        <Link href="/schedules" className="hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Working Schedules
        </Link>
      </div>

      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{schedule.name}</h1>
                <p className="text-xs text-zinc-400 mt-0.5 font-mono">Type: {schedule.type || "Full-Time"}</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono uppercase text-zinc-400">Weekly Total (BR-SCH-001)</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
              {schedule.weeklyHours} Hours / Week
            </div>
          </div>
        </div>

        {/* Days Pattern */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Day-by-Day Shift Pattern
          </h2>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-800/50 uppercase text-zinc-400 font-mono">
                <tr>
                  <th className="px-5 py-3">Day of Week</th>
                  <th className="px-5 py-3">Shift Hours</th>
                  <th className="px-5 py-3">Break Duration</th>
                  <th className="px-5 py-3">Net Computed Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {schedule.days?.map((d: any) => (
                  <tr key={d.id} className="hover:bg-zinc-800/20">
                    <td className="px-5 py-3 font-semibold text-white">{d.dayOfWeek}</td>
                    <td className="px-5 py-3 font-mono text-zinc-400">
                      {new Date(d.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                      {new Date(d.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-5 py-3 text-zinc-400">{d.breakMinutes} mins</td>
                    <td className="px-5 py-3 font-mono font-bold text-emerald-400">
                      {d.computedHours} hrs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Linked Employees */}
        {schedule.employees && schedule.employees.length > 0 && (
          <div className="pt-4 border-t border-zinc-800/60">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-500" />
              Assigned Employees ({schedule.employees.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {schedule.employees.map((emp: any) => (
                <Link
                  key={emp.id}
                  href={`/employees/${emp.id}`}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 text-xs text-zinc-200 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  {emp.fullName} ({emp.jobPosition || "Staff"})
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
