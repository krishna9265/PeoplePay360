import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth, jsonResponse, errorResponse } from "@/modules/auth/rbac";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return jsonResponse(auth, auth.status);

  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
    });
    return jsonResponse(departments);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
