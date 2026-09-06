"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Users,
  ShieldCheck,
  CreditCard,
  Clock,
  CalendarDays,
  Layers,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Zap,
  Lock,
  FileText,
  ChevronRight,
  BarChart3,
  Building2,
  Landmark,
  Award,
  Laptop,
  Check,
  Play,
  Download,
  Mail,
  Smartphone,
  ChevronDown,
  Cpu,
  Fingerprint,
  Briefcase,
  Activity,
  CheckCircle,
  Database,
  Calculator,
  RefreshCw,
  Coins
} from "lucide-react";

export default function LandingPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"payroll" | "attendance" | "rules" | "analytics">("payroll");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden font-sans">
      {/* Precision Ambient Glows & Dynamic Grid Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[650px] h-[650px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-[30%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[750px] h-[750px] bg-blue-600/10 rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Skeuomorphic Glass Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090e]/85 border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            {/* Skeuomorphic 3D Icon Badge */}
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-b from-emerald-400 via-teal-600 to-slate-900 p-[1px] shadow-[0_4px_16px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] group-hover:scale-105 transition-all">
              <div className="h-full w-full bg-[#0b0e14] rounded-[15px] flex items-center justify-center">
                <Users className="text-emerald-400 w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                  PeoplePay<span className="text-emerald-400 font-extrabold">360</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                  Enterprise
                </span>
              </div>
              <span className="block text-[11px] text-zinc-400 font-medium">Automated Payroll & HR Cloud</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-300 tracking-wide">
            <a href="#pipeline" className="hover:text-emerald-400 transition-colors">Pipeline</a>
            <a href="#solutions" className="hover:text-emerald-400 transition-colors">HR Solutions</a>
            <a href="#interactive" className="hover:text-emerald-400 transition-colors">Architecture</a>
            <a href="#roles" className="hover:text-emerald-400 transition-colors">5 Demo Roles</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {session ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-700 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_16px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(0,0,0,0.2)] hover:brightness-110 active:translate-y-0.5 flex items-center gap-2 transition-all cursor-pointer"
              >
                Enter Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white rounded-xl hover:bg-white/[0.05] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-700 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_16px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(0,0,0,0.2)] hover:brightness-110 active:translate-y-0.5 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  Live Demo Access
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Moving Animated Illustrations */}
      <section className="relative z-10 pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto relative">
          {/* Neumorphic Extruded Capsule */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-emerald-300 text-xs font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-heading tracking-wide">Next-Gen Automated Payroll Engine 2026</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-400 font-normal">Odoo-Inspired Python Rules</span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            The Smarter Way to Manage <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(16,185,129,0.25)]">
              All Your HR & Payroll Needs
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate payroll errors and manual computations. PeoplePay360 orchestrates salary rule sequence pipelines, biometric attendance synchronization, dynamic leave balances, and batch PDF dispatch.
          </p>

          {/* Dual Skeuomorphic CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="px-8 py-4 bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-700 text-zinc-950 font-heading font-bold text-sm uppercase tracking-wider rounded-2xl shadow-[0_6px_24px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-3px_0_rgba(0,0,0,0.3)] hover:brightness-110 active:translate-y-0.5 flex items-center gap-3 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              Launch Live Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#interactive"
              className="px-8 py-4 bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/10 text-zinc-200 font-semibold text-sm rounded-2xl flex items-center gap-3 shadow-[0_6px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-white/20 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              Watch Architecture Pipeline
            </a>
          </div>

          {/* Trust Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Deterministic Rule Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Biometric Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero-Error Batch Payruns</span>
            </div>
          </div>
        </div>

        {/* Central Moving 3D Interactive Ecosystem Container */}
        <div className="mt-16 relative mx-auto max-w-6xl">
          {/* Animated Rotating Orbital Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-emerald-500/10 animate-spin-slow pointer-events-none hidden lg:block" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-indigo-500/10 animate-spin-reverse pointer-events-none hidden lg:block" />

          {/* 4 Floating Animated Micro-Cards around Hero */}
          
          {/* Floating Card 1: Top-Left (Rule Engine Pipeline) */}
          <div className="absolute -top-10 -left-6 z-20 hidden lg:flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/95 border border-emerald-500/40 shadow-[0_16px_32px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2)] animate-float-slow backdrop-blur-xl">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calculator className="w-4 h-4 animate-pulse" />
            </div>
            <div className="text-left font-mono">
              <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>RULE SEQUENCER</span>
              </div>
              <p className="text-xs font-bold text-white">BASIC (50%) + HRA (40%)</p>
              <p className="text-[10px] text-emerald-400">GROSS: ₹1,45,000</p>
            </div>
          </div>

          {/* Floating Card 2: Top-Right (Auto Compliance Deductions) */}
          <div className="absolute -top-8 -right-6 z-20 hidden lg:flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/95 border border-purple-500/40 shadow-[0_16px_32px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2)] animate-float-reverse backdrop-blur-xl">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-zinc-400 font-mono">STATUTORY COMPLIANCE</div>
              <p className="text-xs font-bold text-white">EPF (12%) + TDS (5%)</p>
              <p className="text-[10px] text-purple-400 font-mono">100% Tax Compliant</p>
            </div>
          </div>

          {/* Floating Card 3: Bottom-Left (Live Biometric Scanner with Laser) */}
          <div className="absolute -bottom-8 -left-8 z-20 hidden lg:flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/95 border border-blue-500/40 shadow-[0_16px_32px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2)] animate-float-fast backdrop-blur-xl">
            <div className="relative w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center overflow-hidden">
              <Fingerprint className="w-5 h-5 text-blue-400" />
              {/* Moving Laser Scanner Line */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline" />
            </div>
            <div className="text-left font-mono">
              <div className="text-[10px] text-blue-400 font-bold">BIOMETRIC PUNCH</div>
              <p className="text-xs font-bold text-white">09:00:12 AM (Active)</p>
              <p className="text-[10px] text-zinc-400">Overtime: +1.5h Logged</p>
            </div>
          </div>

          {/* Floating Card 4: Bottom-Right (Live Salary Disbursement) */}
          <div className="absolute -bottom-8 -right-8 z-20 hidden lg:flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-900/95 border border-teal-500/40 shadow-[0_16px_32px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2)] animate-float-slow backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Coins className="w-5 h-5 animate-bounce" />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-zinc-400 font-mono">DIRECT DISBURSEMENT</div>
              <p className="text-xs font-bold text-white">₹42.85L Batch Paid</p>
              <p className="text-[10px] text-emerald-400 font-mono">112 Payslips Emailed</p>
            </div>
          </div>

          {/* Main Hero Visual Card */}
          <div className="relative rounded-[2rem] bg-[#0c0f17]/95 border border-white/10 p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-2xl">
            {/* Topbar Bevel */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08] text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" />
                <span className="ml-3 font-mono text-[11px] text-zinc-500">peoplepay360.internal/payroll/payruns/active</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                REAL-TIME RUNTIME
              </div>
            </div>

            {/* 3 Tactile Neumorphic Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 border border-white/[0.08] rounded-2xl p-5 shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-emerald-500/30 transition-all group">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
                  <span>Batch Payroll Total</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">₹42,85,900</div>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-400 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>100% Verified in 1.8s</span>
                </div>
              </div>

              <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 border border-white/[0.08] rounded-2xl p-5 shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-blue-500/30 transition-all group">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
                  <span>Biometric Attendance</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">98.4% Present</div>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-blue-400 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Auto Unpaid LOP Deductions</span>
                </div>
              </div>

              <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 border border-white/[0.08] rounded-2xl p-5 shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-purple-500/30 transition-all group">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
                  <span>Statutory Deductions</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">EPF + ESI + TDS</div>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-purple-400 font-medium">
                  <Award className="w-3.5 h-3.5" />
                  <span>Digital PDF Payslips Ready</span>
                </div>
              </div>
            </div>

            {/* Inset Well Table */}
            <div className="mt-5 rounded-2xl bg-zinc-950/70 border border-white/[0.06] shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="px-5 py-3.5 bg-zinc-900/60 border-b border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200 font-heading">Sample Payrun Payslip Ledger</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  DISBURSEMENT READY
                </span>
              </div>
              <div className="divide-y divide-white/[0.04] text-xs">
                {[
                  { name: "Aarav Sharma", role: "Sr. Full Stack Architect", gross: "₹1,85,000", net: "₹1,56,400" },
                  { name: "Priya Nair", role: "Lead Product Designer", gross: "₹1,40,000", net: "₹1,19,800" },
                  { name: "Rahul Verma", role: "DevOps & Cloud Specialist", gross: "₹1,65,000", net: "₹1,39,200" },
                ].map((item, idx) => (
                  <div key={idx} className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-zinc-950 text-xs shadow-[0_2px_6px_rgba(16,185,129,0.3)]">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-[11px] text-zinc-400">{item.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-emerald-400">{item.net}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">Gross: {item.gross}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Moving Process Pipeline */}
      <section id="pipeline" className="py-16 bg-[#05070a]/90 border-y border-white/[0.08] relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              Automated Pipeline
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Deterministic 4-Stage Execution Flow
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Watch how raw employment contracts are transformed into verified, compliant payslips.
            </p>
          </div>

          {/* Animated 4-Stage Connector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {[
              { step: "01", title: "Contract & Wage Lock", desc: "Validates base wage, allowances & schedule hours", icon: FileText, color: "text-blue-400", bg: "from-blue-500/10 to-indigo-500/5", border: "border-blue-500/30" },
              { step: "02", title: "Biometric & LOP Sync", desc: "Aggregates punches, leaves & unworked days", icon: Fingerprint, color: "text-cyan-400", bg: "from-cyan-500/10 to-teal-500/5", border: "border-cyan-500/30" },
              { step: "03", title: "Sequence Rule Engine", desc: "BASIC → HRA → GROSS → EPF → TDS → NET", icon: Calculator, color: "text-purple-400", bg: "from-purple-500/10 to-pink-500/5", border: "border-purple-500/30" },
              { step: "04", title: "PDF & Batch Dispatch", desc: "Branded PDF creation & automated SMTP email", icon: Mail, color: "text-emerald-400", bg: "from-emerald-500/10 to-teal-500/5", border: "border-emerald-500/30" },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className={`p-5 rounded-3xl bg-gradient-to-b ${st.bg} border ${st.border} shadow-[0_8px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] relative group hover:-translate-y-1 transition-all`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-zinc-500">STAGE {st.step}</span>
                    <div className={`w-8 h-8 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center ${st.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-heading text-sm font-bold text-white mb-1.5">{st.title}</h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{st.desc}</p>
                  {/* Subtle animated moving laser beam on bottom */}
                  <div className="mt-4 h-1 w-full bg-zinc-950 rounded-full overflow-hidden relative">
                    <div className="h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-full animate-laser-beam" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6 Key HR Solutions Grid */}
      <section id="solutions" className="py-20 bg-[#07090e] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              End-to-End HR Ecosystem
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Empowering HR, Operations & Employees
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Unified platform delivering zero-error payruns, transparent compensation breakdown, and automated compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] rounded-3xl p-7 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-emerald-500/40 hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] mb-6 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                Automated Payrun Engine
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Execute company-wide payroll in seconds with automated sequence computation, allowance deductions, and instant payslip generation.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> One-click batch calculation</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Draft, Computed, Validated, Paid states</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] rounded-3xl p-7 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-teal-500/40 hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                Biometric & Topbar Clock-In
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Real-time punch in/out widget in sticky topbar with total work duration tracking, overtime calculation, and automatic LOP synchronization.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Live active timer & session state</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Automated Loss of Pay deductions</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] rounded-3xl p-7 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-blue-500/40 hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] mb-6 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                Configurable Salary Rules
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Create dynamic salary structures with Pythonic formulas, sequenced rules (BASIC, HRA, GROSS, EPF, TDS, NET) and multi-level categories.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Sequence-ordered dependency tree</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Odoo-compatible structure designer</li>
              </ul>
            </div>

            {/* Card 4 */}
            <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] rounded-3xl p-7 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-purple-500/40 hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] mb-6 group-hover:scale-110 transition-transform">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                Time-Off & Leave Allocations
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Self-service leave requests with automated balance tracking across Annual, Sick, and Casual leaves with instant manager approvals.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Multi-tier approval workflows</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Real-time allocation ledger</li>
              </ul>
            </div>

            {/* Card 5 */}
            <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] rounded-3xl p-7 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-indigo-500/40 hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                Executive PDF Payslips & Batch Email
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Generate branded corporate PDF payslips with tables, security hashes, and multi-selection batch dispatch directly to employee inboxes.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Multi-selection batch email dispatch</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Instant PDF download & print</li>
              </ul>
            </div>

            {/* Card 6 */}
            <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] rounded-3xl p-7 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-amber-500/40 hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Real-Time Cost Analytics
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Live dashboard visualizations for department salary costs, headcount trends, overtime hours, and monthly payroll budget variance.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Real-time database sum aggregation</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Historical trends & budget variance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Architecture Showcase */}
      <section id="interactive" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            Execution Pipeline
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            Under the Hood: Engine Computation
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Toggle between core modules to explore the underlying deterministic execution pipelines.
          </p>

          {/* Neumorphic Tab Container */}
          <div className="inline-flex p-1.5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] gap-1.5 pt-1.5">
            {[
              { id: "payroll", label: "Payrun Batch Engine", icon: CreditCard },
              { id: "attendance", label: "Attendance & LOP Sync", icon: Clock },
              { id: "rules", label: "Salary Rule Sequence", icon: Sliders },
              { id: "analytics", label: "Cost Visualizer", icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-b from-emerald-400 to-teal-600 text-zinc-950 font-bold shadow-[0_4px_12px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Box */}
        <div className="bg-[#0c0f17]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)]">
          {activeTab === "payroll" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">01 // Payrun Orchestration</span>
                <h3 className="font-heading text-2xl font-bold text-white">Deterministic 4-Step Batch Execution</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  When HR initiates a payrun, the engine locks the period, fetches all verified employee contracts, syncs approved leaves & biometric attendance, and executes salary rules in strict mathematical sequence.
                </p>
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-start gap-3 text-xs bg-zinc-900/60 p-3.5 rounded-2xl border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-[10px]">1</span>
                    <div>
                      <p className="font-semibold text-zinc-200">Contract & Working Schedule Lock</p>
                      <p className="text-zinc-400 text-[11px]">Validates wage rates, allowances, and scheduled work hours.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-xs bg-zinc-900/60 p-3.5 rounded-2xl border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-[10px]">2</span>
                    <div>
                      <p className="font-semibold text-zinc-200">Attendance & LOP Deduction Calculation</p>
                      <p className="text-zinc-400 text-[11px]">Computes unworked days against baseline work schedule.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-xs bg-zinc-900/60 p-3.5 rounded-2xl border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-[10px]">3</span>
                    <div>
                      <p className="font-semibold text-zinc-200">Sequence-Sorted Rule Tree Evaluation</p>
                      <p className="text-zinc-400 text-[11px]">BASIC → DA → HRA → GROSS → PF → ESI → TDS → NET.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-5 font-mono text-xs text-zinc-300 space-y-3 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
                <div className="flex items-center justify-between text-zinc-500 border-b border-white/[0.06] pb-2">
                  <span>RUNTIME LOGS // BATCH_RUN_#2026_09</span>
                  <span className="text-emerald-400 font-bold">200 OK</span>
                </div>
                <p className="text-zinc-400">[07:45:01] Fetching active contracts for 112 employees...</p>
                <p className="text-blue-400">[07:45:02] Attendance aggregated: 1,420 work sessions verified.</p>
                <p className="text-purple-400">[07:45:02] Executing Rule Sequence: Structure "Corporate Standard 2026"</p>
                <p className="text-emerald-400 font-bold">[07:45:03] 112 Payslips successfully computed without errors.</p>
                <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  ✓ Total Gross: ₹1,42,80,000 | Net Disbursable: ₹1,18,52,400
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">02 // Biometric Attendance Hub</span>
                <h3 className="font-heading text-2xl font-bold text-white">Live Attendance & Topbar Instant Punch</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Employees can check in and out with a single click from the sticky topbar widget or mobile interface. Every punch is timestamped and converted to exact worked hours for automatic payroll input.
                </p>
                <div className="flex gap-4 pt-2">
                  <div className="flex-1 bg-zinc-900/60 p-4 rounded-2xl border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <span className="text-xs text-zinc-400">Avg Check-In Time</span>
                    <p className="font-heading text-xl font-bold text-white mt-1">09:12 AM</p>
                  </div>
                  <div className="flex-1 bg-zinc-900/60 p-4 rounded-2xl border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <span className="text-xs text-zinc-400">Overtime Tracked</span>
                    <p className="font-heading text-xl font-bold text-emerald-400 mt-1">+48.5 hrs</p>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.3)] animate-pulse">
                  <Fingerprint className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="font-heading text-base font-bold text-white">Session Active (07h 42m)</p>
                  <p className="text-xs text-zinc-400">Clocked in at 09:00 AM • Remote Work (Verified)</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  Click Topbar Widget to Clock Out
                </div>
              </div>
            </div>
          )}

          {activeTab === "rules" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">03 // Salary Rule Sequencer</span>
                <h3 className="font-heading text-2xl font-bold text-white">Flexible Sequence-Based Computations</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Build custom compensation logic with flexible arithmetic and condition formulas. Rules are computed in order of sequence numbers so higher rules can depend seamlessly on lower ones.
                </p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-zinc-950 border border-white/[0.06] flex justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <span className="text-zinc-400">Seq 10: BASIC</span>
                    <span className="text-emerald-400 font-bold">contract.wage * 0.50</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-white/[0.06] flex justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <span className="text-zinc-400">Seq 20: HRA</span>
                    <span className="text-emerald-400 font-bold">BASIC * 0.40</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-white/[0.06] flex justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <span className="text-zinc-400">Seq 50: PF_DEDUCTION</span>
                    <span className="text-rose-400 font-bold">BASIC * 0.12</span>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-5 space-y-3 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
                <p className="text-xs font-bold text-white flex items-center gap-2 font-heading">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  Live Category Hierarchy
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                    <span className="text-zinc-300">Allowances (ALW)</span>
                    <span className="font-mono text-blue-400 font-bold">+₹42,000</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                    <span className="text-zinc-300">Gross Total (GROSS)</span>
                    <span className="font-mono text-emerald-400 font-bold">₹1,25,000</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                    <span className="text-zinc-300">Statutory Deductions (DED)</span>
                    <span className="font-mono text-rose-400 font-bold">-₹18,200</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                    <span className="font-bold text-white font-heading">Net Take-Home (NET)</span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">₹1,06,800</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">04 // Cost Visualizer</span>
                <h3 className="font-heading text-2xl font-bold text-white">Real-Time Department Cost Distribution</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Monitor salary disbursements across Engineering, Sales, Product, Marketing, and Operations. Get instant alerts when departments exceed budget limits.
                </p>
                <div className="pt-2">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Open Full Analytics Suite <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              <div className="space-y-3 bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
                {[
                  { dept: "Engineering & Cloud", cost: "₹45,20,000", pct: 85, color: "from-blue-500 to-indigo-500" },
                  { dept: "Product & UI/UX", cost: "₹28,60,000", pct: 60, color: "from-emerald-500 to-teal-500" },
                  { dept: "Sales & Growth", cost: "₹19,40,000", pct: 42, color: "from-purple-500 to-pink-500" },
                ].map((d, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-200">{d.dept}</span>
                      <span className="font-mono text-emerald-400 font-bold">{d.cost}</span>
                    </div>
                    <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/[0.06] p-0.5">
                      <div
                        className={`h-full bg-gradient-to-r ${d.color} rounded-full`}
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5 Demo Roles Quick Launch (Skeuomorphic Badges) */}
      <section id="roles" className="py-20 bg-[#05070a]/90 border-t border-white/[0.08] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              Evaluator Access
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Instant Demo Access for Testing
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Experience the system from any role perspective with pre-configured accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Role 1: System Administrator */}
            <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] hover:border-amber-500/50 rounded-3xl p-6 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    SUPER ADMIN
                  </span>
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">System Administrator</h3>
                <p className="text-xs text-zinc-400 mt-2">
                  Full system control over all companies, working schedules, database structures, and platform settings.
                </p>
                <div className="mt-4 p-3 rounded-2xl bg-zinc-950 border border-white/[0.06] text-[11px] font-mono text-zinc-400 space-y-1 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]">
                  <div>Email: <span className="text-amber-300">admin@peoplepay360.demo</span></div>
                  <div>Pass: <span className="text-white">2305 / Admin@123</span></div>
                </div>
              </div>
              <Link
                href="/login"
                className="mt-6 w-full py-3 bg-gradient-to-b from-amber-400 to-orange-700 hover:brightness-110 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(245,158,11,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all cursor-pointer"
              >
                Sign In as Admin
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Role 2: HR Payroll Manager */}
            <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] hover:border-emerald-500/50 rounded-3xl p-6 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    PAYROLL LEAD
                  </span>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">HR Payroll Manager</h3>
                <p className="text-xs text-zinc-400 mt-2">
                  Full control over payrun batches, salary rule formulas, batch approvals, and PDF email dispatch.
                </p>
                <div className="mt-4 p-3 rounded-2xl bg-zinc-950 border border-white/[0.06] text-[11px] font-mono text-zinc-400 space-y-1 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]">
                  <div>Email: <span className="text-emerald-400">payroll.manager@peoplepay360.demo</span></div>
                  <div>Pass: <span className="text-white">2305 / Admin@123</span></div>
                </div>
              </div>
              <Link
                href="/login"
                className="mt-6 w-full py-3 bg-gradient-to-b from-emerald-400 to-teal-700 hover:brightness-110 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(16,185,129,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all cursor-pointer"
              >
                Sign In as Payroll Manager
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Role 3: HR Operations Officer */}
            <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] hover:border-blue-500/50 rounded-3xl p-6 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    CORE HR
                  </span>
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">HR Operations Officer</h3>
                <p className="text-xs text-zinc-400 mt-2">
                  Employee contract creation, attendance management, leave approvals, and work schedule allocations.
                </p>
                <div className="mt-4 p-3 rounded-2xl bg-zinc-950 border border-white/[0.06] text-[11px] font-mono text-zinc-400 space-y-1 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]">
                  <div>Email: <span className="text-blue-400">hr.manager@peoplepay360.demo</span></div>
                  <div>Pass: <span className="text-white">2305 / Admin@123</span></div>
                </div>
              </div>
              <Link
                href="/login"
                className="mt-6 w-full py-3 bg-gradient-to-b from-blue-500 to-indigo-700 hover:brightness-110 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all cursor-pointer"
              >
                Sign In as HR Officer
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Role 4: HR Payroll User */}
            <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] hover:border-purple-500/50 rounded-3xl p-6 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    SPECIALIST
                  </span>
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">HR Payroll User</h3>
                <p className="text-xs text-zinc-400 mt-2">
                  Draft payrun generation, employee data verification, salary calculation reviews, and slip validation.
                </p>
                <div className="mt-4 p-3 rounded-2xl bg-zinc-950 border border-white/[0.06] text-[11px] font-mono text-zinc-400 space-y-1 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]">
                  <div>Email: <span className="text-purple-400">payroll.user@peoplepay360.demo</span></div>
                  <div>Pass: <span className="text-white">2305 / Admin@123</span></div>
                </div>
              </div>
              <Link
                href="/login"
                className="mt-6 w-full py-3 bg-gradient-to-b from-purple-500 to-indigo-800 hover:brightness-110 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(168,85,247,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all cursor-pointer"
              >
                Sign In as Payroll User
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Role 5: Employee Self-Service */}
            <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] hover:border-cyan-500/50 rounded-3xl p-6 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all flex flex-col justify-between md:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    SELF SERVICE
                  </span>
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">Employee Self-Service</h3>
                <p className="text-xs text-zinc-400 mt-2">
                  Personal payslip PDF downloads, real-time clock-in/out attendance widget, and instant leave requests.
                </p>
                <div className="mt-4 p-3 rounded-2xl bg-zinc-950 border border-white/[0.06] text-[11px] font-mono text-zinc-400 space-y-1 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]">
                  <div>Email: <span className="text-cyan-400">employee@peoplepay360.demo</span></div>
                  <div>Pass: <span className="text-white">2305 / Admin@123</span></div>
                </div>
              </div>
              <Link
                href="/login"
                className="mt-6 w-full py-3 bg-gradient-to-b from-cyan-500 to-teal-800 hover:brightness-110 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(6,182,212,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all cursor-pointer"
              >
                Sign In as Employee
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            Transparent Pricing
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            Simple, Scalable Enterprise Plans
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Everything included. No hidden fees or calculation surcharges.
          </p>

          {/* Neumorphic Toggle Switch */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-xs ${billingCycle === "monthly" ? "text-white font-bold" : "text-zinc-400"}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="w-14 h-7 rounded-full bg-zinc-950 p-1 relative border border-white/10 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] cursor-pointer"
            >
              <div className={`w-5 h-5 rounded-full bg-gradient-to-b from-emerald-300 to-teal-600 shadow-[0_2px_6px_rgba(16,185,129,0.4)] transition-transform ${billingCycle === "yearly" ? "translate-x-7" : ""}`} />
            </button>
            <span className={`text-xs flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-white font-bold" : "text-zinc-400"}`}>
              Yearly <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1 */}
          <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 border border-white/[0.08] rounded-3xl p-7 flex flex-col justify-between shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]">
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Starter Team</h3>
              <p className="text-xs text-zinc-400 mt-1">Up to 25 Employees</p>
              <div className="mt-5 mb-6">
                <span className="font-heading text-3xl font-extrabold text-white">₹{billingCycle === "yearly" ? "2,499" : "2,999"}</span>
                <span className="text-xs text-zinc-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full Payrun & Payslip Generation</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Web Biometric Attendance Clock</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Time-Off & Leave Management</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="mt-8 w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-semibold text-xs rounded-xl text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-all cursor-pointer"
            >
              Get Started
            </Link>
          </div>

          {/* Plan 2 - Featured */}
          <div className="bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border-2 border-emerald-500/80 rounded-3xl p-7 relative flex flex-col justify-between shadow-[0_20px_50px_rgba(16,185,129,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-zinc-950 text-[10px] font-extrabold uppercase tracking-wider shadow-[0_4px_12px_rgba(16,185,129,0.4)]">
              Most Popular
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Growth Enterprise</h3>
              <p className="text-xs text-zinc-400 mt-1">Up to 250 Employees</p>
              <div className="mt-5 mb-6">
                <span className="font-heading text-3xl font-extrabold text-white">₹{billingCycle === "yearly" ? "6,999" : "8,499"}</span>
                <span className="text-xs text-zinc-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Payrun Batches</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom Salary Structure & Rules</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> PDF Payslips & Batch Email Dispatch</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Department Cost Analytics Suite</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="mt-8 w-full py-3 bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-700 text-zinc-950 font-bold text-xs rounded-xl text-center shadow-[0_6px_20px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-110 transition-all cursor-pointer"
            >
              Launch Live Workspace
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 border border-white/[0.08] rounded-3xl p-7 flex flex-col justify-between shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]">
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Custom Unlimited</h3>
              <p className="text-xs text-zinc-400 mt-1">500+ Staff & Multi-Branch</p>
              <div className="mt-5 mb-6">
                <span className="font-heading text-3xl font-extrabold text-white">₹{billingCycle === "yearly" ? "14,999" : "17,999"}</span>
                <span className="text-xs text-zinc-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Dedicated Cloud Infrastructure</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom Statutory Compliance Modules</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 24/7 Priority SLA & Dedicated Lead</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="mt-8 w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-semibold text-xs rounded-xl text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-all cursor-pointer"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#05070a] py-12 relative z-10 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-tr from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center font-heading font-extrabold text-zinc-950 text-sm shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
              360
            </div>
            <span className="font-heading font-bold text-white text-sm">PeoplePay360</span>
            <span className="text-zinc-600">|</span>
            <span>© 2026 PeoplePay360 HR Technologies Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition-colors">Portal Login</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              System Operational (99.99%)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
