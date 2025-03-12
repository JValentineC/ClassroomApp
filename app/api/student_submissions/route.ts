export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { getAssignmentSubmissions, getUserAssignmentSubmission } from '@/lib/query/classroom';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const assignmentId = searchParams.get('assignmentId');
    const userId = searchParams.get('userId'); // Get user ID from query params

    if (!assignmentId) {
      return NextResponse.json({ error: 'Invalid request: Missing assignment ID' }, { status: 400 });
    }

    let assignmentSubmissions;

    if (userId) {
      // Fetch only this user's submission for the given assignment
      console.log(`Fetching submission for assignment ID: ${assignmentId}, user ID: ${userId}`);
      assignmentSubmissions = await getUserAssignmentSubmission(Number(assignmentId), Number(userId));
    } else {
      // Fetch all submissions for the given assignment
      console.log(`Fetching all submissions for assignment ID: ${assignmentId}`);
      assignmentSubmissions = await getAssignmentSubmissions(Number(assignmentId));
    }

    if (!assignmentSubmissions || (Array.isArray(assignmentSubmissions) && assignmentSubmissions.length === 0)) {
      return NextResponse.json({ error: 'No submissions found' }, { status: 404 });
    }

    // Ensure uniform response structure
    const formattedSubmissions = Array.isArray(assignmentSubmissions)
      ? assignmentSubmissions.map(formatSubmission)
      : formatSubmission(assignmentSubmissions);

    return NextResponse.json({
      message: 'Submissions retrieved successfully!',
      submissions: formattedSubmissions,
    });
  } catch (error) {
    console.error('Unexpected error in fetching submissions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Helper function to format submission data
const formatSubmission = (submission: any) => ({
  assignmentSubmissionId: submission.assignment_submission_id,
  student_user_id: submission.student_user_id,
  student: submission.student?.user?.name || 'Unknown',
  questionSubmissions: submission.question_submission,
});