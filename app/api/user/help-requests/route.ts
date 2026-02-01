import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { HelpRequest } from '@/models';

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
    const helpRequests = await HelpRequest.find({ userId: sessionData.userId })
      .sort({ createdAt: -1 });

    return NextResponse.json(helpRequests);
  } catch (error) {
    console.error('Help requests error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const { title, description, mobileNumber } = await request.json();

    if (!title || !description || !mobileNumber) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const helpRequest = await HelpRequest.create({
      title,
      description,
      mobileNumber,
      userId: sessionData.userId,
    });

    return NextResponse.json(
      { message: 'Help request submitted successfully', requestId: helpRequest._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Help request creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}