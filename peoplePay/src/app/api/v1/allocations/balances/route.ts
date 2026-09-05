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
    let employeeId = searchParams.get('employeeId');

    if (userRole === 'Employee' && userEmployeeId) {
      employeeId = userEmployeeId;
    }

    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'employeeId query parameter is required' },
        { status: 400 }
      );
    }

    const balances = await AllocationService.getEmployeeBalances(employeeId);
    return NextResponse.json({ success: true, data: balances });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
