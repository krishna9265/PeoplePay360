import { NextRequest, NextResponse } from 'next/server';
import { AllocationService } from '@/modules/time-tracking/services/allocation.service';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/modules/auth/authOptions';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.roleName || 'Employee';
    const userEmployeeId = (session?.user as any)?.employeeId;

    const { searchParams } = new URL(req.url);
    let employeeId = searchParams.get('employeeId') || undefined;
    const timeOffTypeId = searchParams.get('timeOffTypeId') || undefined;
    const status = searchParams.get('status') || undefined;

    // Backend RBAC: Employee role is scoped to their own allocations only
    if (userRole === 'Employee' && userEmployeeId) {
      employeeId = userEmployeeId;
    }

    const allocations = await AllocationService.getAllocations({
      employeeId,
      timeOffTypeId,
      status,
    });

    return NextResponse.json({ success: true, data: allocations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.roleName || 'Employee';

    // Backend RBAC: Employees cannot grant allocations
    if (userRole === 'Employee') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Only HR Managers can grant time off allocations' },
        { status: 403 }
      );
    }

    const body = await req.json();
    if (!body.employeeId || !body.timeOffTypeId || body.allocatedAmount === undefined) {
      return NextResponse.json(
        { success: false, error: 'employeeId, timeOffTypeId, and allocatedAmount are required' },
        { status: 400 }
      );
    }

    const allocation = await AllocationService.createAllocation({
      employeeId: body.employeeId,
      timeOffTypeId: body.timeOffTypeId,
      allocatedAmount: Number(body.allocatedAmount),
      validFrom: body.validFrom,
      validTo: body.validTo,
    });

    return NextResponse.json({ success: true, data: allocation }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
