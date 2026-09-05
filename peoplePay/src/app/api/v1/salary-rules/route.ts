import { NextRequest, NextResponse } from "next/server";
import { SalaryConfigurationService, PayrollDomainError } from "@/modules/payroll";
import { requireRole } from "@/modules/auth/rbac";

export async function GET(req: NextRequest) {
  const rbac = await requireRole(["HR Payroll User", "HR Payroll Manager", "Admin"]);
  if (rbac.error) {
    return NextResponse.json({ success: false, error: "Forbidden: No payroll access for this role." }, { status: rbac.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const salaryStructureId = searchParams.get("salaryStructureId") || undefined;
    const rules = await SalaryConfigurationService.listRules(salaryStructureId);
    return NextResponse.json({ success: true, data: rules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const rbac = await requireRole(["HR Payroll Manager", "Admin"]);
  if (rbac.error) {
    return NextResponse.json({ success: false, error: "Forbidden: Only HR Payroll Manager or Admin can create salary rules." }, { status: rbac.status });
  }

  try {
    const body = await req.json();
    const { salaryStructureId, ...ruleData } = body;
    if (!salaryStructureId) {
      return NextResponse.json({ success: false, error: "salaryStructureId is required." }, { status: 400 });
    }
    const rule = await SalaryConfigurationService.addRule(salaryStructureId, ruleData);
    return NextResponse.json({ success: true, data: rule }, { status: 201 });
  } catch (error: any) {
    if (error instanceof PayrollDomainError) {
      return NextResponse.json({ success: false, error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
