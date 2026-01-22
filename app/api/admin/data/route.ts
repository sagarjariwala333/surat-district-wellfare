import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User, HelpRequest } from '@/models';

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find({ isPaid: true }).sort({ createdAt: -1 });
    const helpRequests = await HelpRequest.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      users,
      helpRequests,
      stats: {
        totalPaid: users.length,
        totalRevenue: users.length * 2000,
        totalHelpRequests: helpRequests.length,
      }
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
