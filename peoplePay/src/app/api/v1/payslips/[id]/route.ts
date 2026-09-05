import { NextRequest, NextResponse } from "next/server";
import { PayrollService } from "@/modules/payroll";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/modules/auth/authOptions";

const payrollService = new PayrollService();

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.roleName || "Employee";
    const userEmployeeId = (session?.user as any)?.employeeId;

    if (userRole === "HR Manager") {
      return NextResponse.json(
        { success: false, error: "Forbidden: HR Managers do not have payroll access." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const payslip = await payrollService.getPayslip(id);
    if (!payslip) {
      return NextResponse.json({ success: false, error: "Payslip not found." }, { status: 404 });
    }

    // If Employee, ensure it's their own payslip
    if (userRole === "Employee" && userEmployeeId && payslip.employeeId !== userEmployeeId) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You can only view your own payslips." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: payslip });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
