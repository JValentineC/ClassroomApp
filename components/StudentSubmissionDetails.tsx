import React from 'react';
import { QuestionSubmission } from '@/types/classroom';
import { BsEye } from 'react-icons/bs';

interface StudentSubmissionDetailsProps {
  questionSubmissions: QuestionSubmission[];
  onViewFile: (key: string | null) => void;
}

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const StudentSubmissionDetails: React.FC<StudentSubmissionDetailsProps> = ({ questionSubmissions, onViewFile }) => {
  console.log('Rendering StudentSubmissionDetails with questionSubmissions:', questionSubmissions);

  return (
    <div>
      {questionSubmissions.map(qs => (
        <div key={qs.question_submission_id} className="bg-black border p-6 rounded-lg shadow-lg w-120 m-4">
          <h3>Question {qs.question.question_number + 1}:</h3>
          <p>
            <strong>{qs.question.name}</strong>
          </p>

          <button
            data-tip="View Submission File"
            className="text-gray-500 cursor-pointer hover:text-gray-700 text-2xl tooltip"
            onClick={() => onViewFile(qs.s3_path)}
          >
            <BsEye />
          </button>
          {qs.created_at && (
            <p>
              <strong>Submitted At:</strong> {formatDate(qs.created_at)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentSubmissionDetails;
