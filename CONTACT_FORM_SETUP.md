# 📧 Contact Form Email Setup - Complete Guide

## ✅ What's Been Created

I've set up a **complete contact form email system** that sends emails to `office@pjinfra.com` whenever someone submits the contact form on your website.

---

## 📁 Files Created/Modified

### Backend Files:
1. **`server/routes/contact.js`** - Contact form API endpoint
2. **`server/server.js`** - Added contact route
3. **`server/.env`** - Added SMTP configuration
4. **`server/EMAIL_SETUP_GUIDE.md`** - Detailed email setup instructions

### Frontend Files:
1. **`src/pages/Contact.js`** - Updated to call the API

### Test Files:
1. **`test-contact-form.ps1`** - Testing script

---

## 🚀 How It Works

When a user submits the contact form:

1. **Frontend (React)** sends form data to backend API
2. **Backend** validates the data
3. **Two emails are sent**:
   - 📧 **To office@pjinfra.com** - Professional notification with all contact details
   - 📧 **To the user** - Confirmation email thanking them for reaching out

---

## 🔧 Setup Steps

### Step 1: Configure Email Settings

Edit `server/.env` file and add your SMTP credentials:

#### Option A: Using Gmail (Easy for Testing)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**To get Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Go to https://myaccount.google.com/apppasswords
4. Create an app password for "Mail"
5. Copy the 16-character password
6. Use it in SMTP_PASS

#### Option B: Using SendGrid (Recommended for Production)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

Sign up at: https://sendgrid.com (Free: 100 emails/day)

---

### Step 2: Restart the Server

**IMPORTANT:** You must restart the server for changes to take effect!

```powershell
# Stop current server (Ctrl+C in server window)
# Then restart:
cd server
npm start
```

---

### Step 3: Test the Endpoint

```powershell
.\test-contact-form.ps1
```

Or test manually:
```powershell
$data = @{
    name = "Test User"
    email = "test@example.com"
    message = "This is a test message"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/contact `
    -Method Post -Body $data -ContentType "application/json"
```

---

## 📡 API Endpoint

### POST `/api/contact`

**URL:** `http://localhost:5000/api/contact`

**Request Body:**
```json
{
  "name": "John Doe",           // Required
  "email": "john@example.com",  // Required (validated)
  "phone": "+1234567890",       // Optional
  "company": "ABC Company",     // Optional
  "subject": "Inquiry",         // Optional
  "message": "Your message"     // Required
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your message has been sent successfully! We will get back to you soon."
}
```

**Error Response (400 - Validation):**
```json
{
  "success": false,
  "message": "Name, email, and message are required"
}
```

**Error Response (500 - SMTP not configured):**
```json
{
  "success": false,
  "message": "Failed to send message. Please try again later.",
  "error": "Authentication failed"
}
```

---

## 📧 Email Templates

### Email to office@pjinfra.com:
- Professional HTML template
- Contains: Name, Email, Phone, Company, Subject, Message
- Includes timestamp
- Reply-to set to user's email
- Formatted for easy reading

###Email to User (Confirmation):
- Thank you message
- Copy of their submitted message
- Company contact information
- Professional branding

---

## 🎨 Frontend Integration

The Contact.js page has been updated to:
- ✅ Call the API endpoint
- ✅ Show loading state during submission
- ✅ Display success/error messages (toast notifications)
- ✅ Reset form after successful submission
- ✅ Handle validation errors
- ✅ Made phone, company, and subject optional

**Form Fields:**
- Name * (required)
- Email * (required)
- Phone (optional)
- Company Name (optional)
- Subject (optional)
- Message * (required)

---

## 🔒 Security Features

- ✅ Email validation (regex)
- ✅ Required field validation
- ✅ XSS protection (HTML escaping)
- ✅ SMTP authentication
- ✅ Error handling
- ✅ No sensitive data exposure

---

## 🧪 Testing Checklist

