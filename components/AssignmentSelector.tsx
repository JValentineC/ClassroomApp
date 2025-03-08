import React from 'react';
import { Assignment } from '@/types/classroom';

interface AssignmentSelectorProps {
  assignments: Assignment[];
  selectedAssignmentId: number | null;
  onSelectAssignment: (assignmentId: number) => void;
}

const AssignmentSelector: React.FC<AssignmentSelectorProps> = ({
  assignments,
  selectedAssignmentId,
  onSelectAssignment,
}) => {
  return (
    <select
      className="select select-bordered w-full mt-2"
      value={selectedAssignmentId ?? ''}
      onChange={e => onSelectAssignment(Number(e.target.value))}
    >
      <option value="" disabled>
        Choose an Assignment
      </option>
      {assignments.map(assignment => (
        <option key={assignment.assignment_id} value={assignment.assignment_id}>
          {assignment.name}
        </option>
      ))}
    </select>
  );
};

export default AssignmentSelector;
