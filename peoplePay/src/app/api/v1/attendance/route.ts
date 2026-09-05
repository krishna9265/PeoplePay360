import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/modules/time-tracking/services/attendance.service';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/modules/auth/authOptions';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.roleName || 'Employee';
    const userEmployeeId = (session?.user as any)?.employeeId;

    const { searchParams } = new URL(req.url);
    let employeeId = searchParams.get('employeeId') || undefined;
    const departmentId = searchParams.get('departmentId') || undefined;
    const status = searchParams.get('status') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const exceptionsOnly = searchParams.get('exceptionsOnly') === 'true';

    // Backend RBAC: Employee role ALWAYS scoped to own records
    if (userRole === 'Employee' && userEmployeeId) {
      employeeId = userEmployeeId;
    }

    const records = await AttendanceService.getAttendanceList({
      employeeId,
      departmentId,
      status,
      startDate,
      endDate,
      exceptionsOnly,
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
}

