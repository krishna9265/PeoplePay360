import { NextRequest, NextResponse } from 'next/server';
import { TimeOffRequestService } from '@/modules/time-tracking/services/request.service';
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
    const timeOffTypeId = searchParams.get('timeOffTypeId') || undefined;
    const status = searchParams.get('status') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    // Backend RBAC: Employee role is scoped to their own records only
    if (userRole === 'Employee' && userEmployeeId) {
      employeeId = userEmployeeId;
    }

    const requests = await TimeOffRequestService.getRequests({
      employeeId,
      departmentId,
      timeOffTypeId,
      status,
      startDate,
      endDate,
    });

    return NextResponse.json({ success: true, data: requests });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.roleName || 'Employee';
    const userEmployeeId = (session?.user as any)?.employeeId;

    const body = await req.json();

    if (!body.employeeId || !body.timeOffTypeId || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { success: false, error: 'employeeId, timeOffTypeId, startDate, and endDate are required' },
        { status: 400 }
      );
    }

    // Backend RBAC: Employee can only submit for themselves
    if (userRole === 'Employee' && userEmployeeId && body.employeeId !== userEmployeeId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You can only submit time off requests for yourself' },
        { status: 403 }
      );
    }

    const created = await TimeOffRequestService.submitRequest({
      employeeId: body.employeeId,
      timeOffTypeId: body.timeOffTypeId,
      startDate: body.startDate,
      endDate: body.endDate,
      duration: body.duration ? Number(body.duration) : undefined,
      reason: body.reason,
      allocationId: body.allocationId,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
