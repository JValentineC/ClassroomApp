import { createUser, getUserById } from '@/lib/query/users';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { userId } = body;
    const data = await getUserById(Number(userId));
    return Response.json({ data: data }, { status: 200 });
  } catch (e) {
    console.log(e);
    return Response.json({ error: `Internal Server Error: ${e}` }, { status: 500 });
  }
}
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const { name, email } = body;
    const data = await createUser({ name, email });
    return Response.json({ data: data }, { status: 200 });
  } catch (e) {
    console.log(e);
    return Response.json({ error: `Internal Server Error: ${e}` }, { status: 500 });
  }
}
