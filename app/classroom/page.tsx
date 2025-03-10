'use client';

import { useEffect, useState } from 'react';
import { Classroom } from '@/types/classroom';
import Link from 'next/link';

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [userId, setUserId] = useState(''); // TODO: Replace with actual user ID from authentication
  const [error, setError] = useState('');
  const [isFetched, setIsFetched] = useState(false); // New state variable

  const fetchClassrooms = async () => {
    if (!userId) {
      setError('Please enter a valid User ID');
      return;
    }

    try {
      setError('');
      const response = await fetch(`/api/user_classroom?userId=${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch classrooms');
      }

      const data: Classroom[] = await response.json();
      //const data = await response.json();
      setClassrooms(data || []);
      setIsFetched(true); // Set isFetched to true upon successful fetch
    } catch (err) {
      setError('Error fetching classrooms');
      console.error(err);
    }
  };

  return (
    <>
      {!isFetched && ( // Conditionally render the input form
        <div>
          <label>
            Please Enter your User ID:
            <input
              type="number"
              value={userId}
              placeholder="Type here"
              onChange={e => setUserId(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <br></br>
          <button className="btn" onClick={fetchClassrooms}>
            Get Classroom
          </button>
        </div>
      )}

      {/* Error Handling */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {classrooms.length > 0 ? (
        <div className="p-6">
          <h1 className="text-3xl font-bold">Courses</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classrooms.map(classroom => (
              <Link
                key={classroom.classroom_id}
                href={`/classroom/${classroom.classroom_id}/${userId}?classname=${classroom.name}`}
                className="no-underline"
              >
                <div className="card card-side bg-base-300 shadow-2xl w-96 border-gray-100">
                  <div className="card-body">
                    <div className="card-actions justify-end">
                      <button>{classroom.teacher_user_id === Number(userId) ? 'Instructor' : 'Student'}</button>
                    </div>
                    <h1 className="card-title text-blue-500">{classroom.name}</h1>
                    <p className="font-light">{classroom.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p>No classrooms found.</p>
      )}
    </>
  );
}
