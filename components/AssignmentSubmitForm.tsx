'use client';

import { Assignment, Question } from '@/types/classroom';
import { useEffect, useState } from 'react';
import { uploadFile } from '@/lib/s3/utils';

export default function AssignmentSubmitForm({ classroomId, userId }: { classroomId: string; userId: number }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: File | null }>({});

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch assignments
  useEffect(() => {
    async function fetchAssignments() {
      setLoadingAssignments(true);
      setErrorMessage(''); // Clear previous errors
      try {
        const response = await fetch(`/api/assignment?classroomId=${classroomId}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data: Assignment[] = await response.json();
        setAssignments(data);
      } catch (err) {
        setErrorMessage('Failed to load assignments');
        console.error('Error fetching assignments:', err);
      } finally {
        setLoadingAssignments(false);
      }
    }

    fetchAssignments();
  }, [classroomId]);

  // Fetch questions when an assignment is selected
  useEffect(() => {
    if (!selectedAssignmentId) {
      setQuestions([]);
      setUploadedFiles({});
      setErrorMessage('');
      return;
    }
    async function checkIfSubmitted() {
      try {
        const response = await fetch(
          `/api/assignment_submission?assignmentId=${selectedAssignmentId}&userId=${userId}`,
        );
        if (!response.ok) throw new Error('Failed to check submission status');

        const data = await response.json();
        if (data.alreadySubmitted) {
          setErrorMessage(
            'You have already submitted this assignment. If you submit again, your previous submission will be overridden.',
          );
        } else {
          setErrorMessage(''); // Clear message if not submitted before
        }
      } catch (error) {
        console.error('Error checking submission status:', error);
      }
    }

    async function fetchQuestions() {
      setLoadingQuestions(true);
      setErrorMessage('');
      setSubmitting(false);
      setSuccessMessage('');
      try {
        const response = await fetch(`/api/question?assignmentId=${selectedAssignmentId}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data: Question[] = await response.json();
        setQuestions(data);
        setUploadedFiles({});
      } catch (err) {
        setErrorMessage('Failed to load questions');
        console.error('Error fetching questions:', err);
      } finally {
        setLoadingQuestions(false);
      }
    }
    checkIfSubmitted();
    fetchQuestions();
  }, [selectedAssignmentId]);

  function handleFileChange(questionId: number, file: File | null) {
    setUploadedFiles(prev => ({
      ...prev,
      [questionId]: file,
    }));
  }

  async function handleSubmit() {
    if (!selectedAssignmentId) {
      setErrorMessage('Please select an assignment.');
      return;
    }
    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');
    const uploadedFileKeys: { [key: number]: string } = {};
    try {
      for (const question of questions) {
        const file = uploadedFiles[question.question_id];

        // Skip unanswered questions
        if (!file) continue;

        const fileKey = await uploadFile(file);
        if (!fileKey) {
          setErrorMessage(`Failed to upload file for question: ${question.name}`);
          setSubmitting(false);
          return;
        }
        uploadedFileKeys[question.question_id] = fileKey;
      }

      const response = await fetch('/api/assignment_submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: selectedAssignmentId,
          files: uploadedFileKeys,
          userId: userId,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit assignment');

      setSuccessMessage('Assignment submitted successfully!');
      setUploadedFiles({});
      setSelectedAssignmentId(null);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      setErrorMessage('Error submitting assignment. Please try again.');
    } finally {
      // End loading state
      setSubmitting(false);
    }
  }

  if (loadingAssignments) {
    return <p>Loading assignments...</p>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <form
        className="form-control space-y-4"
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h2 className="text-2xl mb-2">Submit Assignment</h2>

        <select
          className="select select-bordered w-full mt-2"
          value={selectedAssignmentId ?? ''}
          onChange={e => setSelectedAssignmentId(Number(e.target.value))}
          disabled={submitting}
        >
          <option value="" disabled>
            Choose an Assignment
          </option>
          {assignments.map(assignment => (
            <option key={assignment.assignment_id} value={assignment.assignment_id}>
              {assignment.name}
            </option>
          ))}
        </select>

        {loadingQuestions && <p>Loading questions...</p>}
        <div className="overflow-x-scroll text-ellipsis overflow-hidden pb-3">
          {successMessage ? (
            <span className="text-success">{successMessage}</span>
          ) : errorMessage ? (
            <span className="text-error">{errorMessage}</span>
          ) : (
            <div>
              <span className="text-error">{errorMessage}</span>
              <span className="text-success">{successMessage}</span>
            </div>
          )}
        </div>

        {questions.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold">Questions</h3>
            {questions.map(question => (
              <div key={question.question_id} className="mt-4 p-3 border rounded-lg">
                <h4 className="font-medium">{question.name}</h4>
                <p className="text-gray-600">{question.prompt}</p>
                <input
                  type="file"
                  //accept={question.accepted_file_types || ''}
                  className="file-input file-input-bordered w-full mt-2"
                  onChange={e => {
                    const file = e.target.files && e.target.files.length === 1 ? e.target.files[0] : null;
                    handleFileChange(question.question_id, file);
                  }}
                  disabled={submitting}
                />
              </div>
            ))}
          </div>
        )}

        <button className="btn btn-primary w-full mt-4" type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>

        {submitting && <p className="text-center text-gray-500 mt-2">Processing...</p>}
      </form>
    </div>
  );
}
