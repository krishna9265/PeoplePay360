import type { ComputedPayslip } from "./types";

/**
 * Escapes strings for PDF literal strings (enclosed in parentheses).
 * Replaces backslashes, parentheses, and removes unsupported non-ASCII characters for standard PDF Type1 Helvetica.
 */
function escapePdfText(text: string | number | undefined | null): string {
  if (text === undefined || text === null) return "";
  const str = String(text)
    .replace(/₹/g, "INR ")
    .replace(/[^\x20-\x7E]/g, " "); // Replace non-ASCII with space for Type1 Helvetica compatibility
  return str
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function formatMoney(amount: number | undefined | null): string {
  const val = Number(amount || 0);
  return `INR ${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Generates an executive, modern, enterprise-grade Payslip PDF document.
 * Includes official company header, structured employee metadata cards,
 * clear category tables (Earnings & Deductions), and prominent Net Take-Home summary.
 */
export function generatePayslipPdf(payslip: ComputedPayslip): Uint8Array {
  const employeeName =
    payslip.employeeName ||
    payslip.employee?.fullName ||
    "Employee";
  const jobPosition =
    payslip.employee?.jobPosition || "Staff Member";
  const department =
    payslip.employee?.department?.name ||
    payslip.employee?.department ||
    "General";
  const email =
    payslip.employeeEmail ||
    payslip.employee?.workEmail ||
    "N/A";
  const bankAcc =
    payslip.employee?.bankAccountNumber || "Verified on File";

  const periodStart = payslip.period?.start
    ? new Date(payslip.period.start)
    : payslip.periodStart
    ? new Date(payslip.periodStart)
    : new Date();
  const periodEnd = payslip.period?.end
    ? new Date(payslip.period.end)
    : payslip.periodEnd
    ? new Date(payslip.periodEnd)
    : new Date();

  const periodLabel = `${periodStart.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} - ${periodEnd.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  const payrunName = payslip.payrun?.name || "Regular Monthly Payrun";
  const workedDays = Number(payslip.workedDays || 22);
  const unpaidLeaveDays = Number(payslip.unpaidLeaveDays || 0);
  const grossTotal = Number(payslip.grossTotal || 0);
  const netTotal = Number(payslip.netTotal || 0);
  const totalDeductions = Math.max(0, grossTotal - netTotal);

  // Group lines into Earnings and Deductions
  const lines = payslip.lines || [];
  const earnings = lines.filter(
    (l) =>
      !["deductions", "deduction", "net"].includes(
        (typeof l.category === "string" ? l.category : l.categoryObj?.name || "").toLowerCase()
      )
  );
  const deductions = lines.filter((l) =>
    ["deductions", "deduction"].includes(
      (typeof l.category === "string" ? l.category : l.categoryObj?.name || "").toLowerCase()
    )
  );

  // Build PDF Graphics & Text Commands
  const stream: string[] = [];

  // 1. Header Banner (Deep Navy Slate: #0f172a -> 0.06 0.09 0.16)
  stream.push("q");
  stream.push("0.06 0.09 0.16 rg");
  stream.push("36 690 540 72 re f"); // top banner
  // Accent line (Emerald green: 0.06 0.72 0.50)
  stream.push("0.06 0.72 0.50 rg");
  stream.push("36 686 540 4 re f");
  stream.push("Q");

  // Header Text
  stream.push("BT");
  stream.push("/F2 20 Tf"); // Bold
  stream.push("1 1 1 rg"); // White
  stream.push("54 732 Td");
  stream.push(`(${escapePdfText("PEOPLEPAY360")}) Tj`);
  stream.push("ET");

  stream.push("BT");
  stream.push("/F1 9 Tf");
  stream.push("0.6 0.75 0.9 rg");
  stream.push("54 716 Td");
  stream.push(`(${escapePdfText("CONFIDENTIAL OFFICIAL SALARY STATEMENT")}) Tj`);
  stream.push("ET");

  // Right-aligned status badge in header
  stream.push("q");
  stream.push("0.04 0.45 0.35 rg");
  stream.push("440 718 120 24 re f");
  stream.push("Q");

  stream.push("BT");
  stream.push("/F2 9 Tf");
  stream.push("1 1 1 rg");
  stream.push("455 726 Td");
  stream.push(`(${escapePdfText(`STATUS: ${payslip.status || "VALIDATED"}`)}) Tj`);
  stream.push("ET");

  // 2. Employee Details Card (Light gray background: 0.96 0.97 0.98)
  stream.push("q");
  stream.push("0.96 0.97 0.98 rg");
  stream.push("36 580 540 94 re f");
  stream.push("0.85 0.88 0.91 RG");
  stream.push("0.75 w");
  stream.push("36 580 540 94 re S");
  stream.push("Q");

  // Column 1 Text (Employee Info)
  stream.push("BT");
  stream.push("/F2 9 Tf");
  stream.push("0.2 0.25 0.3 rg");
  stream.push("50 656 Td");
  stream.push(`(${escapePdfText("Employee Name:")}) Tj`);
  stream.push("/F1 9 Tf");
  stream.push("100 0 Td");
  stream.push(`(${escapePdfText(employeeName)}) Tj`);
  stream.push("ET");

  stream.push("BT");
  stream.push("/F2 9 Tf");
  stream.push("0.2 0.25 0.3 rg");
  stream.push("50 638 Td");
  stream.push(`(${escapePdfText("Job Position:")}) Tj`);
  stream.push("/F1 9 Tf");
  stream.push("100 0 Td");
  stream.push(`(${escapePdfText(jobPosition)}) Tj`);
  stream.push("ET");

  stream.push("BT");
  stream.push("/F2 9 Tf");
  stream.push("0.2 0.25 0.3 rg");
  stream.push("50 620 Td");
  stream.push(`(${escapePdfText("Department:")}) Tj`);
  stream.push("/F1 9 Tf");
  stream.push("100 0 Td");
  stream.push(`(${escapePdfText(department)}) Tj`);
  stream.push("ET");

  stream.push("BT");
  stream.push("/F2 9 Tf");
  stream.push("0.2 0.25 0.3 rg");
  stream.push("50 602 Td");
  stream.push(`(${escapePdfText("Work Email:")}) Tj`);
  stream.push("/F1 9 Tf");
  stream.push("100 0 Td");
  stream.push(`(${escapePdfText(email)}) Tj`);
  stream.push("ET");

  // Column 2 Text (Payroll & Bank Info)
  stream.push("BT");
  stream.push("/F2 9 Tf");
  stream.push("0.2 0.25 0.3 rg");
  stream.push("320 656 Td");
  stream.push(`(${escapePdfText("Pay Period:")}) Tj`);
  stream.push("/F1 9 Tf");
  stream.push("90 0 Td");
  stream.push(`(${escapePdfText(periodLabel)}) Tj`);
  stream.push("ET");

  stream.push("BT");
  stream.push("/F2 9 Tf");
  stream.push("0.2 0.25 0.3 rg");
  stream.push("320 638 Td");
  stream.push(`(${escapePdfText("Payrun Batch:")}) Tj`);
  stream.push("/F1 9 Tf");
  stream.push("90 0 Td");
  stream.push(`(${escapePdfText(payrunName)}) Tj`);
  stream.push("ET");

  stream.push("BT");
  stream.push("/F2 9 Tf");
  stream.push("0.2 0.25 0.3 rg");
  stream.push("320 620 Td");
  stream.push(`(${escapePdfText("Worked Days:")}) Tj`);
  stream.push("/F1 9 Tf");
  stream.push("90 0 Td");
  const workedDaysText = unpaidLeaveDays > 0 ? `${workedDays} Days (${unpaidLeaveDays} LOP)` : `${workedDays} Days`;
  stream.push(`(${escapePdfText(workedDaysText)}) Tj`);
  stream.push("ET");

  stream.push("BT");
  stream.push("/F2 9 Tf");
  stream.push("0.2 0.25 0.3 rg");
  stream.push("320 602 Td");
  stream.push(`(${escapePdfText("Bank Account:")}) Tj`);
  stream.push("/F1 9 Tf");
  stream.push("90 0 Td");
  stream.push(`(${escapePdfText(bankAcc)}) Tj`);
  stream.push("ET");

  // 3. Breakdown Table Headers
  const tableTopY = 550;

  // Earnings Table Header (Left Half)
  stream.push("q");
  stream.push("0.12 0.16 0.24 rg");
  stream.push(`36 ${tableTopY} 260 22 re f`);
  stream.push("Q");

  stream.push("BT");
  stream.push("/F2 9 Tf");
  stream.push("1 1 1 rg");
  stream.push(`46 ${tableTopY + 7} Td`);
  stream.push(`(${escapePdfText("EARNINGS & ALLOWANCES")}) Tj`);
  stream.push("180 0 Td");
  stream.push(`(${escapePdfText("AMOUNT")}) Tj`);
  stream.push("ET");

  // Deductions Table Header (Right Half)
  stream.push("q");
  stream.push("0.12 0.16 0.24 rg");
  stream.push(`316 ${tableTopY} 260 22 re f`);
  stream.push("Q");

  stream.push("BT");
  stream.push("/F2 9 Tf");
  stream.push("1 1 1 rg");
  stream.push(`326 ${tableTopY + 7} Td`);
  stream.push(`(${escapePdfText("DEDUCTIONS")}) Tj`);
  stream.push("180 0 Td");
  stream.push(`(${escapePdfText("AMOUNT")}) Tj`);
  stream.push("ET");

  // Render Line Items
  const maxRows = Math.max(earnings.length, deductions.length, 6);
  let currentY = tableTopY - 20;

  for (let i = 0; i < maxRows; i++) {
    const earn = earnings[i];
    const ded = deductions[i];
    const isEven = i % 2 === 0;

    // Background zebra stripe
    if (isEven) {
      stream.push("q");
      stream.push("0.97 0.98 0.99 rg");
      stream.push(`36 ${currentY - 4} 260 20 re f`);
      stream.push(`316 ${currentY - 4} 260 20 re f`);
      stream.push("Q");
    }

    // Border bottom line
    stream.push("q");
    stream.push("0.9 0.92 0.94 RG");
    stream.push("0.5 w");
    stream.push(`36 ${currentY - 4} m 296 ${currentY - 4} l S`);
    stream.push(`316 ${currentY - 4} m 576 ${currentY - 4} l S`);
    stream.push("Q");

    // Earning column text
    if (earn) {
      const ruleName = earn.ruleName || earn.ruleCode || "Salary Component";
      stream.push("BT");
      stream.push("/F1 8.5 Tf");
      stream.push("0.15 0.18 0.22 rg");
      stream.push(`46 ${currentY + 2} Td`);
      stream.push(`(${escapePdfText(ruleName)}) Tj`);
      stream.push("ET");

      stream.push("BT");
      stream.push("/F3 8.5 Tf"); // Mono font
      stream.push("0.1 0.1 0.1 rg");
      stream.push(`210 ${currentY + 2} Td`);
      stream.push(`(${escapePdfText(formatMoney(earn.amount))}) Tj`);
      stream.push("ET");
    }

    // Deduction column text
    if (ded) {
      const ruleName = ded.ruleName || ded.ruleCode || "Deduction";
      stream.push("BT");
      stream.push("/F1 8.5 Tf");
      stream.push("0.15 0.18 0.22 rg");
      stream.push(`326 ${currentY + 2} Td`);
      stream.push(`(${escapePdfText(ruleName)}) Tj`);
      stream.push("ET");

      stream.push("BT");
      stream.push("/F3 8.5 Tf"); // Mono font
      stream.push("0.8 0.1 0.1 rg"); // subtle red for deductions
      stream.push(`490 ${currentY + 2} Td`);
      stream.push(`(${escapePdfText(formatMoney(ded.amount))}) Tj`);
      stream.push("ET");
    }

    currentY -= 20;
  }

  // 4. Totals Bar
  const totalsY = currentY - 10;
  stream.push("q");
  stream.push("0.92 0.94 0.96 rg");
  stream.push(`36 ${totalsY} 260 24 re f`);
  stream.push(`316 ${totalsY} 260 24 re f`);
  stream.push("Q");

  // Gross Earnings Total
  stream.push("BT");
  stream.push("/F2 9 Tf");
  stream.push("0.1 0.15 0.2 rg");
  stream.push(`46 ${totalsY + 8} Td`);
  stream.push(`(${escapePdfText("TOTAL GROSS EARNINGS:")}) Tj`);
  stream.push("ET");

  stream.push("BT");
  stream.push("/F2 9.5 Tf");
  stream.push("0.05 0.45 0.25 rg");
  stream.push(`185 ${totalsY + 8} Td`);
  stream.push(`(${escapePdfText(formatMoney(grossTotal))}) Tj`);
  stream.push("ET");

  // Total Deductions
  stream.push("BT");
  stream.push("/F2 9 Tf");
  stream.push("0.1 0.15 0.2 rg");
  stream.push(`326 ${totalsY + 8} Td`);
  stream.push(`(${escapePdfText("TOTAL DEDUCTIONS:")}) Tj`);
  stream.push("ET");

  stream.push("BT");
  stream.push("/F2 9.5 Tf");
  stream.push("0.75 0.15 0.15 rg");
  stream.push(`465 ${totalsY + 8} Td`);
  stream.push(`(${escapePdfText(formatMoney(totalDeductions))}) Tj`);
  stream.push("ET");

  // 5. Prominent NET TAKE-HOME Salary Box (Emerald Gradient Style)
  const netBoxY = totalsY - 60;
  stream.push("q");
  stream.push("0.02 0.35 0.25 rg"); // Deep Emerald
  stream.push(`36 ${netBoxY} 540 44 re f`);
  stream.push("0.06 0.72 0.50 RG");
  stream.push("2 w");
  stream.push(`36 ${netBoxY} 540 44 re S`);
  stream.push("Q");

  stream.push("BT");
  stream.push("/F2 13 Tf");
  stream.push("1 1 1 rg");
  stream.push(`54 ${netBoxY + 16} Td`);
  stream.push(`(${escapePdfText("NET TAKE-HOME PAYABLE:")}) Tj`);
  stream.push("ET");

  stream.push("BT");
  stream.push("/F2 16 Tf");
  stream.push("0.4 1 0.7 rg"); // Light mint green
  stream.push(`340 ${netBoxY + 15} Td`);
  stream.push(`(${escapePdfText(formatMoney(netTotal))}) Tj`);
  stream.push("ET");

  // 6. Security & Legal Disclaimer Footer
  const footerY = 60;
  stream.push("q");
  stream.push("0.85 0.88 0.91 RG");
  stream.push("0.5 w");
  stream.push(`36 ${footerY + 30} m 576 ${footerY + 30} l S`);
  stream.push("Q");

  stream.push("BT");
  stream.push("/F1 7.5 Tf");
  stream.push("0.45 0.5 0.55 rg");
  stream.push(`36 ${footerY + 16} Td`);
  stream.push(
    `(${escapePdfText("This is a digitally generated payslip generated by PeoplePay360 Automated Payroll Platform. No physical signature required.")}) Tj`
  );
  stream.push("ET");

  stream.push("BT");
  stream.push("/F1 7.5 Tf");
  stream.push("0.45 0.5 0.55 rg");
  stream.push(`36 ${footerY + 4} Td`);
  stream.push(
    `(${escapePdfText(`Generated on ${new Date().toUTCString()} | Authentication ID: PAYSLIP-VERIFIED-${(payslip.id || "").slice(0, 8).toUpperCase()}`)}) Tj`
  );
  stream.push("380 0 Td");
  stream.push(`(${escapePdfText("Page 1 of 1")}) Tj`);
  stream.push("ET");

  // Compile Stream & PDF Objects
  const content = stream.join("\n");
  const contentLength = new TextEncoder().encode(content).length;

  const objects = [
    // 1: Catalog
    "<< /Type /Catalog /Pages 2 0 R >>",
    // 2: Pages Collection
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    // 3: Page Definition
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> /Contents 4 0 R >>",
    // 4: Content Stream
    `<< /Length ${contentLength} >>\nstream\n${content}\nendstream`,
    // 5: Helvetica Regular
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    // 6: Helvetica Bold
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    // 7: Courier Mono
    "<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n `)
    .join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}
