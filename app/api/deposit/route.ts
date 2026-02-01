import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { User } from '@/models';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { firstName, lastName, email, mobileNumber, sanadId, age, password, isExistingUser } = body;

    // Server-side validation
    if (!firstName || firstName.trim().length < 2) {
      return NextResponse.json({ message: 'First name must be at least 2 characters' }, { status: 400 });
    }
    if (!lastName || lastName.trim().length < 2) {
      return NextResponse.json({ message: 'Last name must be at least 2 characters' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }
    const mobileRegex = /^\d{10}$/;
    if (!mobileNumber || !mobileRegex.test(mobileNumber)) {
      return NextResponse.json({ message: 'Mobile number must be 10 digits' }, { status: 400 });
    }
    if (!sanadId || !sanadId.trim()) {
      return NextResponse.json({ message: 'Sanad ID is required' }, { status: 400 });
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      return NextResponse.json({ message: 'Age must be between 18 and 100' }, { status: 400 });
    }

    // Password validation for new users
    if (!isExistingUser && (!password || password.length < 6)) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    let user;
    let autoLogin = false;

    if (isExistingUser) {
      // Update existing user's payment
      user = await User.findOne({
        $or: [{ email }, { sanadId }]
      });

      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      // Update payment information
      await User.findByIdAndUpdate(user._id, {
        paidAmount: user.paidAmount + 2000,
        isPaid: true,
        paymentDate: new Date(),
      });

      user = await User.findById(user._id);
    } else {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { sanadId }]
      });

      if (existingUser) {
        return NextResponse.json({ 
          message: 'User with this email or Sanad ID already exists. Please use the existing user option.' 
        }, { status: 400 });
      }

      // Hash password for new user
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user with payment
      user = await User.create({
        firstName,
        lastName,
        email,
        mobileNumber,
        sanadId,
        age: ageNum,
        password: hashedPassword,
        paidAmount: 2000,
        isPaid: true,
        paymentDate: new Date(),
      });

      // Auto-login new user
      autoLogin = true;
    }

    // Create session for auto-login
    if (autoLogin) {
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
    }

    return NextResponse.json({ 
      message: 'Payment successful', 
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isPaid: user.isPaid,
        paidAmount: user.paidAmount
      },
      autoLogin 
    }, { status: 201 });
  } catch (err: any) {
    console.error('Deposit error:', err);
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}
