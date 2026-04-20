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
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const res = await axios.post(
            `${API_URL}/auth/login`,
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
              profile_picture: res.data.user.profile_picture,
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id    = user.id;
        token.role  = user.role;
        token.token = user.token;
        token.profile_picture = user.profile_picture;
      }
      // Handle Live Updates
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.profile_picture) token.profile_picture = session.profile_picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id as string;
        session.user.role = token.role as string;
        session.user.profile_picture = token.profile_picture as string;
        // Ensure name is synced from token if it was updated
        session.user.name = token.name as string;
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
