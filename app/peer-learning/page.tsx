import Link from 'next/link';
import React from 'react';

export default function MentorshipPage() {
  return (
    <div>
      <h1>Peer Learning!</h1>
      <h2>Sign up for the mentorship program:</h2>
      <ul>
        <li key={'mentees'}>
          <Link href="/mentees">Mentees</Link>
        </li>
        <li key={'mentors'}>
          <Link href="/mentors">Mentors</Link>
        </li>
      </ul>
    </div>
  );
}
