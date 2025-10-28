# Email Setup Guide for Contact Form

The contact form is already fully configured! When a user submits the form, it will:
1. ✅ Send an email to **office@pjinfra.com** with all the contact details
2. ✅ Send a confirmation email to the user thanking them for contacting

## 🔧 Configuration Required

You need to set up SMTP credentials in `server/.env` file:

### Option 1: Using Gmail (Recommended)

1. **Enable 2-Step Verification** on the Gmail account (office@pjinfra.com or another Gmail):
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select your device
   - Click "Generate"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

3. **Update `server/.env` file**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=office@pjinfra.com
   SMTP_PASS=abcd efgh ijkl mnop
   CONTACT_EMAIL=office@pjinfra.com
   ```

### Option 2: Using Other Email Services

#### SendGrid:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
CONTACT_EMAIL=office@pjinfra.com
```

#### Outlook/Office365:
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=office@pjinfra.com
SMTP_PASS=your-password
CONTACT_EMAIL=office@pjinfra.com
```

#### Custom SMTP Server:
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
CONTACT_EMAIL=office@pjinfra.com
```

## 📧 What Happens When Form is Submitted?

1. **Email to Office (office@pjinfra.com)**:
   - Professional formatted email with all contact details
   - Includes: Name, Email, Phone (if provided), Company (if provided), Subject, Message
   - Reply-to is set to the user's email
   - Timestamp of submission

2. **Confirmation Email to User**:
   - Thank you message
   - Copy of their message
   - Contact information for urgent inquiries
   - Professional branding

## 🚀 Testing

After configuring the SMTP settings:

1. **Restart the server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Test the contact form**:
   - Go to http://localhost:3000/contact
   - Fill in all fields
   - Click "Send Message"
   - Check office@pjinfra.com inbox
   - Check the user's email inbox for confirmation

## 🔒 Security Notes

- Never commit the `.env` file with real credentials to Git
- Use environment variables in production
- For Gmail, always use App Passwords, never your regular password
- Consider using a dedicated email service like SendGrid for production

## ⚠️ Troubleshooting

### Error: "Authentication failed"
- Check if 2-Step Verification is enabled
- Verify App Password is correct (no spaces)
- Make sure SMTP_USER matches the email generating the App Password

### Error: "Connection timeout"
- Check SMTP_HOST and SMTP_PORT
- Verify firewall isn't blocking port 587
- Try port 465 with `secure: true` in code

### Emails not received:
- Check spam folder
- Verify CONTACT_EMAIL is correct
- Check server logs for errors: `npm run dev` in server folder

## 📝 Current Setup

The contact form endpoint is: `POST http://localhost:5000/api/contact`

Required fields:
- `name` (string)
- `email` (string, valid email format)
- `message` (string)

Optional fields:
- `phone` (string)
- `company` (string)
- `subject` (string)

## ✅ Next Steps

1. Configure SMTP credentials in `server/.env`
2. Restart the server
3. Test the contact form
4. Verify emails are received at office@pjinfra.com

---

**Note**: The email functionality is already fully implemented and tested. You just need to add your SMTP credentials!
