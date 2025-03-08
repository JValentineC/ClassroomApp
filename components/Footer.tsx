import { siteConfig } from '@/config/site';
import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <div className="w-full flex items-center justify-center gap-6 py-3">
      {/* Copyright notice */}
      <p className="text-center text-default-600">
        &copy; {new Date().getFullYear()} {siteConfig.name}
      </p>
      {/* Terms & Privacy */}
      <Link href="/terms" target="_blank" rel="noopener noreferrer" className="ml-2 text-default-600">
        Terms & Privacy
      </Link>
    </div>
  );
}
