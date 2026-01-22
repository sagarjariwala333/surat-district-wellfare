import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminUsername || !adminPasswordHash) {
      return NextResponse.json(
        { message: 'Admin credentials not configured' },
        { status: 500 }
      );
    }

    if (username === adminUsername && bcrypt.compareSync(password, adminPasswordHash)) {
      // Create session
      const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
      const session = await encrypt({ username, expires });

      // Set cookie
      (await cookies()).set('admin_session', session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    }

    return NextResponse.json(
      { message: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
