'use client';

import { useEffect, useState } from 'react';
import SubmitButton from './SubmitButtonClass';
import QuestionIndicators from './QuestionIndicatorsClass';
import TextArea from './TextArea';
import Input from './Input';
import QuestionForm from './QuestionForm';
import { uploadFile } from '@/lib/s3/utils';

export default function AssignmentCreateForm({ classroomId }: { classroomId: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [numQuestions, setNumQuestions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<{ [key: string]: string | null }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<
    {
      question_number: number;
      name: string | null;
      prompt: string | null;
      accepted_file_types: string | null;
      example_solution_s3_path: string | null;
    }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: File | null }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const num = Number(numQuestions);
    if (num > 0 && num <= 20) {
      setQuestions(
        Array.from({ length: num }, (_, index) => ({
          question_number: index,
          name: '',
          prompt: '',
          accepted_file_types: '',
          example_solution_s3_path: '',
        })),
      );
    } else {
      setQuestions([]);
    }
  }, [numQuestions]);

  useEffect(() => {
    calculateProgress();
  }, [questions]);

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(prev => prev.map(q => (q.question_number === id ? { ...q, [field]: value } : q)));
  };

  function handleFileChange(questionId: number, file: File | null) {
    setUploadedFiles(prev => ({
      ...prev,
      [questionId]: file,
    }));
    console.log('Uploaded files: ' + JSON.stringify(uploadedFiles));
  }

  function validateForm() {
    const newErrors: { [key: string]: string | null } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    }
    if (!dueDate) {
      newErrors.dueDate = 'Due date is required.';
    } else if (new Date(dueDate) <= new Date()) {
      newErrors.dueDate = 'Due date must be in the future.';
    }
    const num = Number(numQuestions);
    if (num < 1 || num > 20) {
      newErrors.numQuestions = 'Number of questions must be between 1 and 20.';
    }

    questions.forEach((question, index) => {
      if (!question.name?.trim()) {
        newErrors[`questionTitle${index}`] = `Title is required for question ${index + 1}.`;
      }
      if (!question.prompt?.trim()) {
        newErrors[`questionPrompt${index}`] = `Description is required for question ${index + 1}.`;
      }
    });

    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setSubmitting(false);
    }

    return Object.keys(newErrors).length === 0;
  }

  function calculateProgress() {
    const filledQuestions = questions.filter(question => question.name?.trim() && question.prompt?.trim()).length;
    const totalQuestions = Number(numQuestions);
    const progress = totalQuestions > 0 ? (filledQuestions / totalQuestions) * 100 : 0;
    setProgressPercentage(progress);
  }

  const completedQuestions = questions.map(q => !!(q.name?.trim() && q.prompt?.trim()));

  async function handleSubmit() {
    setError({});
    setSuccessMessage(null);
    setIsLoading(true);
    setSubmitting(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      for (const question of questions) {
        const file = uploadedFiles[question.question_number];

        // Skip unanswered questions
        if (!file) continue;

        const fileKey = await uploadFile(file);
        if (!fileKey) {
          setErrorMessage(`Failed to upload file for question: ${question.name}`);
          setSubmitting(false);
          return;
        }
        question.example_solution_s3_path = fileKey; // Store the S3 path in the question object
      }

      const payload = {
        classroomId: Number(classroomId),
        name: title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        questions: questions,
      };

      const response = await fetch('/api/assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to submit assignment');

      setSuccessMessage('Assignment submitted successfully!');
      setUploadedFiles({});
      setTitle('');
      setDescription('');
      setNumQuestions('');
      setDueDate('');
      setQuestions([]);
      setCurrentQuestion(0);
      setProgressPercentage(0);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      setErrorMessage('Error submitting assignment. Please try again.');
    } finally {
      // End loading state
      setSubmitting(false);
      setIsLoading(false);
    }
  }

  const isValidNumQuestions = Number(numQuestions) > 0 && Number(numQuestions) <= 20;

  return (
    <div className="p-4 border rounded-lg">
      <h1 className="text-2xl">Create Assignment</h1>

      {error.form && <p className="text-red-500">{error.form}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <Input setStateChange={setTitle} placeholder="Title" value={title} disabled={submitting} />
      {error.title && <p className="text-red-500">{error.title}</p>}

      <TextArea value={description} setStateChange={setDescription} placeholder="Description" disabled={submitting} />
      {error.description && <p className="text-red-500">{error.description}</p>}
      <p>Due-Date:</p>

      {error.dueDate && <p className="text-red-500">{error.dueDate}</p>}

      <div className="flex justify-around items-center mt-4">
        <Input setStateChange={setDueDate} type="date" value={dueDate} className="w-1/2" disabled={submitting} />

        <Input
          type="text"
          disabled={submitting}
          value={numQuestions}
          setStateChange={value => {
            if (/^0+\d/.test(value)) {
              value = String(Number(value));
            }
            setNumQuestions(value);
          }}
          placeholder="Number of questions"
          className="w-1/2 no-spinner"
        />
      </div>

      {numQuestions && !isValidNumQuestions && (
        <p className="text-red-500">Invalid number of questions. It must be between 1 and 20.</p>
      )}

      {questions.map((_, index) => (
        <div key={index}>
          {error[`questionTitle${index}`] && <p className="text-red-500">{error[`questionTitle${index}`]}</p>}
          {error[`questionPrompt${index}`] && <p className="text-red-500">{error[`questionPrompt${index}`]}</p>}
        </div>
      ))}

      {isValidNumQuestions && (
        <div className="mt-12">
          <QuestionIndicators
            numQuestions={Number(numQuestions)}
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            completedQuestions={completedQuestions}
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {isValidNumQuestions &&
            questions.map((question, index) => (
              <div key={question.question_number} className={index === currentQuestion ? 'block' : 'hidden'}>
                <QuestionForm
                  index={index}
                  question={question}
                  updateQuestion={updateQuestion}
                  handleFileChange={handleFileChange}
                />
              </div>
            ))}
        </div>

        <div className="flex justify-center items-center">
          {isValidNumQuestions && (
            <div className="radial-progress" style={{ '--value': progressPercentage } as any} role="progressbar">
              {progressPercentage.toFixed(0)}%
            </div>
          )}
        </div>
      </div>

      <SubmitButton handleSubmit={handleSubmit} disabled={submitting} />
    </div>
  );
}
