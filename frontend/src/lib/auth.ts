import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `http://127.0.0.1:8000/api/auth/login`,
            {
              email:    credentials?.email,
              password: credentials?.password,
            },
            { headers: { Accept: 'application/json' } }
          );

          if (res.data.success && res.data.token) {
            return {
              id:    res.data.user.id,
              name:  res.data.user.name,
              email: res.data.user.email,
              role:  res.data.user.role,
              token: res.data.token,
            };
          }
          return null;
        } catch (error: any) {
          console.error("Login failed:", error.message, error.response?.data);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id    = user.id;
        token.role  = user.role;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id as string;
        session.user.role = token.role as string;
      }
      session.token     = token.token as string;
      return session;
    },
  },

  pages: {
    signIn: '/auth/login',
  },

  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
