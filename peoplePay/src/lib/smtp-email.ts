import nodemailer from "nodemailer";

/**
 * PeoplePay360 SMTP Email Service
 * 
 * Uses Gmail SMTP with App Password for real email delivery.
 * Configure via environment variables:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 */

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      "SMTP credentials not configured. Set SMTP_USER and SMTP_PASS in .env file."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export interface SendPayslipEmailOptions {
  to: string;
  employeeName: string;
  periodStart: Date;
  periodEnd: Date;
  grossTotal: number;
  netTotal: number;
  pdfBuffer: Buffer | Uint8Array;
  pdfFilename: string;
  payrunName?: string;
  salaryStructure?: string;
  workedDays?: number;
  jobPosition?: string;
  department?: string;
}

export async function sendPayslipEmail(options: SendPayslipEmailOptions) {
  const transporter = getTransporter();
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@peoplepay360.com";

  const periodLabel = `${options.periodStart.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} – ${options.periodEnd.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  const subject = `Your PeoplePay360 Payslip for ${periodLabel}`;

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #e4e4e7; border-radius: 16px; overflow: hidden; border: 1px solid #27272a;">
      <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 32px 24px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">PeoplePay360</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">Official Payslip Statement</p>
      </div>

      <div style="padding: 28px 24px;">
        <p style="margin: 0 0 16px; font-size: 15px; color: #e4e4e7;">
          Dear <strong style="color: #ffffff;">${options.employeeName}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa; line-height: 1.6;">
          Your payslip for the period <strong style="color: #d4d4d8;">${periodLabel}</strong> has been generated and is attached to this email as a PDF document.
        </p>

        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 8px 0; color: #71717a;">Employee</td>
              <td style="padding: 8px 0; text-align: right; color: #ffffff; font-weight: 600;">${options.employeeName}</td>
            </tr>
            ${options.jobPosition ? `<tr><td style="padding: 8px 0; color: #71717a;">Position</td><td style="padding: 8px 0; text-align: right; color: #d4d4d8;">${options.jobPosition}</td></tr>` : ""}
            ${options.department ? `<tr><td style="padding: 8px 0; color: #71717a;">Department</td><td style="padding: 8px 0; text-align: right; color: #d4d4d8;">${options.department}</td></tr>` : ""}
            ${options.payrunName ? `<tr><td style="padding: 8px 0; color: #71717a;">Payrun Batch</td><td style="padding: 8px 0; text-align: right; color: #c084fc;">${options.payrunName}</td></tr>` : ""}
            ${options.workedDays ? `<tr><td style="padding: 8px 0; color: #71717a;">Worked Days</td><td style="padding: 8px 0; text-align: right; color: #d4d4d8;">${options.workedDays} Days</td></tr>` : ""}
            <tr style="border-top: 1px solid #27272a;">
              <td style="padding: 12px 0 8px; color: #71717a;">Gross Salary</td>
              <td style="padding: 12px 0 8px; text-align: right; color: #ffffff; font-weight: 700; font-size: 15px;">₹${options.grossTotal.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #34d399; font-weight: 600;">Net Take-Home</td>
              <td style="padding: 8px 0; text-align: right; color: #34d399; font-weight: 700; font-size: 17px;">₹${options.netTotal.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </div>

        <p style="margin: 0 0 8px; font-size: 13px; color: #a1a1aa;">
          📎 <strong style="color: #d4d4d8;">Attached:</strong> ${options.pdfFilename}
        </p>
        <p style="margin: 0; font-size: 12px; color: #52525b; line-height: 1.5;">
          This is an auto-generated email from PeoplePay360 HR & Payroll system. If you have questions about your payslip, please contact your HR Manager.
        </p>
      </div>

      <div style="background: #18181b; padding: 16px 24px; border-top: 1px solid #27272a; text-align: center;">
        <p style="margin: 0; font-size: 11px; color: #52525b;">
          © ${new Date().getFullYear()} PeoplePay360 — HR & Payroll Management Platform
        </p>
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"PeoplePay360 HR" <${fromAddress}>`,
    to: options.to,
    subject,
    html: htmlBody,
    attachments: [
      {
        filename: options.pdfFilename,
        content: Buffer.from(options.pdfBuffer),
        contentType: "application/pdf",
      },
    ],
  });

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    to: options.to,
    subject,
    pdfFilename: options.pdfFilename,
    dispatchedAt: new Date().toISOString(),
  };
}
