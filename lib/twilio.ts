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
    console.log('--- WhatsApp Debug ---');
    console.log('To:', to);
    console.log('From Env:', fromWhatsAppNumber);
    console.log('SID Length:', accountSid?.length || 0);
    console.log('Token Length:', authToken?.length || 0);
    console.log('Number Length:', fromWhatsAppNumber?.length || 0);


    try {
        // Validate credentials first
        console.log('Validating Twilio credentials...');
        try {
            await client.api.v2010.accounts(accountSid!).fetch();
            console.log('Credentials valid.');
        } catch (authError) {
            console.error('Twilio Authentication Failed:', authError);
            return { success: false, error: 'Twilio Authentication Failed. Check SID/Token.' };
        }

        // Ensure the number is formatted for WhatsApp and trimmed
        const rawTo = to.trim();
        const rawFrom = fromWhatsAppNumber?.trim() || '';

        const formattedTo = rawTo.startsWith('whatsapp:') ? rawTo : `whatsapp:${rawTo}`;
        const formattedFrom = rawFrom.startsWith('whatsapp:') ? rawFrom : `whatsapp:${rawFrom}`;

        console.log('Formatted To:', formattedTo);
        console.log('Formatted From:', formattedFrom);


        const response = await client.messages.create({
            body: message,
            from: formattedFrom,
            to: formattedTo,
        });

        console.log('WhatsApp message sent successfully:', response.sid);
        return { success: true, sid: response.sid };
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return { success: false, error: (error as Error).message };
    }
}
