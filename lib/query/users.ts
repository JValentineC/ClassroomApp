import prisma from '@/lib/postgres/db';
import { user } from '@prisma/client';

export async function getUserById(userId: number): Promise<user | user[] | null> {
  const dbUser = prisma.user.findUnique({
    where: { user_id: userId },
  });
  return dbUser;
}

export async function getUserByEmail(email: string): Promise<user | user[] | null> {
  const dbUser = prisma.user.findUnique({
    where: { email: email },
  });
  return dbUser;
}

export async function createUser(data: { name: string; email: string }): Promise<user | user[] | null> {
  const dbUser = await getUserByEmail(data.email);
  if (dbUser) {
    return dbUser;
  }
  const newUser = prisma.user.create({
    data,
  });
  return newUser;
}

export async function deleteUser(userId: number): Promise<user | user[] | null> {
  const deletedUser = prisma.user.delete({
    where: { user_id: userId },
  });
  return deletedUser;
}
