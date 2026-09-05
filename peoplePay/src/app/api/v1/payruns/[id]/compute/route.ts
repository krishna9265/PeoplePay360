import { NextRequest, NextResponse } from "next/server";
import { PayrollService, PayrollDomainError } from "@/modules/payroll";
import { requireRole } from "@/modules/auth/rbac";

const payrollService = new PayrollService();

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const rbac = await requireRole(["HR Payroll Manager", "Admin"]);
  if (rbac.error) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Only HR Payroll Manager or Admin can compute payruns." },
      { status: rbac.status }
    );
  }

  try {
    const { id } = await context.params;
    const result = await payrollService.computePayrun(id);
    return NextResponse.json({
      success: true,
      data: result,
      message: `Compute completed with ${result.payslips.length} payslips generated and ${result.warnings.length} warnings.`,
    });
  } catch (error: any) {
    if (error instanceof PayrollDomainError) {
      return NextResponse.json({ success: false, error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
