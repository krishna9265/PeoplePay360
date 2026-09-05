import { NextRequest, NextResponse } from 'next/server';
import { AllocationService } from '@/modules/time-tracking/services/allocation.service';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/modules/auth/authOptions';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.roleName || 'Employee';

    if (userRole === 'Employee') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Employees cannot approve leave allocations' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const approverUserId = (session?.user as any)?.id || body.approverUserId;

    const approved = await AllocationService.approveAllocation(id, approverUserId);
    return NextResponse.json({ success: true, data: approved });
  } catch (error: any) {
    const status = error.message?.includes('Forbidden') ? 403 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
