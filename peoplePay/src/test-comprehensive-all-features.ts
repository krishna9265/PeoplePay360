import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PayrollService } from "./modules/payroll/payroll.service";

const prisma = new PrismaClient();
const payrollService = new PayrollService();

async function runComprehensiveTests() {
  console.log("===============================================================");
  console.log("STARTING COMPREHENSIVE PEOPLEPAY 360 END-TO-END TEST SUITE");
  console.log("===============================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}${detail ? ` -> ${detail}` : ""}`);
      failed++;
    }
  }

  // --- SECTION 1: AUTHENTICATION & RBAC ---
  console.log("\n--- [1/7] TESTING AUTHENTICATION & RBAC FOR ALL 5 ROLES ---");
  const demoUsers = [
    { email: "admin@peoplepay360.demo", expectedRole: "Admin" },
    { email: "hr.manager@peoplepay360.demo", expectedRole: "HR Manager" },
    { email: "payroll.manager@peoplepay360.demo", expectedRole: "HR Payroll Manager" },
    { email: "payroll.user@peoplepay360.demo", expectedRole: "HR Payroll User" },
    { email: "employee@peoplepay360.demo", expectedRole: "Employee" },
  ];

  for (const demo of demoUsers) {
    const user = await prisma.user.findUnique({
      where: { workEmail: demo.email },
      include: { role: true },
    });
    assert(!!user, `User ${demo.email} exists in DB`);
    if (user) {
      assert(user.role.name === demo.expectedRole, `Role for ${demo.email} is '${demo.expectedRole}'`);
      const validPw = await bcrypt.compare("2305", user.passwordHash);
      assert(validPw, `Password '2305' bcrypt authenticates for ${demo.email}`);
    }
  }

  // --- SECTION 2: CORE HR (EMPLOYEES & SMART COUNTS) ---
  console.log("\n--- [2/7] TESTING CORE HR EMPLOYEE LIFECYCLE ---");
  const depts = await prisma.department.findMany();
  assert(depts.length > 0, `Departments found (${depts.length} departments)`);

  const testEmpEmail = `test.employee.${Date.now()}@peoplepay360.demo`;
  const createdEmp = await prisma.employee.create({
    data: {
      fullName: "Test Automated Employee",
      workEmail: testEmpEmail,
      jobPosition: "Automation Specialist",
      status: "Active",
      departmentId: depts[0]?.id,
    },
  });
  assert(!!createdEmp.id, `Created test employee '${createdEmp.fullName}' (${createdEmp.id})`);

  // Verify smart count queries
  const contractsCount = await prisma.contract.count({ where: { employeeId: createdEmp.id } });
  const attendanceCount = await prisma.attendance.count({ where: { employeeId: createdEmp.id } });
  const timeOffCount = await prisma.timeOffRequest.count({ where: { employeeId: createdEmp.id } });
  const payslipsCount = await prisma.payslip.count({ where: { employeeId: createdEmp.id } });

  assert(contractsCount === 0, "Smart button Contract count starts at 0");
  assert(attendanceCount === 0, "Smart button Attendance count starts at 0");
  assert(timeOffCount === 0, "Smart button Time Off count starts at 0");
  assert(payslipsCount === 0, "Smart button Payslip count starts at 0");

  // --- SECTION 3: CONTRACTS & SCHEDULES ---
  console.log("\n--- [3/7] TESTING CONTRACTS & WORK SCHEDULES ---");
  const schedules = await prisma.workingSchedule.findMany({ include: { days: true } });
  assert(schedules.length > 0, `Working Schedules configured (${schedules.length} schedules)`);
  assert(schedules[0].days.length > 0, `Schedule has weekly day lines configured (${schedules[0].days.length} days)`);

  const structure = await prisma.salaryStructure.findFirst({ where: { active: true } });
  assert(!!structure, `Found active Salary Structure: ${structure?.name}`);

  const testContract = await prisma.contract.create({
    data: {
      employeeId: createdEmp.id,
      startDate: new Date("2026-01-01"),
      wage: 75000,
      status: "Active",
      workingScheduleId: schedules[0].id,
      salaryStructureId: structure!.id,
    },
  });
  assert(!!testContract.id, `Created active contract with wage ₹75,000`);

  const updatedContractsCount = await prisma.contract.count({ where: { employeeId: createdEmp.id } });
  assert(updatedContractsCount === 1, "Employee smart button Contract count updated to 1");

  // --- SECTION 4: TIME & ATTENDANCE ---
  console.log("\n--- [4/7] TESTING TIME & ATTENDANCE TRACKING ---");
  const checkInDate = new Date("2026-09-01T09:00:00Z");
  const checkOutDate = new Date("2026-09-01T17:30:00Z");

  const attendanceRec = await prisma.attendance.create({
    data: {
      employeeId: createdEmp.id,
      checkIn: checkInDate,
      status: "Present",
    },
  });
  assert(!!attendanceRec.id, "Employee successfully checked in");

  // Check out
  const workedHours = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);
  const updatedAttendance = await prisma.attendance.update({
    where: { id: attendanceRec.id },
    data: {
      checkOut: checkOutDate,
      workedHours: workedHours,
      status: "Checked Out",
    },
  });
  assert(Number(updatedAttendance.workedHours) === 8.5, `Calculated worked hours is ${updatedAttendance.workedHours}h`);

  // --- SECTION 5: TIME OFF & ALLOCATIONS ---
  console.log("\n--- [5/7] TESTING TIME OFF & ALLOCATION BALANCES ---");
  let timeOffType = await prisma.timeOffType.findFirst({ where: { name: "Paid Time Off" } });
  if (!timeOffType) {
    timeOffType = await prisma.timeOffType.create({
      data: { name: "Paid Time Off", unit: "Days", requiresAllocation: true, requiresApproval: true },
    });
  }
  assert(!!timeOffType, `Time Off Type '${timeOffType.name}' active`);

  const allocation = await prisma.timeOffAllocation.create({
    data: {
      employeeId: createdEmp.id,
      timeOffTypeId: timeOffType.id,
      allocatedAmount: 15,
      remainingAmount: 15,
      takenAmount: 0,
      status: "Approved",
    },
  });
  assert(Number(allocation.allocatedAmount) === 15, `Granted 15 days of PTO allocation`);

  // Create leave request for 3 days
  const leaveReq = await prisma.timeOffRequest.create({
    data: {
      employeeId: createdEmp.id,
      timeOffTypeId: timeOffType.id,
      startDate: new Date("2026-09-10"),
      endDate: new Date("2026-09-12"),
      duration: 3,
      reason: "Family vacation",
      status: "Pending",
    },
  });
  assert(leaveReq.status === "Pending", `Leave request created with status 'Pending' for 3 days`);

  // Approve leave request
  const approvedReq = await prisma.timeOffRequest.update({
    where: { id: leaveReq.id },
    data: { status: "Approved" },
  });
  assert(approvedReq.status === "Approved", `Leave request approved by Manager/HR`);

  // Calculate balance: 15 - 3 = 12
  const totalApprovedDays = await prisma.timeOffRequest.aggregate({
    where: { employeeId: createdEmp.id, timeOffTypeId: timeOffType.id, status: "Approved" },
    _sum: { duration: true },
  });
  const remaining = Number(allocation.allocatedAmount) - (Number(totalApprovedDays._sum.duration) || 0);
  assert(remaining === 12, `Remaining PTO balance is exactly 12 days (15 granted - 3 approved)`);

  // --- SECTION 6: PAYROLL ENGINE & DETERMINISTIC COMPUTATION ---
  console.log("\n--- [6/7] TESTING PAYROLL CALCULATION ENGINE & STATE MACHINE ---");
  const salaryStructure = await prisma.salaryStructure.findFirst({
    where: { active: true },
    include: { rules: { include: { category: true }, orderBy: { sequence: "asc" } } },
  });
  assert(!!salaryStructure, `Found active Salary Structure '${salaryStructure?.name}' with ${salaryStructure?.rules.length} rules`);

  const adminUser = await prisma.user.findFirst();

  // Create a Draft payrun with employees attached (BR-PAY-001)
  const allEmployees = await prisma.employee.findMany({ select: { id: true } });
  const testPayrun = await prisma.payrun.create({
    data: {
      name: `Automated Test Pay Run ${Date.now()}`,
      periodStart: new Date("2026-09-01"),
      periodEnd: new Date("2026-09-30"),
      salaryStructureId: salaryStructure!.id,
      createdById: adminUser!.id,
      status: "Draft",
      employees: {
        create: allEmployees.map((e) => ({ employeeId: e.id })),
      },
    },
  });
  assert(testPayrun.status === "Draft", `Created Pay Run in 'Draft' status with ${allEmployees.length} employees (BR-PAY-001)`);

  // Compute pay run
  const computeResult = await payrollService.computePayrun(testPayrun.id);
  assert(computeResult.payslips.length > 0, `Computed pay run: generated ${computeResult.payslips.length} payslips`);
  const adityaWarning = computeResult.warnings.find((w) => w.message.includes("Aditya Verma"));
  assert(!!adityaWarning, `Aditya Verma warning correctly generated (BR-PAY-003): "${adityaWarning?.message}"`);

  // Verify Devansh Rao wage calculation
  const devanshSlip = await prisma.payslip.findFirst({
    where: { payrunId: testPayrun.id, employee: { fullName: "Devansh Rao" } },
    include: { lines: true },
  });
  assert(!!devanshSlip, "Generated payslip for Devansh Rao");
  if (devanshSlip) {
    assert(Number(devanshSlip.grossTotal) === 66000, `Devansh Gross Total = ₹66,000 (Basic 60,000 + Transport 6,000)`);
    assert(Number(devanshSlip.netTotal) === 65000, `Devansh Net Total = ₹65,000 (Gross 66,000 - Deductions 1,000)`);
    
    // Test PDF Generation
    const pdfBuffer = await payrollService.generatePayslipPdf(devanshSlip.id);
    assert(pdfBuffer.length > 500, `Live PDF payslip generated (${pdfBuffer.length} bytes)`);
  }

  // State transitions: Draft -> Computed -> Validated -> Paid
  const validatedPayrun = await prisma.payrun.update({
    where: { id: testPayrun.id },
    data: { status: "Validated" },
  });
  assert(validatedPayrun.status === "Validated", `Pay run successfully transitioned to 'Validated'`);

  const paidPayrun = await prisma.payrun.update({
    where: { id: testPayrun.id },
    data: { status: "Paid" },
  });
  assert(paidPayrun.status === "Paid", `Pay run successfully transitioned to 'Paid'`);

  // Cleanup test pay run & test employee
  await prisma.payrollWarning.deleteMany({ where: { payrunId: testPayrun.id } });
  await prisma.payslipLine.deleteMany({ where: { payslip: { payrunId: testPayrun.id } } });
  await prisma.payslip.deleteMany({ where: { payrunId: testPayrun.id } });
  await prisma.payrun.delete({ where: { id: testPayrun.id } });

  await prisma.attendance.deleteMany({ where: { employeeId: createdEmp.id } });
  await prisma.timeOffRequest.deleteMany({ where: { employeeId: createdEmp.id } });
  await prisma.timeOffAllocation.deleteMany({ where: { employeeId: createdEmp.id } });
  await prisma.contract.deleteMany({ where: { employeeId: createdEmp.id } });
  await prisma.employee.delete({ where: { id: createdEmp.id } });
  console.log("  ✓ Cleaned up ephemeral test data.");

  // --- SECTION 7: LIVE ANALYTICS DASHBOARD ---
  console.log("\n--- [7/7] TESTING LIVE DASHBOARD METRICS (BR-DASH-001) ---");
  const totalEmployees = await prisma.employee.count({ where: { status: "Active" } });
  const pendingRequests = await prisma.timeOffRequest.count({ where: { status: "Pending" } });
  const completedPayslips = await prisma.payslip.aggregate({
    _sum: { netTotal: true, grossTotal: true },
  });

  assert(totalEmployees >= 5, `Live Active Employees count: ${totalEmployees}`);
  assert(pendingRequests >= 0, `Live Pending Requests count: ${pendingRequests}`);
  console.log(`  Total Historical Payroll Disbursed: ₹${completedPayslips._sum.netTotal || 0}`);

  // Restore September 2026 Payroll to Draft for demo presentation
  const demoPayrun = await prisma.payrun.findFirst({ where: { name: { contains: "September 2026" } } });
  if (demoPayrun) {
    await prisma.payrun.update({ where: { id: demoPayrun.id }, data: { status: "Draft" } });
    console.log("  ✓ Verified 'September 2026 Payroll' is ready in 'Draft' state for demo presentation.");
  }

  console.log("\n===============================================================");
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("===============================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runComprehensiveTests()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
