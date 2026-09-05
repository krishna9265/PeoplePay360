import { NextRequest, NextResponse } from 'next/server';
import { TimeOffRequestService } from '@/modules/time-tracking/services/request.service';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/modules/auth/authOptions';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.roleName || 'Employee';
    const userEmployeeId = (session?.user as any)?.employeeId;

    const { id } = await params;
    const request = await TimeOffRequestService.getRequestById(id);
    if (!request) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    }

    // Backend RBAC: Employee can only view their own request
    if (userRole === 'Employee' && userEmployeeId && request.employeeId !== userEmployeeId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You can only view your own time off requests' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: request });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
