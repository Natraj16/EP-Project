const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Contact form endpoint
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Create email transporter
    // Note: You'll need to configure these settings with real SMTP credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Your email
        pass: process.env.SMTP_PASS  // Your email password or app password
      }
    });

    // Email content for office
    const officeMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || 'office@pjinfra.com',
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1f2937; }
            .value { color: #4b5563; margin-left: 10px; }
            .message-box { background-color: white; padding: 15px; border-left: 4px solid #2563eb; margin-top: 15px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span>
                <span class="value">${name}</span>
              </div>
              <div class="field">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:${email}">${email}</a></span>
              </div>
              ${phone ? `
              <div class="field">
                <span class="label">Phone:</span>
                <span class="value">${phone}</span>
              </div>
              ` : ''}
              ${company ? `
              <div class="field">
                <span class="label">Company:</span>
                <span class="value">${company}</span>
              </div>
              ` : ''}
              ${subject ? `
              <div class="field">
                <span class="label">Subject:</span>
                <span class="value">${subject}</span>
              </div>
              ` : ''}
              <div class="message-box">
                <div class="label">Message:</div>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
              <div class="field" style="margin-top: 20px; font-size: 12px; color: #6b7280;">
                <span class="label">Submitted:</span>
                <span class="value">${new Date().toLocaleString('en-US', { 
                  dateStyle: 'full', 
                  timeStyle: 'long' 
                })}</span>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from the PJ Infra contact form</p>
              <p>Please reply to: ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      replyTo: email
    };

    // Email confirmation to user
    const userMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Thank you for contacting PJ Infra',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Thank You for Contacting Us!</h2>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for reaching out to PJ Infra. We have received your message and will get back to you as soon as possible.</p>
              <p><strong>Your message:</strong></p>
              <div style="background-color: white; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              <p>If you have any urgent inquiries, please feel free to contact us directly at:</p>
              <p>📧 Email: office@pjinfra.com<br>
              📞 Phone: [Your Phone Number]</p>
              <p>Best regards,<br>
              <strong>PJ Infra Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} PJ Infra. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send email to office
    await transporter.sendMail(officeMailOptions);
    
    // Send confirmation email to user
    await transporter.sendMail(userMailOptions);

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Handle specific email errors
    if (error.code === 'EAUTH') {
      return res.status(500).json({
        success: false,
        message: 'Email service configuration error. Please contact support.',
        error: 'Authentication failed'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
