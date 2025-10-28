# Email Configuration Guide

The contact form is fully implemented and ready to send emails. You just need to configure the SMTP settings.

## Option 1: Using Gmail (Recommended for Production)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and your device
3. Click "Generate"
4. Copy the 16-character password

### Step 3: Update .env File
Copy `server/.env.example` to `server/.env` and update:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
CONTACT_EMAIL=office@pjinfra.com
```

## Option 2: Using Mailtrap (Recommended for Testing)

Mailtrap is a free email testing service that catches all emails so you can test without sending real emails.

### Step 1: Sign Up
1. Go to https://mailtrap.io
2. Create a free account
3. Go to "Email Testing" → "Inboxes" → "My Inbox"

### Step 2: Get Credentials
Copy the SMTP credentials shown on the page

### Step 3: Update .env File
```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
CONTACT_EMAIL=office@pjinfra.com
```

## Option 3: Using Other SMTP Services

You can also use:
- **SendGrid**: Up to 100 emails/day free
- **Mailgun**: Up to 5,000 emails/month free
- **Outlook/Hotmail**: smtp-mail.outlook.com:587
- **Yahoo Mail**: smtp.mail.yahoo.com:465

## Current Configuration

The contact form will:
1. Send an email to `office@pjinfra.com` (or whatever you set in CONTACT_EMAIL)
2. Send a confirmation email to the person who submitted the form
3. Include all form fields: name, email, phone, company, subject, message
4. Use a professional HTML email template

## Testing the Contact Form

1. Make sure your backend server is running: `cd server && npm start`
2. Make sure your frontend is running: `cd .. && npm start`
3. Go to http://localhost:3000/contact
4. Fill out the form and submit
5. Check your configured email inbox (or Mailtrap inbox if using Mailtrap)

## Troubleshooting

### "Invalid login" error
- Double-check your SMTP_USER and SMTP_PASS
- For Gmail, make sure you're using an App Password, not your regular password
- Make sure 2FA is enabled on your Google account

### Emails not arriving
- Check spam folder
- Verify CONTACT_EMAIL is correct
- Check server console for error messages
- Try using Mailtrap first to confirm everything works

### Port issues
- Port 587 is standard for TLS
- Port 465 requires `secure: true` in nodemailer config
- Port 25 is often blocked by ISPs

## Next Steps

1. Copy `server/.env.example` to `server/.env`
2. Choose one of the options above and configure your SMTP settings
3. Restart your server
4. Test the contact form!

The email recipient (office@pjinfra.com) can be changed by updating the `CONTACT_EMAIL` variable in your `.env` file.
