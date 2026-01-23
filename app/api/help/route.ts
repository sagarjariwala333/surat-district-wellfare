import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { HelpRequest } from '@/models';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, mobileNumber, description } = body;

    // Server-side validation
    if (!title || title.trim().length < 5) {
      return NextResponse.json({ message: 'Title must be at least 5 characters' }, { status: 400 });
    }
    const mobileRegex = /^\d{10}$/;
    if (!mobileNumber || !mobileRegex.test(mobileNumber)) {
      return NextResponse.json({ message: 'Mobile number must be 10 digits' }, { status: 400 });
    }
    if (!description || description.trim().length < 20) {
      return NextResponse.json({ message: 'Description must be at least 20 characters' }, { status: 400 });
    }

    const newRequest = await HelpRequest.create({
      title,
      mobileNumber,
      description
    });

    return NextResponse.json({ message: 'Success', request: newRequest }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}
