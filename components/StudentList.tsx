import React, { useEffect, useState } from 'react';
import { AssignmentSubmission } from '@/types/classroom';
import StudentSubmissionDetails from '@/components/StudentSubmissionDetails';
import FileModal from '@/components/FileModal';

interface StudentListProps {
  submissions: AssignmentSubmission[];
  onSelectStudent: (studentId: number) => void;
  onBack: () => void; // Add the onBack prop
}

const StudentList: React.FC<StudentListProps> = ({ submissions, onSelectStudent, onBack }) => {
  const [state, setState] = useState({
    selectedStudentId: null as number | null,
    fileUrl: null as string | null,
    isModalOpen: false,
    error: null as string | null,
    showStudentList: true,
  });

  // Reset state when submissions change (new assignment is selected)
  useEffect(() => {
    setState(prev => ({
      ...prev,
      selectedStudentId: null,
      showStudentList: true, // Ensure it resets back to the main list
    }));
  }, [submissions]);

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
    <div>
      {state.showStudentList && (
        <div>
          {submissions.map(submission => (
            <p
              key={submission.assignmentSubmissionId}
              className="bg-black border p-6 rounded-lg shadow-lg w-120"
              onClick={() => {
                if (submission.student_user_id) {
                  onSelectStudent(submission.student_user_id);
                  setState(prev => ({
                    ...prev,
                    selectedStudentId: submission.student_user_id,
                    showStudentList: false,
                  }));
                } else {
                  console.error('student_user_id is undefined');
                }
              }}
            >
              {submission.student ?? 'Unknown Student'}
            </p>
          ))}
        </div>
      )}
      {!state.showStudentList && (
        <button
          className="btn btn-outline mt-4 ml-4"
          onClick={() => {
            setState(prev => ({
              ...prev,
              showStudentList: true,
              selectedStudentId: null, // Clear selected student state
            }));
            onBack(); // Call the onBack function to reset the state in ViewSubmissions
          }}
        >
          Back
        </button>
      )}
      {state.selectedStudentId && (
        <StudentSubmissionDetails
          questionSubmissions={
            submissions.find(sub => sub.student_user_id === state.selectedStudentId)?.question_submission || []
          }
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
};

export default StudentList;
