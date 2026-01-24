import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { HelpRequest } from '@/models';
import { sendWhatsAppMessage } from '@/lib/twilio';


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

    // 1. Notify the Requester (using the mobile number from the form)
    try {
      const userMessage = `Hello! User having mobile number ${mobileNumber}, submitted help request related to "${title}".`;
      await sendWhatsAppMessage(process.env.WHATSAPP_NUMBER ?? '+919723353062', userMessage);
    } catch (err) {
      console.error('Requester notification failed:', err);
    }

    // 2. Notify the Admin (if WHATSAPP_NUMBER is set in .env)
    const adminNumber = process.env.WHATSAPP_NUMBER;
    if (adminNumber) {
      try {
        const adminMessage = `New Help Request Submitted!\nTitle: ${title}\nMobile: ${mobileNumber}\nDescription: ${description.substring(0, 100)}...`;
        await sendWhatsAppMessage(adminNumber, adminMessage);
      } catch (err) {
        console.error('Admin notification failed:', err);
      }
    }


    return NextResponse.json({ message: 'Success', request: newRequest }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}
