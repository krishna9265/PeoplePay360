"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, Users, ShieldCheck, UserCheck, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEMO_ACCOUNTS = [
  { role: "HR Payroll Manager", email: "payroll.manager@peoplepay360.demo", name: "Ananya Sinha", badge: "Demo Primary" },
  { role: "HR Manager", email: "hr.manager@peoplepay360.demo", name: "Riya Kapoor", badge: "Core HR" },
  { role: "HR Payroll User", email: "payroll.user@peoplepay360.demo", name: "Karan Mehta", badge: "Payroll Specialist" },
  { role: "Employee", email: "employee@peoplepay360.demo", name: "Devansh Rao", badge: "Self-Service" },
  { role: "Admin", email: "admin@peoplepay360.demo", name: "System Admin", badge: "Full Access" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    const loginEmail = customEmail || email;
    const loginPassword = customPassword || password;

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
      });

      if (res?.error) {
        setError("Invalid work email or password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fillAndLogin = (targetEmail: string) => {
    setEmail(targetEmail);
    setPassword("2305");
    handleLogin(undefined, targetEmail, "2305");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center relative overflow-hidden font-sans p-4">
      {/* Background ambient gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Logo & Header */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/25 mb-4">
            <Users className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">PeoplePay360</h1>
          <p className="text-sm text-zinc-400 mt-1">HR & Payroll Operations Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-7 shadow-2xl space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Sign In to Workspace</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Select a demo role or enter your credentials</p>
          </div>

          <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs flex items-center animate-in fade-in">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none transition-all"
                  placeholder="name@peoplepay360.demo"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 rounded-xl py-5 font-semibold text-sm shadow-lg shadow-purple-500/25 transition-all group"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Enter Workspace
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="border-t border-zinc-800/80 pt-4 space-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              One-Click Demo Roles (Password: 2305)
            </p>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillAndLogin(acc.email)}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/80 border border-zinc-800/60 hover:border-zinc-700 transition-all text-left group"
                >
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 group-hover:text-white block">
                      {acc.name} ({acc.role})
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">{acc.email}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20">
                    {acc.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
