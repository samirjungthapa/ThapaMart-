export const sendSMS = async ({ to, body }) => {
  // Normalize phone number to E.164 format
  let cleanPhone = to.replace(/[\s\-\(\)]/g, ''); // strip spaces, hyphens, parentheses
  if (!cleanPhone.startsWith('+')) {
    // If it's a 10-digit number starting with 9, prepend Nepal country code +977
    if (cleanPhone.length === 10 && cleanPhone.startsWith('9')) {
      cleanPhone = `+977${cleanPhone}`;
    } else {
      cleanPhone = `+${cleanPhone}`;
    }
  }

  const isConfigured = 
    process.env.TWILIO_ACCOUNT_SID && !process.env.TWILIO_ACCOUNT_SID.includes('your_') && !process.env.TWILIO_ACCOUNT_SID.includes('your-') &&
    process.env.TWILIO_AUTH_TOKEN && !process.env.TWILIO_AUTH_TOKEN.includes('your_') && !process.env.TWILIO_AUTH_TOKEN.includes('your-') &&
    process.env.TWILIO_PHONE_NUMBER && !process.env.TWILIO_PHONE_NUMBER.includes('your_') && !process.env.TWILIO_PHONE_NUMBER.includes('your-');

  if (!isConfigured) {
    console.log('\n==================================================');
    console.log(`📱  SIMULATED SMS SENT TO: ${cleanPhone} (Original: ${to})`);
    console.log(`📱  MESSAGE: ${body}`);
    console.log('==================================================\n');
    return { simulated: true };
  }

  try {
    const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
    
    const params = new URLSearchParams();
    params.append('To', cleanPhone);
    params.append('From', process.env.TWILIO_PHONE_NUMBER);
    params.append('Body', body);

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send SMS via Twilio');
    }

    console.log(`🔌 SMS successfully sent: ${data.sid}`);
    return data;
  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
    throw error;
  }
};
