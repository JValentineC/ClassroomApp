import Link from 'next/link';
import React from 'react';

const AlumniPage = () => {
  return (
    <div>
      <h1>Alumni Page</h1>

      <Link href="/alumni/scholarships">See scholarships here!</Link>
    </div>
  );
};

export default AlumniPage;
