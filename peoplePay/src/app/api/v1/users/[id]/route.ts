import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonResponse, errorResponse } from "@/modules/auth/rbac";
import bcrypt from "bcryptjs";

// GET /api/v1/users/[id] - Admin only
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const rbac = await requireRole(["Admin"]);
  if (rbac.error) return jsonResponse(rbac, rbac.status);

  try {
    const { id } = await context.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        workEmail: true,
        active: true,
        roleId: true,
        role: true,
        employeeId: true,
        employee: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return jsonResponse(user);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

// PUT /api/v1/users/[id] - Admin only (BR-AUTH-002)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const rbac = await requireRole(["Admin"]);
  if (rbac.error) return jsonResponse(rbac, rbac.status);

  try {
    const { id } = await context.params;
    const data = await request.json();

    const updateData: any = {};
    if (data.workEmail !== undefined) updateData.workEmail = data.workEmail;
    if (data.active !== undefined) updateData.active = Boolean(data.active);
    if (data.roleId !== undefined) updateData.roleId = data.roleId;
    if (data.employeeId !== undefined) updateData.employeeId = data.employeeId || null;

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(data.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        workEmail: true,
        active: true,
        role: true,
        employee: true,
        updatedAt: true,
      },
    });

    return jsonResponse(updatedUser);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
