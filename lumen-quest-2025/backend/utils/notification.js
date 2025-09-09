const nodemailer = require('nodemailer');

// Create Gmail SMTP transporter (temporary solution)
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.GMAIL_APP_PASSWORD // You'll need to generate this
    }
  });
};

// Send email function using Gmail SMTP
const sendEmail = async (to, subject, text) => {
  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      text: text,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
               <h2 style="color: #0066ff;">Welcome to Lumen Quest!</h2>
               <p style="font-size: 16px; color: #333;">${text}</p>
               <hr style="border: 1px solid #eee; margin: 20px 0;">
               <p style="font-size: 14px; color: #666;">
                 This is an automated message from Lumen Quest Telecom Inventory Management System.
               </p>
             </div>`
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully via Gmail SMTP');
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email via Gmail:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail
};
