"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  FileText,
  CalendarClock,
  LogOut,
  LayoutDashboard,
  Clock,
  CalendarDays,
  CreditCard,
  Receipt,
  Layers,
  Sliders,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { TopbarAttendanceWidget } from "@/components/ui/TopbarAttendanceWidget";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const userRole = (session?.user as any)?.roleName || "Employee";
  const isEmployee = userRole === "Employee";
  const isAdmin = userRole === "Admin";
  const isPayrollUser = ["HR Payroll User", "HR Payroll Manager", "Admin"].includes(userRole);
  const isHRManager = ["HR Manager", "HR Payroll User", "HR Payroll Manager", "Admin"].includes(userRole);

  const navSections = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, visible: true },
      ],
    },
    {
      title: "Core HR",
      items: [
        { name: "Employees", href: "/employees", icon: Users, visible: isHRManager },
        { name: "Contracts", href: "/contracts", icon: FileText, visible: isHRManager },
        { name: "Schedules", href: "/schedules", icon: CalendarClock, visible: isHRManager },
      ],
    },
    {
      title: "Time & Operations",
      items: [
        { name: "Attendance", href: "/attendance", icon: Clock, visible: true },  // All roles, but Employee sees own only
        { name: "Time Off", href: "/time-off", icon: CalendarDays, visible: true },  // All roles, but Employee sees own only
      ],
    },
    {
      title: "Payroll Management",
      items: [
        { name: "Payruns", href: "/payroll/payruns", icon: CreditCard, visible: isPayrollUser },
        { name: "Payslips", href: "/payroll/payslips", icon: Receipt, visible: isPayrollUser },
        { name: "Salary Structures", href: "/payroll/salary-structures", icon: Layers, visible: isPayrollUser },
        { name: "Salary Rules", href: "/payroll/salary-rules", icon: Sliders, visible: isPayrollUser },
      ],
    },
    {
      title: "System Admin",
      items: [
        { name: "User Management", href: "/admin/users", icon: ShieldCheck, visible: isAdmin },
      ],
    },
  ];

  return (
    <div className="h-screen bg-[#09090b] text-zinc-100 flex font-sans antialiased selection:bg-blue-600/30 selection:text-white overflow-hidden">
      {/* Sidebar - Fixed in place */}
      <aside className="w-64 h-full shrink-0 bg-zinc-950/80 border-r border-zinc-800/80 flex flex-col hidden md:flex relative z-30 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/60 justify-between shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="h-9 w-9 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Users className="text-white w-5 h-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">PeoplePay360</span>
              <span className="block text-[10px] uppercase tracking-widest text-zinc-400 font-mono">HR & Payroll</span>
            </div>
          </Link>
        </div>

        {/* Nav list */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 scrollbar-none">
          {navSections.map((section) => {
            const visibleItems = section.items.filter((item) => item.visible);
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title} className="space-y-1">
                <p className="px-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  {section.title}
                </p>
                {visibleItems.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard" || pathname === "/payroll/dashboard"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600/20 to-purple-600/10 text-blue-400 border border-blue-500/20 shadow-sm"
                          : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className={`mr-3 h-4 w-4 ${isActive ? "text-blue-400" : "text-zinc-400"}`} />
                        <span>{item.name}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400 opacity-60" />}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* User Card & Sign Out */}
        <div className="p-4 border-t border-zinc-800/60 bg-zinc-950/40 shrink-0">
          <div className="flex items-center px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-blue-500/20">
              {session?.user?.email?.[0].toUpperCase() || "U"}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-xs font-medium text-white truncate">
                {session?.user?.email?.split("@")[0] || "User"}
              </p>
              <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {userRole}
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-gradient-to-bl from-blue-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[250px] bg-gradient-to-tr from-purple-600/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none" />

        {/* Topbar */}
        <header className="h-16 shrink-0 border-b border-zinc-800/60 bg-zinc-950/60 backdrop-blur-xl flex items-center justify-between px-6 sm:px-8 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider hidden sm:inline">
              Environment:
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Demo Ready
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Embedded Topbar Attendance Widget (Screen 13) */}
            <TopbarAttendanceWidget />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 z-10 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
