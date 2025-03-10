import {
  classroom,
  assignment,
  question,
  assignment_submission,
  student,
  user,
  question_submission,
} from '@prisma/client';

export type Classroom = classroom;
export type Assignment = assignment;
export type Question = question;
export type AssignmentSubmission = assignment_submission & {
  student_user_id: number; // Ensure this field is included
  student: {
    user: {
      name: string | null;
    };
  };
  question_submission: QuestionSubmission[];
};

export type QuestionSubmission = {
  question_submission_id: number;
  assignment_submission_id: number;
  question_id: number;
  student_user_id: number;
  s3_path: string;
  created_at: Date | null;
  updated_at?: Date;
  assignment_id?: number;
  student_id?: number;
  answer?: string;
  question: {
    question_number: number;
    name: string;
  };
};
