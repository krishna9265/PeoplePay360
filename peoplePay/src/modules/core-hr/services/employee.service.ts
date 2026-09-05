import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export class EmployeeService {
  static async getAllEmployees() {
    return await prisma.employee.findMany({
      include: {
        department: true,
        manager: true,
        workingSchedule: true,
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  static async getEmployeeById(id: string) {
    return await prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        manager: true,
        workingSchedule: true,
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  static async createEmployee(data: any) {
    const {
      fullName,
      workEmail,
      jobPosition,
      departmentId,
      workingScheduleId,
      managerId,
      status,
      password,
      roleId,
      roleName,
    } = data;

    // Check duplicate employee email
    const existingEmp = await prisma.employee.findUnique({
      where: { workEmail },
    });
    if (existingEmp) {
      throw new Error(`An employee with email ${workEmail} already exists.`);
    }

    // 1. Create Employee
    const employee = await prisma.employee.create({
      data: {
        fullName,
        workEmail,
        jobPosition: jobPosition || "Staff Member",
        departmentId: departmentId || null,
        workingScheduleId: workingScheduleId || null,
        managerId: managerId || null,
        status: status || "Active",
      },
      include: {
        department: true,
        manager: true,
        workingSchedule: true,
      },
    });

    // 2. Resolve Role for User Account
    let assignedRoleId = roleId;
    if (!assignedRoleId) {
      const targetRoleName = roleName || "Employee";
      const foundRole = await prisma.role.findFirst({
        where: { name: targetRoleName },
      });
      assignedRoleId = foundRole?.id;
    }

    if (!assignedRoleId) {
      const defaultRole = await prisma.role.findFirst();
      assignedRoleId = defaultRole?.id;
    }

    // 3. Create or Link User Login Account
    const initialPassword = password || "2305";
    const passwordHash = await bcrypt.hash(initialPassword, 10);

    const existingUser = await prisma.user.findUnique({
      where: { workEmail },
    });

    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          employeeId: employee.id,
          roleId: assignedRoleId,
          passwordHash,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          workEmail,
          passwordHash,
          roleId: assignedRoleId,
          employeeId: employee.id,
          active: true,
        },
      });
    }

    return employee;
  }

  static async updateEmployee(id: string, data: any) {
    return await prisma.employee.update({
      where: { id },
      data,
    });
  }

  static async archiveEmployee(id: string) {
    return await prisma.employee.update({
      where: { id },
      data: { status: "Archived" },
    });
  }
}
