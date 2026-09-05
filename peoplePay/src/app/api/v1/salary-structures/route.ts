import { NextRequest, NextResponse } from "next/server";
import { SalaryConfigurationService, PayrollDomainError } from "@/modules/payroll";
import { requireRole } from "@/modules/auth/rbac";

export async function GET() {
  const rbac = await requireRole(["HR Payroll User", "HR Payroll Manager", "Admin"]);
  if (rbac.error) {
    return NextResponse.json({ success: false, error: "Forbidden: No payroll access for this role." }, { status: rbac.status });
  }

  try {
    const structures = await SalaryConfigurationService.listStructures();
    return NextResponse.json({ success: true, data: structures });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const rbac = await requireRole(["HR Payroll Manager", "Admin"]);
  if (rbac.error) {
    return NextResponse.json({ success: false, error: "Forbidden: Only HR Payroll Manager or Admin can create salary structures." }, { status: rbac.status });
  }

  try {
    const body = await req.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: "Salary structure name is required." }, { status: 400 });
    }
    const structure = await SalaryConfigurationService.createStructure(body.name, body.active ?? true);
    return NextResponse.json({ success: true, data: structure }, { status: 201 });
  } catch (error: any) {
    if (error instanceof PayrollDomainError) {
      return NextResponse.json({ success: false, error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
