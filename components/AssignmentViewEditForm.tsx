'use client';

import { Assignment, Question } from '@/types/classroom';
import { useEffect, useState } from 'react';

import { BsEye } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';
import QuestionForm from './QuestionForm';
import { uploadFile } from '@/lib/s3/utils';

export default function AssignmentViewEditForm({ classroomId }: { classroomId: string }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<
    {
      question_id: number;
      name: string | null;
      prompt: string | null;
      accepted_file_types: string | null;
      example_solution_s3_path: string | null;
    }[]
  >([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [solutionUrl, setSolutionUrl] = useState(null);

  // Fetch assignments
  useEffect(() => {
    async function fetchAssignments() {
      setLoadingAssignments(true);
      setError(null); // Clear previous errors
      try {
        const response = await fetch(`/api/assignment?classroomId=${classroomId}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data: Assignment[] = await response.json();
        setAssignments(data);
      } catch (err) {
        setError('Failed to load assignments');
        console.error('Error fetching assignments:', err);
      } finally {
        setLoadingAssignments(false);
      }
    }

    fetchAssignments();
  }, [classroomId]);

  useEffect(() => {
    if (!selectedAssignmentId) {
      setQuestions([]);
      return;
    }

    async function fetchQuestions() {
      setLoadingQuestions(true);
      setError(null);
      try {
        const response = await fetch(`/api/question?assignmentId=${selectedAssignmentId}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data: Question[] = await response.json();
        setQuestions(data);
      } catch (err) {
        setError('Failed to load questions');
        console.error('Error fetching questions:', err);
      } finally {
        setLoadingQuestions(false);
      }
    }

    fetchQuestions();
  }, [selectedAssignmentId]);

  if (loadingAssignments) {
    return <p>Loading assignments...</p>;
  }

  const openModal = (question: Question) => {
    setCurrentQuestion({
      ...question,
      assignment_id: question.assignment_id ?? selectedAssignmentId,
      question_number: question.question_number ?? null,
      created_at: question.created_at ?? null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentQuestion(null);
  };

  // Save the edited question
  const saveQuestion = async () => {
    //TODO: delete the existing file from S3, if a new one is uploaded
    if (currentQuestion) {
      const file = uploadedFile;
      if (file) {
        const fileKey = await uploadFile(file);
        if (!fileKey) {
          setError(`Failed to upload file for question: ${currentQuestion.name}`);
          return;
        }
        currentQuestion.example_solution_s3_path = fileKey;
      }
      try {
        // Make the PUT request to update the question
        const response = await fetch(`/api/question`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentQuestion),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
          setError('Failed to update question');
        }

        // Parse the response
        const updatedQuestion = await response.json();
        console.log('Updated Question:', updatedQuestion);

        // Update the state with the updated question data if needed
        setQuestions(prevQuestions =>
          prevQuestions.map(q => (q.question_id === updatedQuestion.question_id ? updatedQuestion : q)),
        );

        // Close the modal after successful update
        closeModal();
      } catch (err) {
        console.error('Error saving question:', err);
        setError('Failed to save question');
      }
    }
  };

  function handleFileChange(questionId: number, file: File | null) {
    setUploadedFile(file);
    console.log('Uploaded file:', file);
  }

  const handleView = async (key: string | null) => {
    try {
      if (!key) {
        setError('No file available');
        return;
      }

      const response = await fetch(`/api/s3?operation=download&key=${key}`);
      const data = await response.json();

      if (response.ok) {
        window.open(data.signedUrl, '_blank');
      } else {
        console.error('Error handling file:', data.error);
        setError('Something went wrong! Please try again');
      }
    } catch (error) {
      console.error('Error fetching signed URL:', error);
      setError('Something went wrong! Please try again');
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-2xl mb-2">View Assignment</h2>

      {error && <p className="text-red-500">{error}</p>}

      <select
        className="select select-bordered w-full mt-2"
        value={selectedAssignmentId ?? ''}
        onChange={e => setSelectedAssignmentId(Number(e.target.value))}
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

      {loadingQuestions && (
        <p>
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-4">
                <div className="skeleton h-4 w-20"></div>
              </div>
            </div>
            <div className="skeleton h-32 w-full"></div>
          </div>
        </p>
      )}

      {questions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Questions</h3>
          {questions.map(question => (
            <div key={question.question_id} className="mt-4 p-3 border rounded-lg relative">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{question.name}</h4>
                <div className="flex gap-4">
                  <button
                    data-tip="View Solution File"
                    className="text-gray-500 cursor-pointer hover:text-gray-700 text-2xl tooltip"
                    onClick={() => handleView(question.example_solution_s3_path)}
                  >
                    <BsEye />
                  </button>
                  <FaRegEdit
                    className="text-gray-500 cursor-pointer hover:text-gray-700 text-2xl"
                    onClick={() =>
                      openModal({
                        ...question,
                        assignment_id: selectedAssignmentId ?? 0, // Add assignment_id if not present
                        question_number: null, // Provide a default value if missing
                        created_at: null, // Provide a default value if missing
                      })
                    }
                  />
                </div>
              </div>
              <p className="text-gray-600">{question.prompt}</p>

              {/* add function that shows all files associated with this assignment */}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && currentQuestion && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-black border p-6 rounded-lg shadow-lg w-120">
            <h3 className="text-xl font-semibold mb-4">Edit Question</h3>
            <QuestionForm
              index={0} // You can adjust this as needed
              question={{
                question_number: currentQuestion.question_number || 0,
                name: currentQuestion.name || '',
                prompt: currentQuestion.prompt || '',
                accepted_file_types: currentQuestion.accepted_file_types || '',
                example_solution_s3_path: currentQuestion.example_solution_s3_path || '',
              }}
              updateQuestion={(index, field, value) => {
                if (currentQuestion) {
                  setCurrentQuestion(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      [field]: value, // Update the specific field
                    };
                  });
                }
              }}
              handleFileChange={handleFileChange}
            />
            <div className="flex justify-end gap-4 mt-4">
              <button className="btn btn-primary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveQuestion}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for viewing solution */}
      <dialog
        id="solution_modal"
        className="modal fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
      >
        <div className="modal-box bg-black border p-6 rounded-lg shadow-lg w-120">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Solution</h3>
          {solutionUrl ? (
            <iframe src={solutionUrl} className="w-full h-96"></iframe>
          ) : (
            <p className="py-4">No solution available</p>
          )}
        </div>
      </dialog>
    </div>
  );
}
