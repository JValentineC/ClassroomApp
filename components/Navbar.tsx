'use client';

import Link from 'next/link';
import React from 'react';
import { NAV_TABS } from '@/config/constants';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Navbar() {
  const { user, isLoading: isUserLoading } = useUser();

  return (
    <div className="flex flex-wrap w-full">
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {Object.entries(NAV_TABS).map(([title, url], idx) => (
                <li key={idx}>
                  <Link href={url}>{title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <Link href={'/'}>
            <p className="btn btn-ghost text-xl">Code Your Dreams</p>
          </Link>
        </div>
        <div className="navbar-end">
          {isUserLoading ? (
            <></>
          ) : user ? (
            <Link className="btn mx-2" href="/api/auth/logout">
              Log Out
            </Link>
          ) : (
            <>
              <Link className="btn mx-2" href={'/api/auth/login?screen_hint=signup'}>
                Sign Up
              </Link>
              <Link className="btn mx-2" href={'/api/auth/login'}>
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
