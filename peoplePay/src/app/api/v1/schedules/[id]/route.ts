import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonResponse, errorResponse } from "@/modules/auth/rbac";

// GET /api/v1/schedules/[id]
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const rbac = await requireRole(["HR Manager", "HR Payroll User", "HR Payroll Manager", "Admin"]);
  if (rbac.error) return jsonResponse(rbac, rbac.status);

  try {
    const { id } = await context.params;
    const schedule = await prisma.workingSchedule.findUnique({
      where: { id },
      include: {
        days: {
          orderBy: { id: "asc" },
        },
        employees: {
          select: { id: true, fullName: true, jobPosition: true },
        },
      },
    });

    if (!schedule) {
      return errorResponse("Schedule not found", 404);
    }

    return jsonResponse(schedule);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

// PUT /api/v1/schedules/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const rbac = await requireRole(["HR Manager", "HR Payroll User", "HR Payroll Manager", "Admin"]);
  if (rbac.error) return jsonResponse(rbac, rbac.status);

  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name, type, weeklyHours } = body;

    const updated = await prisma.workingSchedule.update({
      where: { id },
      data: {
        name: name || undefined,
        type: type || undefined,
        weeklyHours: weeklyHours !== undefined ? Number(weeklyHours) : undefined,
      },
      include: {
        days: true,
      },
    });

    return jsonResponse(updated);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}

// DELETE /api/v1/schedules/[id]
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const rbac = await requireRole(["HR Manager", "Admin"]);
  if (rbac.error) return jsonResponse(rbac, rbac.status);

  try {
    const { id } = await context.params;
    
    // Check if contracts or employees rely on this schedule
    const linkedEmployees = await prisma.employee.count({
      where: { workingScheduleId: id },
    });
    const linkedContracts = await prisma.contract.count({
      where: { workingScheduleId: id },
    });

    if (linkedEmployees > 0 || linkedContracts > 0) {
      return errorResponse(
        `Cannot delete schedule: ${linkedEmployees} employees and ${linkedContracts} contracts are currently assigned to it.`,
        400
      );
    }

    await prisma.workingScheduleDay.deleteMany({
      where: { workingScheduleId: id },
    });

    await prisma.workingSchedule.delete({
      where: { id },
    });

    return jsonResponse({ success: true, message: "Schedule deleted successfully." });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
