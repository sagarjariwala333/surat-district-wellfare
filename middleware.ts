import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('admin_session')?.value;

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await decrypt(session);
      return NextResponse.next();
    } catch (error) {
      console.error('Session decryption failed:', error);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect user dashboard and change password routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/change-password')) {
    const userSession = request.cookies.get('user_session')?.value;
    
    if (!userSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      await decrypt(userSession);
      return NextResponse.next();
    } catch (error) {
      console.error('User session decryption failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/change-password'],
};
