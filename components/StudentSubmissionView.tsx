import { useEffect, useState } from 'react';
import { Assignment, AssignmentSubmission } from '@/types/classroom';
import AssignmentSelector from '@/components/AssignmentSelector';
import StudentSubmissionDetails from '@/components/StudentSubmissionDetails';
import FileModal from '@/components/FileModal';

export default function StudentSubmissionsView({ classroomId, userId }: { classroomId: string; userId: number }) {
  const [state, setState] = useState({
    assignments: [] as Assignment[],
    selectedAssignmentId: null as number | null,
    loading: { assignments: true, submission: false },
    error: null as string | null,
    submissions: null as AssignmentSubmission | null,
    fileUrl: null as string | null,
    isModalOpen: false,
  });

  const setLoading = (key: 'assignments' | 'submissions', value: boolean) => {
    setState(prev => ({ ...prev, loading: { ...prev.loading, [key]: value } }));
  };

  const fetchData = async (url: string, key: 'assignments' | 'submissions') => {
    try {
      setLoading(key, true);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`No ${key} found`);
      const data = await response.json();
      console.log(`Fetched ${key}:`, data); // Log API response
      setState(prev => ({ ...prev, [key]: data[key] || data }));
    } catch (error) {
      setState(prev => ({ ...prev, error: error instanceof Error ? error.message : 'An unknown error occurred' }));
    } finally {
      setLoading(key, false);
    }
  };

  useEffect(() => {
    fetchData(`/api/assignment?classroomId=${classroomId}`, 'assignments');
  }, [classroomId]);

  useEffect(() => {
    setState(prev => ({ ...prev, submissions: null, error: '' })); // Clear old submissions

    if (state.selectedAssignmentId !== null) {
      fetchData(`/api/student_submissions?assignmentId=${state.selectedAssignmentId}&userId=${userId}`, 'submissions');
    }
  }, [state.selectedAssignmentId]);

  const handleViewFile = async (key: string | null) => {
    if (!key) {
      setState(prev => ({ ...prev, error: 'No file available' }));
      return;
    }
    try {
      const response = await fetch(`/api/s3?operation=download&key=${key}`);
      const data = await response.json();
      if (response.ok) {
        setState(prev => ({ ...prev, fileUrl: data.signedUrl, isModalOpen: true }));
      } else {
        setState(prev => ({ ...prev, error: 'Something went wrong! Please try again' }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Something went wrong! Please try again' }));
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-2xl mb-2">Your Submissions</h2>
      {state.error && <p className="text-red-500">{state.error}</p>}

      <AssignmentSelector
        assignments={state.assignments}
        selectedAssignmentId={state.selectedAssignmentId}
        onSelectAssignment={id => setState(prev => ({ ...prev, selectedAssignmentId: id }))}
      />

      {state.selectedAssignmentId && state.submissions && (
        <StudentSubmissionDetails
          questionSubmissions={state.submissions.question_submission || []}
          onViewFile={handleViewFile}
        />
      )}

      <FileModal
        isOpen={state.isModalOpen}
        fileUrl={state.fileUrl}
        onClose={() => setState(prev => ({ ...prev, isModalOpen: false }))}
      />
    </div>
  );
}