- [ ] Configure SMTP settings in `server/.env`
- [ ] Restart the server
- [ ] Run `.\test-contact-form.ps1`
- [ ] Check office@pjinfra.com inbox
- [ ] Verify confirmation email sent to user
- [ ] Test from React frontend
- [ ] Test with missing required fields
- [ ] Test with invalid email format

---

## ⚠️ Important Notes

### Before Going Live:

1. **Update SMTP Credentials**
   - Don't use personal email for production
   - Use SendGrid, Mailgun, or AWS SES
   - Keep credentials secure (never commit .env)

2. **Add Rate Limiting** (Optional but recommended)
   ```bash
   npm install express-rate-limit
   ```
   Prevents spam submissions

3. **Add reCAPTCHA** (Recommended)
   - Prevents bot submissions
   - Free from Google

4. **Update Email Content**
   - Add your real phone number
   - Customize branding/logos
   - Update company information

5. **Test Thoroughly**
   - Send test emails
   - Check spam folders
   - Verify delivery

---

## 🐛 Troubleshooting

### "404 Not Found"
- **Solution:** Restart the server (new route not loaded)

### "EAUTH - Authentication failed"
- **Solution:** Check SMTP credentials in .env
- For Gmail: Use App Password, not regular password
- Verify 2-Step Verification is enabled

### "ECONNECTION - Connection refused"
- **Solution:** Check SMTP_HOST and SMTP_PORT
- Try port 465 with `secure: true`
- Check firewall settings

### Emails Going to Spam
- **Solution:** Use professional email service (SendGrid)
- Set up SPF, DKIM, and DMARC records
- Avoid spam trigger words

### Not Receiving Emails
- Check spam/junk folder
- Verify email address spelling
- Check server logs for errors
- Ensure SMTP service is working

---

## 📊 Email Services Comparison

| Service | Free Tier | Best For | Setup Difficulty |
|---------|-----------|----------|------------------|
| **Gmail** | 500/day | Testing | Easy |
| **SendGrid** | 100/day | Production | Easy |
| **Mailgun** | 100/day | Production | Medium |
| **AWS SES** | 62,000/month | Enterprise | Hard |
| **Mailchimp Mandrill** | - | Marketing | Medium |

---

## 🚀 Next Steps

1. ✅ **Configure SMTP** in `server/.env`
2. ✅ **Restart server** to load new route
3. ✅ **Test endpoint** with PowerShell script
4. ✅ **Test from frontend** by filling the contact form
5. ✅ **Check email delivery** to office@pjinfra.com
6. 🔄 **Optional:** Add rate limiting
7. 🔄 **Optional:** Add reCAPTCHA
8. 🔄 **Production:** Use SendGrid/Mailgun

---

## 📝 Quick Start Commands

```powershell
# 1. Install dependencies (already done)
cd server
npm install nodemailer

# 2. Configure SMTP in server/.env
# Edit the file and add your credentials

# 3. Restart server
npm start

# 4. Test API
cd..
.\test-contact-form.ps1

# 5. Test from frontend
# Go to http://localhost:3000/contact
# Fill form and submit
```

---

## ✅ Summary

**Status:** ✅ Complete and ready to use!

**What you have:**
- ✅ Contact form API endpoint
- ✅ Email sending to office@pjinfra.com
- ✅ User confirmation emails
- ✅ Professional HTML email templates
- ✅ Frontend integration
- ✅ Validation and error handling
- ✅ Complete documentation

**What you need to do:**
1. Configure SMTP settings in `server/.env`
2. Restart the server
3. Test it!

---

## 📞 Contact Form Flow

```
User fills form on website
        ↓
React sends data to API
        ↓
Backend validates data
        ↓
    Email sent to:
        ├── office@pjinfra.com (notification)
        └── user@email.com (confirmation)
        ↓
Success message shown to user
```

---

**Your contact form is ready! Just configure SMTP and restart the server!** 📧✅
