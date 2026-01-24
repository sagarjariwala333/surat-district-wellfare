import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/twilio';

export async function POST(request: NextRequest) {
    try {
        const { to, message } = await request.json();

        if (!to || !message) {
            return NextResponse.json(
                { message: 'Missing parameters: "to" and "message" are required.' },
                { status: 400 }
            );
        }

        const result = await sendWhatsAppMessage(to, message);

        if (result.success) {
            return NextResponse.json({
                message: 'WhatsApp message sent successfully!',
                sid: result.sid
            });
        } else {
            return NextResponse.json(
                {
                    message: 'Failed to send WhatsApp message',
                    error: result.error,
                    diagnostic: {
                        to: to.replace(/(.{7}).*(.{3})/, '$1***$2'),
                        fromExists: !!process.env.TWILIO_WHATSAPP_NUMBER,
                        fromValue: process.env.TWILIO_WHATSAPP_NUMBER ? process.env.TWILIO_WHATSAPP_NUMBER.replace(/(.{7}).*(.{3})/, '$1***$2') : 'MISSING'
                    }
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('WhatsApp Test Endpoint Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
