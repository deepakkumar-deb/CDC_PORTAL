export { default } from 'next-auth/middleware';
export const config = {
  matcher: ['/dashboard/:path*', '/jnf/:path*', '/inf/:path*', '/admin/:path*'],
};