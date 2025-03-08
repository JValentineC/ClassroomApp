import { NextRequest, NextResponse } from 'next/server';
import { getAllClassrooms, getClassroomsUsingUserId, getUserRoleInClassroom } from '@/lib/query/classroom';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<Response> {
  try {
    // const { searchParams } = new URL(request.url);
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const classroomId = searchParams.get('classroomId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch the user's role for the classroom/[id] page
    if (classroomId) {
      const role = await getUserRoleInClassroom(Number(userId), Number(classroomId));
      return NextResponse.json({ role });
    }

    // If no specific classroom is specified, fetch all classrooms for the user (e.g., for the classrooms page)
    const userClassrooms = await getClassroomsUsingUserId(Number(userId));

    return NextResponse.json(userClassrooms);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch classrooms' }, { status: 500 });
  }
}
