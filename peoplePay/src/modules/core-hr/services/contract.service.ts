import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ContractService {
  static async getAllContracts() {
    return await prisma.contract.findMany({
      include: {
        employee: true,
        department: true,
        workingSchedule: true,
        salaryStructure: true,
      },
      orderBy: { startDate: "desc" },
    });
  }

  static async getContractsByEmployee(employeeId: string) {
    return await prisma.contract.findMany({
      where: { employeeId },
      include: {
        department: true,
        workingSchedule: true,
        salaryStructure: true,
      },
      orderBy: { startDate: "desc" },
    });
  }

  static async createContract(data: any) {
    const { employeeId, startDate, endDate, wage } = data;
    if (!employeeId) {
      throw new Error("Employee ID is required.");
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!employee) {
      throw new Error("Selected employee does not exist.");
    }

    // Default salary structure if not provided
    let salaryStructureId = data.salaryStructureId;
    if (!salaryStructureId) {
      const defaultStructure = await prisma.salaryStructure.findFirst({
        where: { active: true },
      });
      salaryStructureId = defaultStructure?.id;
    }
    if (!salaryStructureId) {
      throw new Error("No active salary structure found. Please create one first.");
    }

    // Default working schedule if not provided
    let workingScheduleId = data.workingScheduleId || employee.workingScheduleId;
    if (!workingScheduleId) {
      const defaultSchedule = await prisma.workingSchedule.findFirst();
      workingScheduleId = defaultSchedule?.id;
    }
    if (!workingScheduleId) {
      throw new Error("No working schedule found. Please create one first.");
    }

    // Convert to Date objects for comparison
    const targetStart = new Date(startDate);
    const targetEnd = endDate ? new Date(endDate) : null;

    // BR-CON-002: Detect overlap only for Active contracts
    const contractStatus = data.status || "Active";
    if (contractStatus === "Active") {
      const existingContracts = await prisma.contract.findMany({
        where: { employeeId, status: "Active" },
      });

      for (const contract of existingContracts) {
        const existingStart = new Date(contract.startDate);
        const existingEnd = contract.endDate ? new Date(contract.endDate) : null;

        // Check overlap
        const startsBeforeTargetEnds = !targetEnd || existingStart <= targetEnd;
        const endsAfterTargetStarts = !existingEnd || existingEnd >= targetStart;

        if (startsBeforeTargetEnds && endsAfterTargetStarts) {
          throw new Error("BR-CON-002: Overlapping active contract detected for this employee. Please end or expire the existing active contract first.");
        }
      }
    }

    return await prisma.contract.create({
      data: {
        employeeId,
        salaryStructureId,
        workingScheduleId,
        departmentId: data.departmentId || employee.departmentId,
        wage: Number(wage) || 0,
        startDate: targetStart,
        endDate: targetEnd,
        status: data.status || "Active",
      },
      include: {
        employee: true,
        department: true,
        workingSchedule: true,
        salaryStructure: true,
      },
    });
  }

  // BR-CON-001: Resolve applicable contract for a payroll period
  static async resolveApplicableContract(employeeId: string, periodStart: Date, periodEnd: Date) {
    const contracts = await prisma.contract.findMany({
      where: { employeeId, status: { in: ["Active", "Expired"] } },
      orderBy: { startDate: "desc" },
    });

    for (const contract of contracts) {
      const contractStart = new Date(contract.startDate);
      const contractEnd = contract.endDate ? new Date(contract.endDate) : null;

      // The contract must have started on or before the period ends
      // And must end on or after the period starts (or have no end date)
      if (contractStart <= periodEnd && (!contractEnd || contractEnd >= periodStart)) {
        return contract;
      }
    }

    return null; // No applicable contract found
  }
}
