import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/modules/time-tracking/services/attendance.service';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/modules/auth/authOptions';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.roleName || 'Employee';
    const userEmployeeId = (session?.user as any)?.employeeId;

    const record = await prisma.attendance.findUnique({
      where: { id },
      include: {
        employee: { select: { id: true, fullName: true, workEmail: true, department: true } },
        correctedBy: { select: { id: true, workEmail: true, role: true } },
      },
    });

    if (!record) {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }

    // Employee role can only view own attendance records
    if (userRole === 'Employee' && record.employeeId !== userEmployeeId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You can only view your own attendance records.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.roleName || 'Employee';
    const userId = (session?.user as any)?.id;

    // BR-ATT-002: Only HR Manager+ can correct attendance
    const authorizedRoles = ['HR Manager', 'HR Payroll User', 'HR Payroll Manager', 'Admin'];
    if (!authorizedRoles.includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Only HR Manager and above can correct attendance records (BR-ATT-002).' },
        { status: 403 }
      );
    }

    const correctorId = userId || body.correctedById;
    if (!correctorId) {
      const adminOrHr = await prisma.user.findFirst({
        where: { role: { name: { in: ['Admin', 'HR Manager', 'HR Payroll Manager'] } } },
      });
      if (!adminOrHr) {
        return NextResponse.json({ success: false, error: 'No authorized corrector found' }, { status: 400 });
      }
    }

    const updated = await AttendanceService.correctAttendance({
      attendanceId: id,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      status: body.status,
      correctionReason: body.correctionReason || 'Manual adjustment by Manager/HR',
      correctedById: correctorId || 'admin',
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    const status = error.message?.includes('Forbidden') ? 403 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

