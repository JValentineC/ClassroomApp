import { NextRequest, NextResponse } from 'next/server';
import { getActiveAssignmentsUsingClassroomId, createAssignment } from '@/lib/query/classroom';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const classroomId = searchParams.get('classroomId');

  if (!classroomId) {
    return NextResponse.json({ error: 'Classroom ID is required' }, { status: 400 });
  }

  try {
    const assignments = await getActiveAssignmentsUsingClassroomId(Number(classroomId));
    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { classroomId, name, description, dueDate, questions } = body;
    if (!classroomId || !name || !dueDate || !questions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Call the createAssignment function
    const assignment = await createAssignment(classroomId, name, description, dueDate, questions);

    // Return the created assignment as a response
    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  }
}
