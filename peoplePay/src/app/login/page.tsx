"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2, Users, ShieldCheck, UserCheck, Briefcase, Sparkles, KeyRound } from "lucide-react";
import Link from "next/link";

const DEMO_ACCOUNTS = [
  { role: "HR Payroll Manager", email: "admin@peoplepay360.com", name: "Ananya Sinha", badge: "Full Access", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300" },
  { role: "HR Operations Officer", email: "hr@peoplepay360.com", name: "Riya Kapoor", badge: "Core HR", color: "from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300" },
  { role: "HR Payroll User", email: "payroll.user@peoplepay360.com", name: "Karan Mehta", badge: "Payroll Specialist", color: "from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300" },
  { role: "Employee Self-Service", email: "employee@peoplepay360.com", name: "Devansh Rao", badge: "Self-Service", color: "from-cyan-500/20 to-teal-500/20 border-cyan-500/40 text-cyan-300" },
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
        // Retry with alternative standard seed password if needed
        if (loginPassword === "Admin@123") {
          const retryRes = await signIn("credentials", {
            redirect: false,
            email: loginEmail,
            password: "2305",
          });
          if (!retryRes?.error) {
            router.push("/dashboard");
            router.refresh();
            return;
          }
        }
        setError("Invalid work email or password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fillAndLogin = (targetEmail: string) => {
    setEmail(targetEmail);
    setPassword("Admin@123");
    handleLogin(undefined, targetEmail, "Admin@123");
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center relative overflow-hidden font-sans p-4">
      {/* Background Ambient Lighting */}
      <div className="absolute top-[-15%] left-[20%] w-[600px] h-[600px] bg-emerald-500/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[20%] w-[600px] h-[600px] bg-indigo-600/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="group flex flex-col items-center">
            {/* 3D Skeuomorphic Logo Capsule */}
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-b from-emerald-400 via-teal-600 to-slate-900 p-[1.5px] shadow-[0_8px_24px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] group-hover:scale-105 transition-all mb-4">
              <div className="h-full w-full bg-[#0b0e14] rounded-[14px] flex items-center justify-center">
                <Users className="text-emerald-400 w-8 h-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
              </div>
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white">
              PeoplePay<span className="text-emerald-400">360</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-medium">Enterprise HRMS & Automated Payroll Platform</p>
          </Link>
        </div>

        {/* Skeuomorphic Glass Card Container */}
        <div className="bg-[#0c0f17]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] space-y-5">
          <div>
            <h2 className="font-heading text-lg font-bold text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Sign In to Workspace
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Select a pre-configured demo account or enter credentials</p>
          </div>

          <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3.5 rounded-2xl text-xs flex items-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] animate-in fade-in">
                <span>{error}</span>
              </div>
            )}

            {/* Email Field with Neumorphic Inset Well */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 ml-1">Work Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-white/[0.08] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)] transition-all font-mono"
                  placeholder="admin@peoplepay360.com"
                />
              </div>
            </div>

            {/* Password Field with Neumorphic Inset Well */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 ml-1">Account Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-500 group-focus-within:text-teal-400 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-white/[0.08] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)] transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* 3D Tactile Skeuomorphic Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-700 hover:brightness-110 active:translate-y-0.5 text-zinc-950 border border-emerald-300/40 rounded-xl py-3.5 font-heading font-bold text-xs uppercase tracking-wider shadow-[0_6px_20px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(0,0,0,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                  Authenticating...
                </>
              ) : (
                <>
                  Enter Workspace
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher with Skeuomorphic Capsules */}
          <div className="border-t border-white/[0.08] pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-heading">
                Instant Evaluator Access
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                Pass: Admin@123
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillAndLogin(acc.email)}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-white/[0.08] hover:border-emerald-500/40 shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-heading font-bold text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {acc.role}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono">{acc.email}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] ${acc.color}`}>
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
