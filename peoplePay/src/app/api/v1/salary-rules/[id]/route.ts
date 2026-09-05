import { NextRequest, NextResponse } from "next/server";
import { SalaryConfigurationService, PayrollDomainError } from "@/modules/payroll";
import { requireRole } from "@/modules/auth/rbac";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const rbac = await requireRole(["HR Payroll Manager", "Admin"]);
  if (rbac.error) {
    return NextResponse.json({ success: false, error: "Forbidden: Only HR Payroll Manager or Admin can update salary rules." }, { status: rbac.status });
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    const updated = await SalaryConfigurationService.updateRule(id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error instanceof PayrollDomainError) {
      return NextResponse.json({ success: false, error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const rbac = await requireRole(["HR Payroll Manager", "Admin"]);
  if (rbac.error) {
    return NextResponse.json({ success: false, error: "Forbidden: Only HR Payroll Manager or Admin can delete salary rules." }, { status: rbac.status });
  }

  try {
    const { id } = await context.params;
    await SalaryConfigurationService.deleteRule(id);
    return NextResponse.json({ success: true, message: "Salary rule deleted successfully." });
  } catch (error: any) {
    if (error instanceof PayrollDomainError) {
      return NextResponse.json({ success: false, error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
