import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email, sanadId } = await request.json();

    if (!email || !sanadId) {
      return NextResponse.json(
        { message: 'Email and Sanad ID are required' },
        { status: 400 }
      );
    }

    // Check if user exists with either email or sanadId
    const existingUser = await User.findOne({
      $or: [{ email }, { sanadId }]
    }).select('-password');

    if (existingUser) {
      return NextResponse.json({
        exists: true,
        user: {
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          mobileNumber: existingUser.mobileNumber,
          age: existingUser.age,
          isPaid: existingUser.isPaid,
          paidAmount: existingUser.paidAmount
        }
      });
    }

    return NextResponse.json({
      exists: false,
      user: null
    });
  } catch (error) {
    console.error('Check existing user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}