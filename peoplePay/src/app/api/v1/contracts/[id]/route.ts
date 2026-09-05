import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonResponse, errorResponse } from "@/modules/auth/rbac";

// GET /api/v1/contracts/[id]
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const rbac = await requireRole(["HR Manager", "HR Payroll User", "HR Payroll Manager", "Admin"]);
  if (rbac.error) return jsonResponse(rbac, rbac.status);

  try {
    const { id } = await context.params;
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        employee: true,
        department: true,
        workingSchedule: true,
        salaryStructure: true,
      },
    });

    if (!contract) {
      return errorResponse("Contract not found", 404);
    }

    return jsonResponse(contract);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

// PUT /api/v1/contracts/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const rbac = await requireRole(["HR Manager", "HR Payroll User", "HR Payroll Manager", "Admin"]);
  if (rbac.error) return jsonResponse(rbac, rbac.status);

  try {
    const { id } = await context.params;
    const body = await request.json();

    const updateData: any = {};
    if (body.wage !== undefined) updateData.wage = Number(body.wage);
    if (body.status !== undefined) updateData.status = body.status;
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.jobPosition !== undefined) updateData.jobPosition = body.jobPosition;
    if (body.workingScheduleId !== undefined) updateData.workingScheduleId = body.workingScheduleId;
    if (body.salaryStructureId !== undefined) updateData.salaryStructureId = body.salaryStructureId;

    const updated = await prisma.contract.update({
      where: { id },
      data: updateData,
      include: {
        employee: true,
        department: true,
        workingSchedule: true,
        salaryStructure: true,
      },
    });

    return jsonResponse(updated);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
