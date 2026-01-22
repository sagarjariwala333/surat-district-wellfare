import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Simple simulation of payment
    const newUser = await User.create({
      ...body,
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
