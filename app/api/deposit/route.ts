import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { firstName, lastName, email, mobileNumber, sanadId, age } = body;

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

    // Simple simulation of payment
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      mobileNumber,
      sanadId,
      age: ageNum,
      paidAmount: 2000,
      isPaid: true,
      paymentDate: new Date(),
    });

    return NextResponse.json({ message: 'Success', user: newUser }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}
