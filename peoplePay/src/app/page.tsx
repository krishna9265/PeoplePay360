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
  ChevronDown
} from "lucide-react";

export default function LandingPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"payroll" | "attendance" | "rules" | "analytics">("payroll");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <div className="min-h-screen bg-[#06080d] text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[30%] right-[-5%] w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#06080d]/80 border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-all">
              <Users className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">PeoplePay<span className="text-emerald-400">360</span></span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Enterprise HRMS
                </span>
              </div>
              <span className="block text-[11px] text-zinc-400 font-medium">Payroll, Attendance & Compensation Cloud</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-emerald-400 transition-colors">HR Solutions</a>
            <a href="#interactive" className="hover:text-emerald-400 transition-colors">Live Architecture</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
            <a href="#roles" className="hover:text-emerald-400 transition-colors">Demo Roles</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {session ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white rounded-xl hover:bg-zinc-800/60 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105"
                >
                  Launch Live Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Next-Generation Automated Payroll Engine 2026</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-400 font-normal">Odoo Inspired Architecture</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
            The Smarter Way to Manage <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              All Your HR & Payroll Needs
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate payroll errors and manual calculations. PeoplePay360 orchestrates salary rules, automated biometric attendance, dynamic leave accruals, and statutory compliance in one unified workspace.
          </p>

          {/* CTA Group */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
            >
              <Zap className="w-5 h-5 fill-current" />
              Explore Live System
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#interactive"
              className="px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-semibold text-sm rounded-2xl flex items-center gap-3 backdrop-blur-md transition-all hover:border-zinc-500"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              Watch Interactive Demo
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Deterministic Python Rules</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Biometric & GPS Attendance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Configuration Payruns</span>
            </div>
          </div>
        </div>

        {/* Hero App Mockup / Visual Card */}
        <div className="mt-14 relative mx-auto max-w-5xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 rounded-[2.5rem] blur-xl opacity-30 animate-tilt" />
          
          <div className="relative rounded-[2rem] bg-zinc-950/90 border border-zinc-800/80 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl">
            {/* Window Topbar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/60 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-zinc-500">app.peoplepay360.com/payroll/payruns/active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-mono font-bold text-[11px]">LIVE RUNTIME ENGINE</span>
              </div>
            </div>

            {/* Mockup Dashboard Body */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stat Card 1 */}
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
                  <span>Batch Payroll Total</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-3">₹42,85,900</div>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-400 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>100% Calculated in 1.8s</span>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-500/40 transition-all">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
                  <span>Attendance & LOP Sync</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-3">98.4% Present</div>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-blue-400 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Auto Unpaid Leave Deductions</span>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
                  <span>Statutory Compliance</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-3">EPF + ESI + TDS</div>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-purple-400 font-medium">
                  <Award className="w-3.5 h-3.5" />
                  <span>Auto Slip Generation & PDFs</span>
                </div>
              </div>
            </div>

            {/* Mock Table Preview */}
            <div className="mt-4 border border-zinc-800/80 rounded-2xl overflow-hidden bg-zinc-900/40">
              <div className="px-5 py-3.5 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200">Current Payrun Payslips Breakdown</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">READY FOR DISBURSEMENT</span>
              </div>
              <div className="divide-y divide-zinc-800/40 text-xs">
                {[
                  { name: "Aarav Sharma", role: "Sr. Full Stack Architect", gross: "₹1,85,000", net: "₹1,56,400", status: "Verified" },
                  { name: "Priya Nair", role: "Lead Product Designer", gross: "₹1,40,000", net: "₹1,19,800", status: "Verified" },
                  { name: "Rahul Verma", role: "DevOps & Cloud Specialist", gross: "₹1,65,000", net: "₹1,39,200", status: "Verified" },
                ].map((item, idx) => (
                  <div key={idx} className="px-5 py-3 flex items-center justify-between hover:bg-zinc-800/30">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white text-[10px]">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-[11px] text-zinc-400">{item.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-emerald-400">{item.net}</p>
                      <p className="text-[10px] text-zinc-500">Gross: {item.gross}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Key HR Solutions Grid (Inspired by Envato Template) */}
      <section id="solutions" className="py-20 bg-zinc-950/60 border-y border-zinc-800/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              End-to-End HR Ecosystem
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Designed to Empower HR, Managers, & Employees
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Everything you need to automate workforce management, run zero-error payruns, and give employees transparent control over their compensation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 hover:border-emerald-500/40 rounded-3xl p-7 transition-all hover:-translate-y-1 hover:shadow-2xl group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-6">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                Automated Payrun Engine
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Execute company-wide payroll in seconds with automated sequence computation, allowance deductions, and instant payslip generation.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> One-click batch calculation</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Draft, Done, & Paid workflow states</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 hover:border-teal-500/40 rounded-3xl p-7 transition-all hover:-translate-y-1 hover:shadow-2xl group">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                Biometric & Topbar Clock-In
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Real-time punch in/out widget in topbar with total work duration tracking, overtime calculation, and automatic LOP synchronization.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Live active timer & session state</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Loss of pay automated deduction</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 hover:border-blue-500/40 rounded-3xl p-7 transition-all hover:-translate-y-1 hover:shadow-2xl group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                Configurable Salary Rules
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Create dynamic salary structures with Pythonic formulas, sequenced rules (Basic, HRA, DA, PF, ESI, TDS) and multi-level categories.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Sequence-ordered dependency tree</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Odoo compatible structure design</li>
              </ul>
            </div>

            {/* Card 4 */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 hover:border-purple-500/40 rounded-3xl p-7 transition-all hover:-translate-y-1 hover:shadow-2xl group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-6">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                Time-Off & Leave Allocations
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Self-service leave requests with automated balance tracking across Paid, Sick, and Casual leaves with instant manager approvals.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Multi-level approval hierarchy</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Real-time allocation ledger</li>
              </ul>
            </div>

            {/* Card 5 */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 hover:border-indigo-500/40 rounded-3xl p-7 transition-all hover:-translate-y-1 hover:shadow-2xl group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                Digital PDF Payslips & Email
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Generate branded PDF payslips on the fly and disburse them directly to employee email inboxes with automated Resend integration.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Single-click PDF export & print</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Secure authenticated dispatch</li>
              </ul>
            </div>

            {/* Card 6 */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/40 rounded-3xl p-7 transition-all hover:-translate-y-1 hover:shadow-2xl group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Executive HR Analytics
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Real-time dashboard visualizations for department salary costs, headcount trends, overtime hours, and monthly payroll budget variance.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Department cost distribution</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Historical trends & forecasting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Architecture Showcase */}
      <section id="interactive" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Interactive Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            See How the Engine Powers Real HR Operations
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Toggle between core modules to explore the underlying computational pipelines.
          </p>

          {/* Tab buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
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
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 shadow-lg shadow-emerald-500/20 font-bold"
                      : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
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
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {activeTab === "payroll" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">01 // Payrun Orchestration</span>
                <h3 className="text-2xl font-bold text-white">Deterministic 4-Step Batch Execution</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  When HR initiates a payrun, the engine locks the period, fetches all verified employee contracts, syncs approved leaves & biometric attendance, and executes salary rules in strict mathematical sequence.
                </p>
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-start gap-3 text-xs bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-[10px]">1</span>
                    <div>
                      <p className="font-semibold text-zinc-200">Contract & Working Schedule Lock</p>
                      <p className="text-zinc-400 text-[11px]">Validates wage rates, allowances, and scheduled work hours.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-xs bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-[10px]">2</span>
                    <div>
                      <p className="font-semibold text-zinc-200">Attendance & LOP Deduction Calculation</p>
                      <p className="text-zinc-400 text-[11px]">Computes unworked days against baseline work schedule.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-xs bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-[10px]">3</span>
                    <div>
                      <p className="font-semibold text-zinc-200">Sequence-Sorted Rule Tree Evaluation</p>
                      <p className="text-zinc-400 text-[11px]">BASIC → DA → HRA → GROSS → PF → ESI → TDS → NET.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 font-mono text-xs text-zinc-300 space-y-3">
                <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-800 pb-2">
                  <span>RUNTIME LOGS // BATCH_RUN_#2026_09</span>
                  <span className="text-emerald-400">200 OK</span>
                </div>
                <p className="text-zinc-400">[07:45:01] Fetching active contracts for 142 employees...</p>
                <p className="text-blue-400">[07:45:02] Attendance aggregated: 3,124 work sessions verified.</p>
                <p className="text-purple-400">[07:45:02] Executing Rule Sequence: Structure "Standard Tech 2026"</p>
                <p className="text-emerald-400 font-bold">[07:45:03] 142 Payslips successfully computed without errors.</p>
                <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px]">
                  ✓ Total Gross: ₹1,42,80,000 | Net Disbursable: ₹1,18,52,400
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">02 // Real-Time Biometric Hub</span>
                <h3 className="text-2xl font-bold text-white">Live Attendance & Topbar Instant Punch</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Employees can check in and out with a single click from the sticky topbar widget or mobile interface. Every punch is timestamped and converted to exact worked hours for automatic payroll input.
                </p>
                <div className="flex gap-4 pt-2">
                  <div className="flex-1 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
                    <span className="text-xs text-zinc-400">Avg Check-In Time</span>
                    <p className="text-xl font-bold text-white mt-1">09:12 AM</p>
                  </div>
                  <div className="flex-1 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
                    <span className="text-xs text-zinc-400">Overtime Tracked</span>
                    <p className="text-xl font-bold text-emerald-400 mt-1">+48.5 hrs</p>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center animate-pulse">
                  <Clock className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">Session Active (07h 42m)</p>
                  <p className="text-xs text-zinc-400">Clocked in at 09:00 AM • Remote Work (Verified)</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                  Click Topbar Widget to Clock Out
                </div>
              </div>
            </div>
          )}

          {activeTab === "rules" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">03 // Salary Rule Builder</span>
                <h3 className="text-2xl font-bold text-white">Flexible Sequence-Based Computations</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Build custom compensation logic with flexible arithmetic and condition formulas. Rules are computed in order of sequence numbers so higher rules can depend seamlessly on lower ones.
                </p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800 flex justify-between">
                    <span className="text-zinc-400">Seq 10: BASIC</span>
                    <span className="text-emerald-400">contract.wage * 0.50</span>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800 flex justify-between">
                    <span className="text-zinc-400">Seq 20: HRA</span>
                    <span className="text-emerald-400">BASIC * 0.40</span>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800 flex justify-between">
                    <span className="text-zinc-400">Seq 50: PF_DEDUCTION</span>
                    <span className="text-rose-400">BASIC * 0.12</span>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <p className="text-xs font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  Live Category Hierarchy
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-zinc-300">Allowances (ALW)</span>
                    <span className="font-mono text-blue-400 font-bold">+₹42,000</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-zinc-300">Gross Total (GROSS)</span>
                    <span className="font-mono text-emerald-400 font-bold">₹1,25,000</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-zinc-950/60 border border-zinc-800/80">
                    <span className="text-zinc-300">Statutory Deductions (DED)</span>
                    <span className="font-mono text-rose-400 font-bold">-₹18,200</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <span className="font-bold text-white">Net Take-Home (NET)</span>
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
                <h3 className="text-2xl font-bold text-white">Real-Time Department Cost Distribution</h3>
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
              <div className="space-y-3 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5">
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
                    <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
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

      {/* Demo Roles Quick Launch Grid */}
      <section id="roles" className="py-20 bg-zinc-950/40 border-t border-zinc-800/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Role-Based Access Control
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Instant Demo Access for Evaluators
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Experience the system from any role perspective with pre-configured accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Role 1: HR Payroll Manager */}
            <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-zinc-800 hover:border-emerald-500/50 rounded-3xl p-6 transition-all hover:scale-102 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    FULL ACCESS
                  </span>
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">HR Payroll Manager</h3>
                <p className="text-xs text-zinc-400 mt-2">
                  Full control over payrun generation, salary structures, rule formulas, batch approvals, and statutory reporting.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
                  <div>Email: <span className="text-emerald-400">admin@peoplepay360.com</span></div>
                  <div>Pass: <span className="text-white">Admin@123</span></div>
                </div>
              </div>
              <Link
                href="/login"
                className="mt-6 w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                Sign In as HR Manager
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Role 2: HR Manager */}
            <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-zinc-800 hover:border-blue-500/50 rounded-3xl p-6 transition-all hover:scale-102 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                    OPERATIONS
                  </span>
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">HR Officer / Operations</h3>
                <p className="text-xs text-zinc-400 mt-2">
                  Employee contract creation, attendance management, leave approvals, and work schedule allocations.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
                  <div>Email: <span className="text-blue-400">hr@peoplepay360.com</span></div>
                  <div>Pass: <span className="text-white">Admin@123</span></div>
                </div>
              </div>
              <Link
                href="/login"
                className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                Sign In as HR Officer
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Role 3: Employee */}
            <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-zinc-800 hover:border-purple-500/50 rounded-3xl p-6 transition-all hover:scale-102 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20">
                    SELF SERVICE
                  </span>
                  <Smartphone className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Employee Self-Service</h3>
                <p className="text-xs text-zinc-400 mt-2">
                  Personal payslip PDF downloads, real-time clock-in/out attendance widget, and instant leave requests.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1">
                  <div>Email: <span className="text-purple-400">employee@peoplepay360.com</span></div>
                  <div>Pass: <span className="text-white">Admin@123</span></div>
                </div>
              </div>
              <Link
                href="/login"
                className="mt-6 w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                Sign In as Employee
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Enterprise Plans */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Simple, Scalable Plans for Modern Companies
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Everything included. No hidden fees or per-calculation surcharges.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-xs ${billingCycle === "monthly" ? "text-white font-bold" : "text-zinc-400"}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="w-12 h-6 rounded-full bg-zinc-800 p-1 relative transition-colors cursor-pointer border border-zinc-700"
            >
              <div className={`w-4 h-4 rounded-full bg-emerald-400 transition-transform ${billingCycle === "yearly" ? "translate-x-6" : ""}`} />
            </button>
            <span className={`text-xs flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-white font-bold" : "text-zinc-400"}`}>
              Yearly <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1 */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-7 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Starter Team</h3>
              <p className="text-xs text-zinc-400 mt-1">Up to 25 Employees</p>
              <div className="mt-5 mb-6">
                <span className="text-3xl font-extrabold text-white">₹{billingCycle === "yearly" ? "2,499" : "2,999"}</span>
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
              className="mt-8 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl text-center transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Plan 2 - Featured */}
          <div className="bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border-2 border-emerald-500/80 rounded-3xl p-7 relative flex flex-col justify-between shadow-2xl shadow-emerald-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-zinc-950 text-[10px] font-extrabold uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Growth Enterprise</h3>
              <p className="text-xs text-zinc-400 mt-1">Up to 250 Employees</p>
              <div className="mt-5 mb-6">
                <span className="text-3xl font-extrabold text-white">₹{billingCycle === "yearly" ? "6,999" : "8,499"}</span>
                <span className="text-xs text-zinc-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Payrun Batches</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom Salary Structure & Rule Formulas</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> PDF Payslips & Automated Email Dispatch</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Department Cost Analytics & Visualizer</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="mt-8 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-xs rounded-xl text-center shadow-lg shadow-emerald-500/25 transition-all"
            >
              Launch Live Workspace
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-7 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Custom Unlimited</h3>
              <p className="text-xs text-zinc-400 mt-1">500+ Employees & Multi-Branch</p>
              <div className="mt-5 mb-6">
                <span className="text-3xl font-extrabold text-white">₹{billingCycle === "yearly" ? "14,999" : "17,999"}</span>
                <span className="text-xs text-zinc-400"> / month</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Dedicated Cloud Infrastructure</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom Statutory Compliance Modules</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 24/7 Priority SLA & Dedicated Account Lead</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="mt-8 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl text-center transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 relative z-10 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center font-bold text-zinc-950 text-sm">
              360
            </div>
            <span className="font-bold text-white text-sm">PeoplePay360</span>
            <span className="text-zinc-600">|</span>
            <span>© 2026 PeoplePay360 HR Technologies Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition-colors">Portal Login</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <a href="#features" className="hover:text-white transition-colors">Architecture</a>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              System Operational (99.99%)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
