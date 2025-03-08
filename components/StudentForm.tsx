import React, { useState } from 'react';
import ClassroomNavBar from './ClassroomNavBar';
import AssignmentSubmitForm from './AssignmentSubmitForm';
import StudentSubmissionView from './StudentSubmissionView';
const StudentForm = ({ classroomId, userId, name }: { classroomId: string; userId: number; name: string }) => {
  const [selectedOption, setSelectedOption] = useState('Submit Assignment'); // Default selected option

  const studentMenu = [
    { label: 'Submit Assignment', onClick: () => setSelectedOption('Submit Assignment') },
    { label: 'Your Submissions', onClick: () => setSelectedOption('Your Submissions') },
  ];

  return (
    <div>
      <ClassroomNavBar name={name} menuItems={studentMenu} />
      <div className="p-4">
        {selectedOption === 'Submit Assignment' && <AssignmentSubmitForm classroomId={classroomId} userId={userId} />}
        {selectedOption === 'Your Submissions' && <StudentSubmissionView classroomId={classroomId} userId={userId} />}
      </div>
    </div>
  );
};

export default StudentForm;
