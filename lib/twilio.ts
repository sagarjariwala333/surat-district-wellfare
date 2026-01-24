import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Sends a WhatsApp message using Twilio
 * @param to - The recipient's WhatsApp number (with country code, e.g., whatsapp:+919876543210)
 * @param message - The text message to send
 */
export async function sendWhatsAppMessage(to: string, message: string) {
    console.log('WhatsApp message sent to:', to);
    console.log('WhatsApp message:', message);
    if (!to || !message) {
        console.error('WhatsApp Error: "to" or "message" is missing');
        return { success: false, error: 'Recipient or message is empty' };
    }

    try {
        const rawTo = to.trim();
        const rawFrom = fromWhatsAppNumber?.trim() || '';


        const formattedTo = rawTo.startsWith('whatsapp:') ? rawTo : `whatsapp:${rawTo}`;
        const formattedFrom = rawFrom.startsWith('whatsapp:') ? rawFrom : `whatsapp:${rawFrom}`;

        const response = await client.messages.create({
            body: message,
            from: formattedFrom,
            to: formattedTo,
        });

        console.log('WhatsApp message sent:', response.sid);
        return { success: true, sid: response.sid };
    } catch (error) {
        console.error('Twilio Error:', error);
        return { success: false, error: (error as Error).message };
    }
}

