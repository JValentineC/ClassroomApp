import { NextRequest, NextResponse } from 'next/server';
import { createAssignmentSubmission, createQuestionSubmission, deleteAssignmentSubmissions, hasUserSubmittedAssignment } from '@/lib/query/classroom';

export async function POST(req: NextRequest) {
  try {
    const { assignmentId, files, userId } = await req.json();

    if (!assignmentId || !files || Object.keys(files).length === 0) {
      return NextResponse.json({ error: 'Invalid request: Missing required fields' }, { status: 400 });
    }

    if (!files || typeof files !== 'object' || Object.keys(files).length === 0) {
      return NextResponse.json({ error: 'Invalid files object' }, { status: 400 });
    }
    await deleteAssignmentSubmissions(assignmentId, userId);


    // Step 1: Create an assignment submission
    const assignmentSubmission = await createAssignmentSubmission({
      assignment_id: assignmentId,
      student_user_id: userId,
      s3_path: '',
    });

    if (!assignmentSubmission || !assignmentSubmission.assignment_submission_id) {
      console.error('Failed to create assignment submission.');
      return NextResponse.json({ error: 'Failed to create assignment submission' }, { status: 500 });
    }

    const assignmentSubmissionId = assignmentSubmission.assignment_submission_id;

    // Step 2: Create question submissions
    const questionSubmissions = [];
    for (const [questionId, fileKey] of Object.entries(files)) {
      const parsedQuestionId = parseInt(questionId);
      if (isNaN(parsedQuestionId)) {
        console.error(`Invalid question ID: ${questionId}`);
        continue;
      }

      try {
        const questionSubmission = await createQuestionSubmission({
          assignment_submission_id: assignmentSubmissionId,
          question_id: parsedQuestionId,
          student_user_id: userId,
          s3_path: fileKey as string,
        });
        questionSubmissions.push(questionSubmission);
      } catch (error) {
        console.error(`Failed to create submission for question ${questionId}:`, error);
      }
    }

    return NextResponse.json({
      message: 'Submission successful!',
      assignmentSubmission,
      questionSubmissions,
    });
  } catch (error) {
    console.error('Unexpected error in assignment submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const assignmentId = Number(searchParams.get('assignmentId'));
    const userId = Number(searchParams.get('userId'));

    if (!assignmentId || !userId) {
      return NextResponse.json({ error: 'Missing params - userId or assignmentId' }, { status: 400 });
    }

    const submission = await hasUserSubmittedAssignment(Number(assignmentId), userId);

    return NextResponse.json({ alreadySubmitted: submission });
  } catch (error) {
    console.error('Error fetching assignment submissions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
