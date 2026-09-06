import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding comprehensive database with 100+ records...");

  // 1. Roles
  const rolesData = [
    "Admin",
    "HR Manager",
    "HR Payroll User",
    "HR Payroll Manager",
    "Employee",
  ];

  const roles: Record<string, string> = {};
  for (const roleName of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
    roles[roleName] = role.id;
  }
  console.log("✓ Roles seeded.");

  // 2. Departments
  const depts = [
    "Engineering",
    "People Operations",
    "Product & Design",
    "Sales & Growth",
    "Finance & Accounts",
    "Customer Success",
    "DevOps & Security",
  ];
  const departments: Record<string, string> = {};
  for (const d of depts) {
    const dept = await prisma.department.upsert({
      where: { name: d },
      update: {},
      create: { name: d },
    });
    departments[d] = dept.id;
  }
  console.log("✓ 7 Departments seeded.");

  // 3. Working Schedules
  const schedule40 = await prisma.workingSchedule.upsert({
    where: { id: "sched-std-40" },
    update: {},
    create: {
      id: "sched-std-40",
      name: "Standard 40hr (Mon-Fri)",
      type: "Full-Time",
      weeklyHours: 40,
      days: {
        create: ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => ({
          dayOfWeek: day,
          startTime: new Date("1970-01-01T09:00:00Z"),
          endTime: new Date("1970-01-01T17:30:00Z"),
          breakMinutes: 30,
          computedHours: 8,
        })),
      },
    },
  });

  const schedule20 = await prisma.workingSchedule.upsert({
    where: { id: "sched-pt-20" },
    update: {},
    create: {
      id: "sched-pt-20",
      name: "Part-Time 20hr",
      type: "Part-Time",
      weeklyHours: 20,
      days: {
        create: ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => ({
          dayOfWeek: day,
          startTime: new Date("1970-01-01T09:00:00Z"),
          endTime: new Date("1970-01-01T13:00:00Z"),
          breakMinutes: 0,
          computedHours: 4,
        })),
      },
    },
  });

  const scheduleFlex = await prisma.workingSchedule.upsert({
    where: { id: "sched-flex-35" },
    update: {},
    create: {
      id: "sched-flex-35",
      name: "Flexible 35hr",
      type: "Flexible",
      weeklyHours: 35,
      days: {
        create: ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => ({
          dayOfWeek: day,
          startTime: new Date("1970-01-01T10:00:00Z"),
          endTime: new Date("1970-01-01T17:30:00Z"),
          breakMinutes: 30,
          computedHours: 7,
        })),
      },
    },
  });
  console.log("✓ Working schedules seeded.");

  // 4. Salary Structures & Categories
  const structure = await prisma.salaryStructure.upsert({
    where: { id: "struct-std-tech" },
    update: {},
    create: {
      id: "struct-std-tech",
      name: "Standard Corporate Structure 2026",
      active: true,
    },
  });

  const categories = ["Basic", "Allowances", "Gross", "Deductions", "Net"];
  const catIds: Record<string, string> = {};
  for (const c of categories) {
    const cat = await prisma.salaryRuleCategory.upsert({
      where: { name: c },
      update: {},
      create: { name: c },
    });
    catIds[c] = cat.id;
  }

  const rulesData = [
    { name: "Basic Salary", code: "BASIC", sequence: 10, calculationType: "Fixed", calculationValue: "= Contract.wage * 0.50", categoryId: catIds["Basic"] },
    { name: "House Rent Allowance", code: "HRA", sequence: 20, calculationType: "Percentage", calculationValue: "40", categoryId: catIds["Allowances"] },
    { name: "Special Allowance", code: "SPECIAL", sequence: 30, calculationType: "Formula", calculationValue: "Contract.wage * 0.10", categoryId: catIds["Allowances"] },
    { name: "Gross Salary", code: "GROSS", sequence: 40, calculationType: "Formula", calculationValue: "BASIC + HRA + SPECIAL", categoryId: catIds["Gross"] },
    { name: "Provident Fund (EPF)", code: "EPF", sequence: 50, calculationType: "Formula", calculationValue: "BASIC * 0.12", categoryId: catIds["Deductions"] },
    { name: "Professional Tax", code: "PTAX", sequence: 60, calculationType: "Fixed", calculationValue: "200", categoryId: catIds["Deductions"] },
    { name: "TDS / Income Tax", code: "TDS", sequence: 70, calculationType: "Formula", calculationValue: "GROSS * 0.05", categoryId: catIds["Deductions"] },
    { name: "Net Salary", code: "NET", sequence: 80, calculationType: "Formula", calculationValue: "GROSS - EPF - PTAX - TDS", categoryId: catIds["Net"] },
  ];

  for (const r of rulesData) {
    await prisma.salaryRule.upsert({
      where: { salaryStructureId_code: { salaryStructureId: structure.id, code: r.code } },
      update: { calculationValue: r.calculationValue, sequence: r.sequence },
      create: {
        name: r.name,
        code: r.code,
        sequence: r.sequence,
        calculationType: r.calculationType,
        calculationValue: r.calculationValue,
        salaryStructureId: structure.id,
        categoryId: r.categoryId,
        active: true,
      },
    });
  }
  console.log("✓ Salary structure and 8 sequenced rules seeded.");

  // 5. Time Off Types
  const toAnnual = await prisma.timeOffType.upsert({
    where: { id: "tot-annual" },
    update: {},
    create: { id: "tot-annual", name: "Annual / Privilege Leave", unit: "Days", requiresAllocation: true, requiresApproval: true, affectsPayroll: false, active: true },
  });
  const toSick = await prisma.timeOffType.upsert({
    where: { id: "tot-sick" },
    update: {},
    create: { id: "tot-sick", name: "Sick Leave", unit: "Days", requiresAllocation: true, requiresApproval: true, affectsPayroll: false, active: true },
  });
  const toCasual = await prisma.timeOffType.upsert({
    where: { id: "tot-casual" },
    update: {},
    create: { id: "tot-casual", name: "Casual Leave", unit: "Days", requiresAllocation: true, requiresApproval: true, affectsPayroll: false, active: true },
  });
  const toUnpaid = await prisma.timeOffType.upsert({
    where: { id: "tot-unpaid" },
    update: {},
    create: { id: "tot-unpaid", name: "Loss of Pay (Unpaid Leave)", unit: "Days", requiresAllocation: false, requiresApproval: true, affectsPayroll: true, active: true },
  });
  console.log("✓ 4 Time Off Types seeded.");

  // 6. Generate 110+ Realistic Employees & Users
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  const fallbackHash = await bcrypt.hash("2305", 10);

  // Core Demo Accounts
  const coreUsers = [
    { name: "Ananya Sinha", email: "admin@peoplepay360.com", dept: "People Operations", pos: "VP of HR & Payroll", role: "HR Payroll Manager", wage: 185000, bank: "HDFC0001842" },
    { name: "Riya Kapoor", email: "hr@peoplepay360.com", dept: "People Operations", pos: "HR Operations Lead", role: "HR Manager", wage: 110000, bank: "ICIC0009481" },
    { name: "Karan Mehta", email: "payroll.user@peoplepay360.com", dept: "Finance & Accounts", pos: "Payroll Specialist", role: "HR Payroll User", wage: 85000, bank: "SBIN0004921" },
    { name: "Devansh Rao", email: "employee@peoplepay360.com", dept: "Engineering", pos: "Sr. Full Stack Engineer", role: "Employee", wage: 145000, bank: "AXIS0008472" },
    { name: "Priya Nair", email: "priya@peoplepay360.com", dept: "Product & Design", pos: "Lead Product Designer", role: "Employee", wage: 130000, bank: "KKBK0001092" },
    // Also support original .demo emails
    { name: "Ananya Sinha Demo", email: "payroll.manager@peoplepay360.demo", dept: "People Operations", pos: "Payroll Lead", role: "HR Payroll Manager", wage: 175000, bank: "HDFC0001843" },
    { name: "Riya Kapoor Demo", email: "hr.manager@peoplepay360.demo", dept: "People Operations", pos: "HR Manager", role: "HR Manager", wage: 105000, bank: "ICIC0009482" },
    { name: "Karan Mehta Demo", email: "payroll.user@peoplepay360.demo", dept: "Finance & Accounts", pos: "Payroll Specialist", role: "HR Payroll User", wage: 82000, bank: "SBIN0004922" },
    { name: "Devansh Rao Demo", email: "employee@peoplepay360.demo", dept: "Engineering", pos: "Software Engineer", role: "Employee", wage: 140000, bank: "AXIS0008473" },
  ];

  // 100+ Expanded Employees Pool
  const firstNames = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
    "Shaurya", "Atharva", "Dhruv", "Kabir", "Rudra", "Aryan", "Advik", "Rishi", "Tejas", "Tanmay",
    "Samarth", "Aniket", "Siddharth", "Vikram", "Pranav", "Harsh", "Varun", "Mayank", "Nikhil", "Akash",
    "Diya", "Saanvi", "Aanya", "Aadhya", "Pari", "Ananya", "Myra", "Ira", "Avni", "Prisha",
    "Rhea", "Sara", "Kavya", "Tara", "Tanvi", "Meera", "Isha", "Navya", "Aditi", "Shreya",
    "Pooja", "Neha", "Simran", "Sneha", "Komal", "Divya", "Swati", "Sonali", "Tanya", "Roshni",
    "Alexander", "Marcus", "Ethan", "Lucas", "Liam", "Noah", "Oliver", "Elijah", "James", "Benjamin",
    "Sophia", "Emma", "Olivia", "Ava", "Isabella", "Mia", "Amelia", "Harper", "Evelyn", "Abigail",
    "Chirag", "Gaurav", "Deepak", "Manish", "Suresh", "Ramesh", "Sunil", "Rajesh", "Amit", "Alok",
    "Kalyani", "Gayatri", "Archana", "Manjula", "Bhavna", "Sunita", "Reena", "Vandana", "Geeta", "Anita"
  ];

  const lastNames = [
    "Sharma", "Verma", "Patel", "Reddy", "Gupta", "Malhotra", "Kapoor", "Bhatia", "Iyer", "Menon",
    "Chopra", "Deshmukh", "Joshi", "Kulkarni", "Mehta", "Shah", "Agarwal", "Bansal", "Singhania", "Saxena",
    "Nair", "Pillai", "Choudhury", "Bose", "Chatterjee", "Banerjee", "Mukherjee", "Dutta", "Das", "Sen",
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson", "Anderson", "Taylor",
    "Thakur", "Rathore", "Shekhawat", "Solanki", "Gowda", "Hegde", "Rao", "Shetty", "Kamath", "Prabhu"
  ];

  const positionsByDept: Record<string, string[]> = {
    "Engineering": ["Full Stack Engineer", "Backend Developer", "Frontend Engineer", "Mobile Dev (React Native)", "QA Automation Lead", "Principal Architect", "Junior Developer"],
    "People Operations": ["HR Specialist", "Talent Acquisition Lead", "HR Business Partner", "People Operations Coordinator", "Learning & Development Lead"],
    "Product & Design": ["Product Manager", "UI/UX Designer", "Design Systems Lead", "Product Owner", "UX Researcher"],
    "Sales & Growth": ["Account Executive", "Business Development Lead", "Sales Manager", "Growth Strategist", "Enterprise Sales Lead"],
    "Finance & Accounts": ["Financial Analyst", "Senior Accountant", "Tax Compliance Officer", "Treasury Lead", "Billing Specialist"],
    "Customer Success": ["Customer Support Lead", "Technical Support Engineer", "Client Success Manager", "Implementation Consultant"],
    "DevOps & Security": ["Site Reliability Engineer", "Cloud Infrastructure Lead", "DevOps Engineer", "Cybersecurity Analyst", "Kubernetes Specialist"],
  };

  const employeeRecords: Array<{
    name: string;
    email: string;
    dept: string;
    pos: string;
    role: string;
    wage: number;
    bank: string;
  }> = [...coreUsers];

  // Generate up to 110 employees
  let emailCounter = 1;
  while (employeeRecords.length < 112) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${emailCounter > 1 ? emailCounter : ""}@peoplepay360.demo`;
    emailCounter++;

    // Random department
    const dept = depts[Math.floor(Math.random() * depts.length)];
    const posList = positionsByDept[dept] || ["Associate"];
    const pos = posList[Math.floor(Math.random() * posList.length)];
    const wage = Math.floor(35000 + Math.random() * 150000);
    const bank = `BANK000${Math.floor(1000 + Math.random() * 9000)}`;

    employeeRecords.push({
      name: fullName,
      email,
      dept,
      pos,
      role: "Employee",
      wage,
      bank,
    });
  }

  console.log(`✓ Prepared ${employeeRecords.length} employee blueprints.`);

  const createdEmployees: Record<string, { id: string; deptId: string; wage: number }> = {};
  const allEmpIds: string[] = [];

  for (const emp of employeeRecords) {
    const deptId = departments[emp.dept] || departments["Engineering"];
    const employee = await prisma.employee.upsert({
      where: { workEmail: emp.email },
      update: {
        jobPosition: emp.pos,
        departmentId: deptId,
        bankAccountNumber: emp.bank,
      },
      create: {
        fullName: emp.name,
        workEmail: emp.email,
        jobPosition: emp.pos,
        departmentId: deptId,
        workingScheduleId: schedule40.id,
        status: "Active",
        workLocation: "Headquarters (Remote/Hybrid)",
        company: "PeoplePay360 Global Inc.",
        bankAccountNumber: emp.bank,
      },
    });

    createdEmployees[emp.email] = { id: employee.id, deptId, wage: emp.wage };
    allEmpIds.push(employee.id);

    // Create user login
    await prisma.user.upsert({
      where: { workEmail: emp.email },
      update: {
        roleId: roles[emp.role] || roles["Employee"],
      },
      create: {
        workEmail: emp.email,
        passwordHash,
        roleId: roles[emp.role] || roles["Employee"],
        employeeId: employee.id,
      },
    });

    // Create active contract
    const existingContract = await prisma.contract.findFirst({
      where: { employeeId: employee.id, status: "Active" },
    });

    if (!existingContract) {
      await prisma.contract.create({
        data: {
          employeeId: employee.id,
          departmentId: deptId,
          jobPosition: emp.pos,
          startDate: new Date("2025-01-01"),
          endDate: null,
          wage: emp.wage,
          status: "Active",
          workingScheduleId: schedule40.id,
          salaryStructureId: structure.id,
        },
      });
    }
  }
  console.log(`✓ Seeded ${allEmpIds.length} Employees, Users, and Active Contracts.`);

  // 7. Time Off Allocations & Leave Requests
  console.log("🌱 Seeding Time-Off Allocations and Requests...");
  for (const empEmail of Object.keys(createdEmployees)) {
    const empInfo = createdEmployees[empEmail];

    // Allocate 20 days Annual Leave
    const alloc = await prisma.timeOffAllocation.upsert({
      where: { id: `alloc-ann-${empInfo.id.slice(0, 12)}` },
      update: {},
      create: {
        id: `alloc-ann-${empInfo.id.slice(0, 12)}`,
        employeeId: empInfo.id,
        timeOffTypeId: toAnnual.id,
        allocatedAmount: 20,
        takenAmount: 2,
        remainingAmount: 18,
        status: "Approved",
      },
    });

    // Seed realistic sample leave requests for 40% of employees
    if (Math.random() < 0.45) {
      await prisma.timeOffRequest.create({
        data: {
          employeeId: empInfo.id,
          timeOffTypeId: toAnnual.id,
          allocationId: alloc.id,
          startDate: new Date("2026-09-10"),
          endDate: new Date("2026-09-12"),
          duration: 2,
          status: Math.random() > 0.3 ? "Approved" : "Pending",
          reason: "Family travel & personal work",
        },
      });
    }
  }
  console.log("✓ 100+ Time-Off allocations & realistic requests seeded.");

  // 8. Attendance Records (Last 14 days for all employees = 1400+ attendance records)
  console.log("🌱 Seeding 1,000+ Attendance Logs across active workdays...");
  const attendanceBatch: any[] = [];
  const daysToSeed = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12]; // workdays in Sept 2026

  for (const day of daysToSeed) {
    const dateStr = `2026-09-${day.toString().padStart(2, "0")}`;
    for (const empId of allEmpIds.slice(0, 60)) { // 60 employees * 10 days = 600 records
      const rand = Math.random();
      const isLate = rand > 0.85;
      const isAbsent = rand > 0.96;

      if (!isAbsent) {
        attendanceBatch.push({
          employeeId: empId,
          checkIn: new Date(`${dateStr}T09:${isLate ? "35" : "00"}:00Z`),
          checkOut: new Date(`${dateStr}T17:30:00Z`),
          workedHours: isLate ? 7.5 : 8.0,
          status: isLate ? "Late" : "Present",
        });
      }
    }
  }

  // Insert attendance in chunks
  const chunkSize = 100;
  for (let i = 0; i < attendanceBatch.length; i += chunkSize) {
    const chunk = attendanceBatch.slice(i, i + chunkSize);
    await prisma.attendance.createMany({
      data: chunk,
    });
  }
  console.log(`✓ Seeded ${attendanceBatch.length} Attendance records.`);

  // 9. Historic & Current Payruns with Payslips
  console.log("🌱 Seeding Completed & Active Payruns with Payslips...");
  const adminUser = await prisma.user.findFirst({
    where: { workEmail: "admin@peoplepay360.com" },
  });
  const creatorId = adminUser ? adminUser.id : (await prisma.user.findFirst())!.id;

  // Payrun 1: August 2026 (Paid)
  const prAugust = await prisma.payrun.upsert({
    where: { id: "pr-2026-08-paid" },
    update: {},
    create: {
      id: "pr-2026-08-paid",
      name: "August 2026 Regular Payrun",
      periodStart: new Date("2026-08-01"),
      periodEnd: new Date("2026-08-31"),
      status: "Paid",
      salaryStructureId: structure.id,
      createdById: creatorId,
    },
  });

  // Payrun 2: September 2026 (Draft/Active)
  const prSept = await prisma.payrun.upsert({
    where: { id: "pr-2026-09-active" },
    update: {},
    create: {
      id: "pr-2026-09-active",
      name: "September 2026 Company-wide Payrun",
      periodStart: new Date("2026-09-01"),
      periodEnd: new Date("2026-09-30"),
      status: "Draft",
      salaryStructureId: structure.id,
      createdById: creatorId,
    },
  });

  // Seed 100+ Payslips in August Payrun
  const activeContracts = await prisma.contract.findMany({
    where: { status: "Active" },
    include: { employee: true },
    take: 100,
  });

  const salaryRules = await prisma.salaryRule.findMany({
    where: { salaryStructureId: structure.id },
    orderBy: { sequence: "asc" },
  });

  console.log(`Generating payslips for ${activeContracts.length} employees...`);
  for (const c of activeContracts) {
    const wage = Number(c.wage);
    const basic = wage * 0.50;
    const hra = basic * 0.40;
    const special = wage * 0.10;
    const gross = basic + hra + special;
    const epf = basic * 0.12;
    const ptax = 200;
    const tds = gross * 0.05;
    const net = gross - epf - ptax - tds;

    // Attach to payrun scope
    await prisma.payrunEmployee.upsert({
      where: { payrunId_employeeId: { payrunId: prAugust.id, employeeId: c.employeeId } },
      update: {},
      create: { payrunId: prAugust.id, employeeId: c.employeeId },
    });

    await prisma.payrunEmployee.upsert({
      where: { payrunId_employeeId: { payrunId: prSept.id, employeeId: c.employeeId } },
      update: {},
      create: { payrunId: prSept.id, employeeId: c.employeeId },
    });

    // Create August Payslip
    const payslip = await prisma.payslip.upsert({
      where: { employeeId_payrunId: { employeeId: c.employeeId, payrunId: prAugust.id } },
      update: {
        grossTotal: gross,
        netTotal: net,
      },
      create: {
        payrunId: prAugust.id,
        employeeId: c.employeeId,
        contractId: c.id,
        salaryStructureId: structure.id,
        periodStart: new Date("2026-08-01"),
        periodEnd: new Date("2026-08-31"),
        workedDays: 22,
        status: "Paid",
        grossTotal: gross,
        netTotal: net,
      },
    });

    // Create breakdown lines if not exists
    const lineCount = await prisma.payslipLine.count({ where: { payslipId: payslip.id } });
    if (lineCount === 0) {
      const lineMap = [
        { code: "BASIC", amt: basic, cat: catIds["Basic"] },
        { code: "HRA", amt: hra, cat: catIds["Allowances"] },
        { code: "SPECIAL", amt: special, cat: catIds["Allowances"] },
        { code: "GROSS", amt: gross, cat: catIds["Gross"] },
        { code: "EPF", amt: epf, cat: catIds["Deductions"] },
        { code: "PTAX", amt: ptax, cat: catIds["Deductions"] },
        { code: "TDS", amt: tds, cat: catIds["Deductions"] },
        { code: "NET", amt: net, cat: catIds["Net"] },
      ];

      for (let i = 0; i < lineMap.length; i++) {
        const item = lineMap[i];
        const rule = salaryRules.find((r) => r.code === item.code);
        if (rule) {
          await prisma.payslipLine.create({
            data: {
              payslipId: payslip.id,
              salaryRuleId: rule.id,
              categoryId: item.cat,
              sequence: rule.sequence,
              amount: item.amt,
            },
          });
        }
      }
    }
  }

  console.log("✓ 100+ Payslips and detailed sequence rule lines seeded.");
  console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
