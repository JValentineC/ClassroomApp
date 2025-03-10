import { NextApiRequest, NextApiResponse } from 'next';
import { handleAuth, handleLogin, handleLogout, handleCallback, Session } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/query/users';

export const GET = handleAuth({
  // Login
  async login(req: NextApiRequest, res: NextApiResponse) {
    const { searchParams } = new URL(req.url ?? '');
    const screen_hint = searchParams.get('screen_hint');

    const login = await handleLogin(req, res, {
      authorizationParams: {
        screen_hint: screen_hint ?? undefined,
        prompt: 'login',
      },
    });
    return login;
  },

  // Callback
  callback: handleCallback({
    async afterCallback(req: NextRequest, session: Session, state?: { [key: string]: any }) {
      if (!session?.user) {
        throw new Error('User object not found in session');
      }

      // Initialize the user in the database if necessary.
      const { name, email } = session.user;
      await createUser({ name, email });

      // Redirect to Portal
      if (state) {
        state.returnTo = '/';
      }

      return session;
    },
  }),

  // Logout
  async logout(req: NextApiRequest, res: NextApiResponse) {
    return await handleLogout(req, res, {
      returnTo: '/',
    });
  },
});
