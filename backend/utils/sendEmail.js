import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
  const isConfigured = 
    process.env.SMTP_HOST && 
    process.env.SMTP_PORT && 
    process.env.SMTP_USER && 
    process.env.SMTP_PASS;

  if (!isConfigured) {
    console.log('\n==================================================');
    console.log(`✉️  SIMULATED EMAIL SENT TO: ${to}`);
    console.log(`✉️  SUBJECT: ${subject}`);
    console.log(`✉️  TEXT CONTENT: ${text}`);
    console.log('==================================================\n');
    return { simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"ThapaMart Premium" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`🔌 Email successfully sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw error;
  }
};
