import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const isLoginPage = pathname === '/admin/login';

    // Si ya está logueado y va al login, mándalo al dashboard
    if (isLoginPage && token?.roles?.includes('admin')) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    // Verificar rol de admin si no está en el login
    if (!isLoginPage && (!token?.roles || !token.roles.includes('admin'))) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      if (token) loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Si authorized devuelve false, withAuth redirige automáticamente al login
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname === '/admin/login') return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
