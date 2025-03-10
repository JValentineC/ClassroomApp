-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "role" TEXT,
    "payment_info" TEXT,
    "invite_code" UUID,
    "signup_complete" BOOLEAN,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "admin" (
    "admin_user_id" INTEGER NOT NULL,
    "is_active" BOOLEAN,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("admin_user_id")
);

-- CreateTable
CREATE TABLE "assignment" (
    "assignment_id" SERIAL NOT NULL,
    "classroom_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "assignment_number" INTEGER,
    "due_date" DATE NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assignment_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateTable
CREATE TABLE "assignment_submission" (
    "assignment_submission_id" SERIAL NOT NULL,
    "assignment_id" INTEGER NOT NULL,
    "student_user_id" INTEGER NOT NULL,
    "s3_path" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assignment_submission_pkey" PRIMARY KEY ("assignment_submission_id")
);

-- CreateTable
CREATE TABLE "classroom" (
    "classroom_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "capacity" INTEGER,
    "teacher_user_id" INTEGER NOT NULL,
    "start_date" DATE,
    "end_date" DATE,

    CONSTRAINT "classroom_pkey" PRIMARY KEY ("classroom_id")
);

-- CreateTable
CREATE TABLE "organization" (
    "organization_id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "website" TEXT,
    "old_id" UUID,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("organization_id")
);

-- CreateTable
CREATE TABLE "question" (
    "question_id" SERIAL NOT NULL,
    "assignment_id" INTEGER NOT NULL,
    "question_number" INTEGER,
    "name" TEXT,
    "prompt" TEXT,
    "example_solution_s3_path" TEXT,
    "accepted_file_types" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "question_submission" (
    "question_submission_id" SERIAL NOT NULL,
    "assignment_submission_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "student_user_id" INTEGER NOT NULL,
    "s3_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_submission_pkey" PRIMARY KEY ("question_submission_id")
);

-- CreateTable
CREATE TABLE "scholarship" (
    "scholarship_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "award" TEXT,
    "description" TEXT,
    "category" TEXT,
    "eligibility" TEXT,
    "region" TEXT,
    "deadline" DATE,
    "fafsa" BOOLEAN DEFAULT false,
    "gpa" DECIMAL(3,2),
    "admin_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scholarship_pkey" PRIMARY KEY ("scholarship_id")
);

-- CreateTable
CREATE TABLE "student" (
    "student_user_id" INTEGER NOT NULL,
    "joined_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "student_pkey" PRIMARY KEY ("student_user_id")
);

-- CreateTable
CREATE TABLE "student_classroom" (
    "student_classroom_id" SERIAL NOT NULL,
    "classroom_id" INTEGER NOT NULL,
    "student_user_id" INTEGER NOT NULL,
    "enrolled_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_classroom_pkey" PRIMARY KEY ("student_classroom_id")
);

-- CreateTable
CREATE TABLE "student_scholarship" (
    "student_scholarship_id" SERIAL NOT NULL,
    "student_user_id" INTEGER NOT NULL,
    "scholarship_id" INTEGER NOT NULL,
    "is_bookmarked" BOOLEAN DEFAULT false,

    CONSTRAINT "student_scholarship_pkey" PRIMARY KEY ("student_scholarship_id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "teacher_user_id" INTEGER NOT NULL,
    "hire_date" DATE,
    "termination_date" DATE,
    "joined_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("teacher_user_id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "role" TEXT,
    "payment_info" TEXT,
    "invite_code" UUID,
    "signup_complete" BOOLEAN,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "timezone" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_classroom" (
    "user_classroom_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "classroom_id" INTEGER NOT NULL,
    "role" TEXT,

    CONSTRAINT "user_classroom_pkey" PRIMARY KEY ("user_classroom_id")
);

-- CreateTable
CREATE TABLE "user_organization" (
    "user_organization_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL,

    CONSTRAINT "user_organization_pkey" PRIMARY KEY ("user_organization_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_classroom_id" ON "user_classroom"("user_id", "classroom_id");

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classroom"("classroom_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submission" ADD CONSTRAINT "assignment_submission_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignment"("assignment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignment_submission" ADD CONSTRAINT "assignment_submission_student_user_id_fkey" FOREIGN KEY ("student_user_id") REFERENCES "student"("student_user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_teacher_user_id_fkey" FOREIGN KEY ("teacher_user_id") REFERENCES "teacher"("teacher_user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignment"("assignment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_submission" ADD CONSTRAINT "question_submission_assignment_submission_id_fkey" FOREIGN KEY ("assignment_submission_id") REFERENCES "assignment_submission"("assignment_submission_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "question_submission" ADD CONSTRAINT "question_submission_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "question_submission" ADD CONSTRAINT "question_submission_student_user_id_fkey" FOREIGN KEY ("student_user_id") REFERENCES "student"("student_user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scholarship" ADD CONSTRAINT "scholarship_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("admin_user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scholarship" ADD CONSTRAINT "scholarship_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("organization_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_student_user_id_fkey" FOREIGN KEY ("student_user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_classroom" ADD CONSTRAINT "student_classroom_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classroom"("classroom_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_classroom" ADD CONSTRAINT "student_classroom_student_user_id_fkey" FOREIGN KEY ("student_user_id") REFERENCES "student"("student_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_scholarship" ADD CONSTRAINT "student_scholarship_scholarship_id_fkey" FOREIGN KEY ("scholarship_id") REFERENCES "scholarship"("scholarship_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_scholarship" ADD CONSTRAINT "student_scholarship_student_user_id_fkey" FOREIGN KEY ("student_user_id") REFERENCES "student"("student_user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_teacher_user_id_fkey" FOREIGN KEY ("teacher_user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_classroom" ADD CONSTRAINT "user_classroom_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classroom"("classroom_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_classroom" ADD CONSTRAINT "user_classroom_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("organization_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
