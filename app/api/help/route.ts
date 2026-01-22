import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { HelpRequest } from '@/models';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const newRequest = await HelpRequest.create(body);

    return NextResponse.json({ message: 'Success', request: newRequest }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}
