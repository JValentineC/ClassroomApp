import { NextRequest, NextResponse } from 'next/server';
import { getQuestionsUsingAssignmentId, updateQuestion } from '@/lib/query/classroom';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const assignmentId = searchParams.get('assignmentId');

  if (!assignmentId) {
    return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
  }

  try {
    const questions = await getQuestionsUsingAssignmentId(Number(assignmentId));
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const requestBody = await request.json(); // Parse JSON body
    const { question_id, name, prompt, accepted_file_types, example_solution_s3_path } = requestBody;

    if (!question_id) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    // Update the question using the provided data
    const updatedQuestion = await updateQuestion({
      question_id,
      name,
      prompt,
      accepted_file_types,
      example_solution_s3_path,
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}
