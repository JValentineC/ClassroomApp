'use client';

import * as React from 'react';
import { NextUIProvider } from '@nextui-org/system';
import { useRouter } from 'next/navigation';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <UserProvider>
      <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
    </UserProvider>
  );
}
