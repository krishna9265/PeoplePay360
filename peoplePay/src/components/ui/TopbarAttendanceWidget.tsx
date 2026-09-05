"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Clock, LogIn, LogOut, CheckCircle2, AlertCircle } from "lucide-react";

export function TopbarAttendanceWidget() {
  const { data: session } = useSession();
  const [activeSession, setActiveSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const employeeId = (session?.user as any)?.employeeId;

  const checkStatus = async () => {
    if (!employeeId) return;
    try {
      const res = await fetch(`/api/v1/attendance?employeeId=${employeeId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // Find if there is an active check-in today without check-out
        const open = data.data.find((r: any) => !r.checkOut);
        setActiveSession(open || null);
      }
    } catch {
      // quiet fallback
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [employeeId]);

  const handleToggle = async () => {
    if (!employeeId) {
      setMessage("No linked employee");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (!activeSession) {
        // Check in
        const res = await fetch("/api/v1/attendance/check-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employeeId }),
        });
        const data = await res.json();
        if (data.success) {
          setActiveSession(data.data);
          setMessage("Checked In!");
        } else {
          setMessage(data.error || "Failed");
        }
      } else {
        // Check out
        const res = await fetch(`/api/v1/attendance/${activeSession.id}/check-out`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.success) {
          setActiveSession(null);
          setMessage("Checked Out!");
        } else {
          setMessage(data.error || "Failed");
        }
      }
    } catch (e: any) {
      setMessage(e.message || "Error");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3500);
      checkStatus();
    }
  };

  return (
    <div className="flex items-center gap-3 bg-zinc-900/70 border border-zinc-800 px-3.5 py-1.5 rounded-full text-xs font-medium">
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            activeSession
              ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              : "bg-zinc-500"
          }`}
        />
        <span className="text-zinc-300 hidden sm:inline">
          {activeSession
            ? `In: ${new Date(activeSession.checkIn).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "Not Checked In"}
        </span>
      </div>

      <button
        onClick={handleToggle}
        disabled={loading}
        className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
          activeSession
            ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30"
            : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30"
        }`}
      >
        {activeSession ? (
          <>
            <LogOut className="w-3 h-3" />
            Check Out
          </>
        ) : (
          <>
            <LogIn className="w-3 h-3" />
            Check In
          </>
        )}
      </button>

      {message && (
        <span className="text-[11px] text-blue-400 font-mono animate-in fade-in">
          {message}
        </span>
      )}
    </div>
  );
}
