'use client';

import { useEffect, useState } from 'react';
import TeacherForm from '@/components/TeacherForm';
import StudentForm from '@/components/StudentForm';

export default function ClassroomPage({ params }: { params: { classroomId: string; userId: string } }) {
  //TODO: remove userId from params and replace with actual user ID from authentication
  const classroomId = params.classroomId;
  const userId = Number(params.userId); // TODO: Replace with actual user ID from authentication
  //TODO: Replace hardcoded userRole above with the role fetching logic below
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [classname, setClassname] = useState<string>('');

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const classnameParam = queryParams.get('classname');
    if (classnameParam) {
      setClassname(classnameParam);
    }

    async function fetchUserRole() {
      try {
        const response = await fetch(`/api/user_classroom?userId=${userId}&classroomId=${classroomId}`);
        const data = await response.json();
        setUserRole(data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserRole();
  }, [userId, classroomId]);
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      {/* <h1 className="text-3xl font-bold">Classroom {classroomId}</h1> */}
      {userRole === 'student' && <StudentForm classroomId={classroomId} userId={userId} name={classname} />}
      {(userRole === 'teacher' || userRole === 'teaching_assistant') && (
        <TeacherForm classroomId={classroomId} name={classname} userId={userId} />
      )}

      {userRole === 'admin' && (
        <>
          <TeacherForm classroomId={classroomId} name={classname} userId={userId} />
          <StudentForm classroomId={classroomId} userId={userId} name={classname} />
        </>
      )}
    </div>
  );
}
