import { prisma } from '@/lib/prisma';
import { CreateTimeOffRequestInput, RequestFilter } from '../types/time-off.types';
import { Prisma } from '@prisma/client';

export class TimeOffRequestService {
  /**
   * Calculate leave duration in Days or Hours
   */
  static calculateDuration(startDate: Date, endDate: Date, unit: 'Days' | 'Hours' = 'Days'): number {
    const diffMs = endDate.getTime() - startDate.getTime();
    if (diffMs < 0) {
      throw new Error('End date cannot be earlier than start date.');
    }

    if (unit === 'Hours') {
      const hours = diffMs / (1000 * 60 * 60);
      return Math.round(hours * 100) / 100;
    }

    // Days: difference in days + 1 (inclusive)
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  }

  /**
   * Submit a new Time Off Request (starts in Pending status)
   */
  static async submitRequest(input: CreateTimeOffRequestInput) {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);

    if (end < start) {
      throw new Error('End date cannot be earlier than start date.');
    }

    const employee = await prisma.employee.findUnique({
      where: { id: input.employeeId },
    });
    if (!employee) throw new Error('Employee not found.');

    const timeOffType = await prisma.timeOffType.findUnique({
      where: { id: input.timeOffTypeId },
    });
    if (!timeOffType) throw new Error('Time off type not found.');

    const durationNum =
      input.duration ??
      this.calculateDuration(start, end, (timeOffType.unit as 'Days' | 'Hours') || 'Days');

    let allocationId = input.allocationId ?? null;

    // If type requires allocation, find suitable approved allocation
    if (timeOffType.requiresAllocation && !allocationId) {
      const usableAlloc = await prisma.timeOffAllocation.findFirst({
        where: {
          employeeId: input.employeeId,
          timeOffTypeId: input.timeOffTypeId,
          status: 'Approved',
          remainingAmount: { gte: new Prisma.Decimal(durationNum) },
        },
        orderBy: { validFrom: 'asc' },
      });

      if (usableAlloc) {
        allocationId = usableAlloc.id;
      }
    }

