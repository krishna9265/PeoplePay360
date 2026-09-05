import { NextRequest, NextResponse } from "next/server";
import { PayrollAnalyticsService } from "@/modules/payroll";
import { getDashboardOperationalMetrics } from "@/modules/time-tracking";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/modules/auth/authOptions";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.roleName || "Employee";
    const isPayrollUser = ["HR Payroll User", "HR Payroll Manager", "Admin"].includes(userRole);

    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId") || undefined;
    const periodStart = searchParams.get("periodStart") ? new Date(searchParams.get("periodStart")!) : undefined;
    const periodEnd = searchParams.get("periodEnd") ? new Date(searchParams.get("periodEnd")!) : undefined;

    // Operational metrics are HR-scoped and accessible by HR Manager+
    const operationalMetrics = await getDashboardOperationalMetrics().catch(() => ({ attendance: null, timeOff: null }));

    // Non-payroll HR Manager only gets HR operational KPIs (BR-HRM-001)
    if (!isPayrollUser) {
      return NextResponse.json({
        success: true,
        data: {
          kpis: {
            totalNetSalaryPaid: 0,
            payslipsGeneratedCount: 0,
            averageSalary: 0,
            approvedTimeOffDays: operationalMetrics.timeOff?.approvedLeaveDays ?? 0,
            pendingTimeOffRequests: operationalMetrics.timeOff?.pendingRequestsCount ?? 0,
            attendanceHealth: operationalMetrics.attendance,
          },
          charts: {
            salaryCostByDepartment: [],
            monthlySalaryTrend: [],
          },
          alerts: [],
          operational: operationalMetrics,
        },
      });
    }

    // Full payroll metrics for HR Payroll User, HR Payroll Manager, Admin
    const [
      payrollKpis,
      salaryCostByDepartment,
      monthlySalaryTrend,
      payrollAlerts,
    ] = await Promise.all([
      PayrollAnalyticsService.getPayrollKpis({ departmentId, periodStart, periodEnd }),
      PayrollAnalyticsService.getSalaryCostByDepartment(),
      PayrollAnalyticsService.getMonthlyNetSalaryTrend(),
      PayrollAnalyticsService.getPayrollAlerts(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          ...payrollKpis,
          approvedTimeOffDays: operationalMetrics.timeOff?.approvedLeaveDays ?? 0,
          pendingTimeOffRequests: operationalMetrics.timeOff?.pendingRequestsCount ?? 0,
          attendanceHealth: operationalMetrics.attendance,
        },
        charts: {
          salaryCostByDepartment,
          monthlySalaryTrend,
        },
        alerts: payrollAlerts,
        operational: operationalMetrics,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
