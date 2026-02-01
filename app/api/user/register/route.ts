import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import { User } from '@/models';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { firstName, lastName, email, mobileNumber, sanadId, age, password } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !mobileNumber || !sanadId || !age || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { sanadId }]
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email or Sanad ID already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      mobileNumber,
      sanadId,
      age: parseInt(age),
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: 'User registered successfully', userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}