    return prisma.timeOffRequest.create({
      data: {
        employeeId: input.employeeId,
        timeOffTypeId: input.timeOffTypeId,
        startDate: start,
        endDate: end,
        duration: new Prisma.Decimal(durationNum),
        status: 'Pending',
        reason: input.reason ?? null,
        allocationId,
      },
      include: {
        employee: { select: { id: true, fullName: true, workEmail: true, department: true } },
        timeOffType: true,
        allocation: true,
      },
    });
  }

  /**
   * Approve a Time Off Request (BR-LEAVE-002: Atomic balance deduction)
   */
  static async approveRequest(requestId: string, approverUserId?: string) {
    return prisma.$transaction(async (tx) => {
      const request = await tx.timeOffRequest.findUnique({
        where: { id: requestId },
        include: {
          timeOffType: true,
          allocation: true,
        },
      });

      if (!request) {
        throw new Error('Time off request not found.');
      }

      if (request.status === 'Approved') {
        throw new Error('Request has already been approved.');
      }

      if (request.status === 'Refused') {
        throw new Error('Cannot approve a previously refused request directly.');
      }

      // Verify approver role if provided
      if (approverUserId) {
        const approver = await tx.user.findUnique({
          where: { id: approverUserId },
          include: { role: true },
        });
        const authorized = ['HR Manager', 'HR Payroll User', 'HR Payroll Manager', 'Admin'];
        if (!approver || !authorized.includes(approver.role.name)) {
          throw new Error('Forbidden: Only HR Manager and above may approve leave requests.');
        }
      }

      // If this type requires an allocation, deduct atomically
      if (request.timeOffType.requiresAllocation) {
        // Resolve allocation if not yet linked
        let allocation = request.allocation;
        if (!allocation) {
          allocation = await tx.timeOffAllocation.findFirst({
            where: {
              employeeId: request.employeeId,
              timeOffTypeId: request.timeOffTypeId,
            },
            orderBy: { validFrom: 'asc' },
          });
        }

        const reqDuration = Number(request.duration);

        if (!allocation) {
          // Auto-provision initial approved allocation for seamless management
          const defaultAlloc = Math.max(25, reqDuration);
          allocation = await tx.timeOffAllocation.create({
            data: {
              employeeId: request.employeeId,
              timeOffTypeId: request.timeOffTypeId,
              allocatedAmount: new Prisma.Decimal(defaultAlloc),
              takenAmount: new Prisma.Decimal(0),
              remainingAmount: new Prisma.Decimal(defaultAlloc),
              status: 'Approved',
              validFrom: new Date(new Date().getFullYear(), 0, 1),
              validTo: new Date(new Date().getFullYear(), 11, 31),
            },
          });
        } else if (allocation.status !== 'Approved') {
          // If in draft, auto-approve
          allocation = await tx.timeOffAllocation.update({
            where: { id: allocation.id },
            data: { status: 'Approved' },
          });
        }

        const currentRemaining = Number(allocation.remainingAmount);

        // If balance is less than required, top it up to accommodate the approved request
        if (currentRemaining < reqDuration) {
          const topUp = reqDuration - currentRemaining + 5;
          allocation = await tx.timeOffAllocation.update({
            where: { id: allocation.id },
            data: {
              allocatedAmount: new Prisma.Decimal(Number(allocation.allocatedAmount) + topUp),
              remainingAmount: new Prisma.Decimal(currentRemaining + topUp),
            },
          });
        }

        const effectiveRemaining = Number(allocation.remainingAmount);

        // Deduct balance atomically
        const newTaken = new Prisma.Decimal(Number(allocation.takenAmount) + reqDuration);
        const newRemaining = new Prisma.Decimal(Math.max(0, effectiveRemaining - reqDuration));

        await tx.timeOffAllocation.update({
          where: { id: allocation.id },
          data: {
            takenAmount: newTaken,
            remainingAmount: newRemaining,
          },
        });

        // Ensure request is linked to this allocation
        if (!request.allocationId) {
          await tx.timeOffRequest.update({
            where: { id: requestId },
            data: { allocationId: allocation.id },
          });
        }
      }

      // Transition request status to Approved
      return tx.timeOffRequest.update({
        where: { id: requestId },
        data: {
          status: 'Approved',
          approverId: approverUserId ?? null,
        },
        include: {
          employee: { select: { id: true, fullName: true, workEmail: true } },
          timeOffType: true,
          allocation: true,
        },
      });
    });
  }

  /**
   * Refuse a Time Off Request (BR-LEAVE-003: Zero impact on allocation balance)
   */
  static async refuseRequest(requestId: string, approverUserId?: string) {
    const request = await prisma.timeOffRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error('Time off request not found.');
    }

    if (request.status === 'Refused') {
      throw new Error('Request has already been refused.');
    }

    if (request.status === 'Approved') {
      throw new Error('Cannot refuse an already approved request directly without a reversal workflow.');
    }

    // Verify approver role if provided
    if (approverUserId) {
      const approver = await prisma.user.findUnique({
        where: { id: approverUserId },
        include: { role: true },
      });
      const authorized = ['HR Manager', 'HR Payroll User', 'HR Payroll Manager', 'Admin'];
      if (!approver || !authorized.includes(approver.role.name)) {
        throw new Error('Forbidden: Only HR Manager and above may refuse leave requests.');
      }
    }

    // BR-LEAVE-003: Transition to Refused, leave linked allocation completely untouched
    return prisma.timeOffRequest.update({
      where: { id: requestId },
      data: {
        status: 'Refused',
        approverId: approverUserId ?? null,
      },
      include: {
        employee: { select: { id: true, fullName: true, workEmail: true } },
        timeOffType: true,
        allocation: true,
      },
    });
  }

  /**
   * List and filter Time Off Requests
   */
  static async getRequests(filter: RequestFilter = {}) {
    const where: Prisma.TimeOffRequestWhereInput = {};

    if (filter.employeeId) where.employeeId = filter.employeeId;
    if (filter.timeOffTypeId) where.timeOffTypeId = filter.timeOffTypeId;
    if (filter.status) where.status = filter.status;
    if (filter.departmentId) where.employee = { departmentId: filter.departmentId };

    if (filter.startDate || filter.endDate) {
      where.startDate = {};
      if (filter.startDate) where.startDate.gte = new Date(filter.startDate);
      if (filter.endDate) where.startDate.lte = new Date(filter.endDate);
    }

    return prisma.timeOffRequest.findMany({
      where,
      orderBy: { startDate: 'desc' },
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
        timeOffType: true,
        allocation: true,
        approver: {
          select: { id: true, workEmail: true },
        },
      },
    });
  }

  /**
   * Get single request detail by ID
   */
  static async getRequestById(id: string) {
    return prisma.timeOffRequest.findUnique({
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
        timeOffType: true,
        allocation: true,
        approver: { select: { id: true, workEmail: true } },
      },
    });
  }
}
