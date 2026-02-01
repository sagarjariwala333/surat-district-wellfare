import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { encrypt } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { User } from '@/models';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session
    const sessionData = {
      userId: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    };

    const session = await encrypt(sessionData);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('user_session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: sessionData.expires,
    });

    return NextResponse.json(
      { message: 'Login successful', user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}