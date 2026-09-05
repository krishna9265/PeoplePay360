import { NextRequest, NextResponse } from "next/server";
import { PayrollService } from "@/modules/payroll";
import { requireRole } from "@/modules/auth/rbac";

const payrollService = new PayrollService();

export async function GET(req: NextRequest) {
  const rbac = await requireRole(["HR Payroll User", "HR Payroll Manager", "Admin"]);
  if (rbac.error) {
    return NextResponse.json({ success: false, error: "Forbidden: No payroll access for this role." }, { status: rbac.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const payrunId = searchParams.get("payrunId") || undefined;
    const employeeId = searchParams.get("employeeId") || undefined;
    const status = searchParams.get("status") || undefined;

    const payslips = await payrollService.listPayslips({ payrunId, employeeId, status });
    return NextResponse.json({ success: true, data: payslips });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
