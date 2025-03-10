const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Cleanup existing data
  await prisma.assignment.deleteMany({});
  await prisma.classroom.deleteMany({});
  await prisma.user.deleteMany({});

  // Create dummy users with unique emails
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: `john.doe+${Date.now()}@example.com`, // Ensure unique email
      role: 'student',
      signup_complete: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: `jane.smith+${Date.now()}@example.com`, // Ensure unique email
      role: 'teacher',
      signup_complete: true,
    },
  });

  // Create a teacher record
  const teacher = await prisma.teacher.create({
    data: {
      teacher_user_id: user2.user_id,
      hire_date: new Date(),
      is_active: true,
    },
  });

  console.log('Created Users and Teacher:', { user1, user2, teacher });

  // Create a classroom
  const classroom = await prisma.classroom.create({
    data: {
      name: 'Math 101',
      description: 'Basic Math Class',
      teacher_user_id: user2.user_id, // Ensure this matches the teacher's user_id
    },
  });

  // Create an assignment
  const assignment = await prisma.assignment.create({
    data: {
      name: 'Homework 1',
      description: 'First homework assignment',
      classroom_id: classroom.classroom_id,
      due_date: new Date('2025-03-15'),
    },
  });

  console.log({ user1, user2, teacher, classroom, assignment });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });