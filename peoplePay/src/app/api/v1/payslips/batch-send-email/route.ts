import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PayrollService } from "@/modules/payroll";
import { sendPayslipEmail } from "@/lib/smtp-email";

const payrollService = new PayrollService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { payslipIds, payrunId } = body;

    let whereClause: any = {};

    if (Array.isArray(payslipIds) && payslipIds.length > 0) {
      whereClause.id = { in: payslipIds };
    } else if (payrunId) {
      whereClause.payrunId = payrunId;
    } else {
      return NextResponse.json(
        { success: false, error: "Please provide either payslipIds array or payrunId." },
        { status: 400 }
      );
    }

    const payslips = await prisma.payslip.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            workEmail: true,
            jobPosition: true,
            department: { select: { name: true } },
          },
        },
        payrun: {
          select: { id: true, name: true, periodStart: true, periodEnd: true },
        },
        salaryStructure: {
          select: { id: true, name: true },
        },
      },
    });

    if (payslips.length === 0) {
      return NextResponse.json(
        { success: false, error: "No matching payslip records found to dispatch." },
        { status: 404 }
      );
    }

    const results: Array<{
      payslipId: string;
      employeeName: string;
      email: string;
      status: "Delivered" | "Failed";
      error?: string;
    }> = [];

    let sentCount = 0;
    let failedCount = 0;

    // Process in controlled batches
    for (const payslip of payslips) {
      const recipientEmail =
        payslip.employee?.workEmail ||
        `${payslip.employee?.fullName?.toLowerCase().replace(/\s+/g, ".")}@peoplepay360.internal`;
      const employeeName = payslip.employee?.fullName || "Employee";

      try {
        const pdfBytes = await payrollService.generatePayslipPdf(payslip.id);
        const pdfFilename = `payslip-${employeeName.replace(/\s+/g, "_")}-${new Date(
          payslip.periodStart
        )
          .toISOString()
          .slice(0, 7)}.pdf`;

        await sendPayslipEmail({
          to: recipientEmail,
          employeeName,
          periodStart: payslip.periodStart,
          periodEnd: payslip.periodEnd,
          grossTotal: Number(payslip.grossTotal),
          netTotal: Number(payslip.netTotal),
          pdfBuffer: pdfBytes,
          pdfFilename,
          payrunName: payslip.payrun?.name || undefined,
          salaryStructure: payslip.salaryStructure?.name || undefined,
          workedDays: Number(payslip.workedDays) || undefined,
          jobPosition: payslip.employee?.jobPosition || undefined,
          department: payslip.employee?.department?.name || undefined,
        });

        sentCount++;
        results.push({
          payslipId: payslip.id,
          employeeName,
          email: recipientEmail,
          status: "Delivered",
        });
      } catch (err: any) {
        failedCount++;
        results.push({
          payslipId: payslip.id,
          employeeName,
          email: recipientEmail,
          status: "Failed",
          error: err.message || "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Batch email processing finished: ${sentCount} successfully sent, ${failedCount} failed.`,
      total: payslips.length,
      sentCount,
      failedCount,
      results,
    });
  } catch (error: any) {
    console.error("[Batch Send Email Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process batch email dispatch." },
      { status: 500 }
    );
  }
}
