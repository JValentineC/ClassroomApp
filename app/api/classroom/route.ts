import { NextResponse } from 'next/server';
import { getAllClassrooms } from '@/lib/query/classroom';

export async function GET() {
  try {
    const classrooms = await getAllClassrooms();
    return NextResponse.json(classrooms);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch classrooms' }, { status: 500 });
  }
}
