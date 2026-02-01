import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { User } from '@/models';

export async function GET() {
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
    const user = await User.findById(sessionData.userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Mock payment history for now - you can implement actual payment tracking later
    const payments = user.isPaid ? [{
      _id: 'payment_1',
      amount: user.paidAmount,
      date: user.paymentDate || user.createdAt,
      status: 'completed'
    }] : [];

    return NextResponse.json({
      ...user.toObject(),
      payments
    });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}