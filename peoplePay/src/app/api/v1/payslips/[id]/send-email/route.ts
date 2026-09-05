import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PayrollService } from "@/modules/payroll";
import { sendPayslipEmail } from "@/lib/smtp-email";

const payrollService = new PayrollService();

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));

    // Retrieve payslip with employee data
    const payslip = await prisma.payslip.findUnique({
      where: { id },
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
        lines: {
          include: {
            salaryRule: { select: { name: true, code: true } },
            category: { select: { name: true } },
          },
          orderBy: { sequence: "asc" },
        },
      },
    });

    if (!payslip) {
      return NextResponse.json(
        { success: false, error: "Payslip record not found." },
        { status: 404 }
      );
    }

    // Determine target recipient email
    const recipientEmail = body.email || payslip.employee?.workEmail;

    if (!recipientEmail) {
      return NextResponse.json(
        { success: false, error: "No recipient email address provided. Enter an email or ensure the employee has a work email on file." },
        { status: 400 }
      );
    }

    // Generate the official PDF
    const pdfBytes = await payrollService.generatePayslipPdf(id);
    const employeeName = payslip.employee?.fullName || "Employee";
    const pdfFilename = `payslip-${employeeName.replace(/\s+/g, "_")}-${new Date(payslip.periodStart).toISOString().slice(0, 7)}.pdf`;

    // Send real email via SMTP (nodemailer + Gmail)
    const result = await sendPayslipEmail({
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

    console.log(
      `[PeoplePay360 SMTP] Payslip email DELIVERED to ${recipientEmail} | MessageID: ${result.messageId}`
    );

    return NextResponse.json({
      success: true,
      message: `Payslip PDF successfully emailed to ${recipientEmail}`,
      data: {
        to: recipientEmail,
        messageId: result.messageId,
        pdfFilename,
        pdfAttachmentSize: `${(pdfBytes.length / 1024).toFixed(1)} KB`,
        dispatchedAt: result.dispatchedAt,
        status: "Delivered",
      },
    });
  } catch (error: any) {
    console.error("[PeoplePay360 SMTP] Error sending payslip email:", error);

    // Provide a user-friendly error message
    let userMessage = error.message || "Failed to send payslip email";
    if (error.message?.includes("SMTP credentials not configured")) {
      userMessage = "Email not configured. Admin must set SMTP_USER and SMTP_PASS in the server .env file.";
    } else if (error.code === "EAUTH") {
      userMessage = "Gmail authentication failed. Check your SMTP_USER and SMTP_PASS (App Password) in .env.";
    } else if (error.code === "ESOCKET" || error.code === "ECONNREFUSED") {
      userMessage = "Cannot connect to email server. Check SMTP settings and network connectivity.";
    }

    return NextResponse.json(
      { success: false, error: userMessage },
      { status: 500 }
    );
  }
}
