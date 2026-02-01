import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { User } from '@/models';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const cookieStore = await cookies();
    const session = cookieStore.get('user_session')?.value;
    
    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const sessionData = await decrypt(session);
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(sessionData.userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await User.findByIdAndUpdate(sessionData.userId, {
      password: hashedNewPassword
    });

    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}