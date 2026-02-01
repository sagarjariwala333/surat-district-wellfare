import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import { User } from '@/models';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent a password reset link.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to user
    await User.findByIdAndUpdate(user._id, {
      resetToken,
      resetTokenExpiry,
    });

    // In a real application, you would send an email here
    // For now, we'll just log the reset link
    console.log(`Password reset link for ${email}: ${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`);

    return NextResponse.json(
      { message: 'If an account with that email exists, we have sent a password reset link.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}