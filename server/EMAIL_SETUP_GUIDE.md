# Email Configuration Guide

## 📧 Setting Up Email for Contact Form

Your contact form will send emails to: **office@pjinfra.com**

---

## 🔧 Configuration Steps

### Option 1: Using Gmail (Recommended for Testing)

1. **Enable 2-Step Verification**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Create App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "PJ Infra Contact Form"
   - Copy the 16-character password

3. **Update `.env` file**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

---

### Option 2: Using Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

---

### Option 3: Using Custom Domain Email (Office365)

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=office@pjinfra.com
SMTP_PASS=your-password
```

---

### Option 4: Using SendGrid (Recommended for Production)

1. Sign up at: https://sendgrid.com (Free tier: 100 emails/day)
2. Create API Key
3. Update `.env`:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

---

### Option 5: Using Mailgun (Production Alternative)

1. Sign up at: https://mailgun.com
2. Get SMTP credentials
3. Update `.env`:

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

---

## 🧪 Testing the Contact Form

### Method 1: Using PowerShell

```powershell
$contactData = @{
    name = "Test User"
    email = "test@example.com"
    phone = "+1234567890"
    company = "Test Company"
    subject = "Test Contact Form"
    message = "This is a test message from the contact form."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/contact" `
    -Method Post `
    -Body $contactData `
    -ContentType "application/json"
```

### Method 2: Using cURL

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "company": "Test Company",
    "subject": "Test Contact Form",
    "message": "This is a test message."
  }'
```

---

## 📋 Contact Form API Endpoint

### POST `/api/contact`

**Request Body:**
```json
{
  "name": "John Doe",          // Required
  "email": "john@example.com", // Required (must be valid email)
  "phone": "+1234567890",      // Optional
  "company": "ABC Company",    // Optional
  "subject": "Inquiry",        // Optional
  "message": "Your message"    // Required
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your message has been sent successfully! We will get back to you soon."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Name, email, and message are required"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to send message. Please try again later."
}
```

---

## 🎨 What Happens When Form is Submitted

1. **Office Email (office@pjinfra.com) receives:**
   - Professional HTML formatted email
   - All contact details (name, email, phone, company)
   - Subject and message
   - Timestamp of submission
   - Reply-to address set to user's email

2. **User receives confirmation email:**
   - Thank you message
   - Copy of their submitted message
   - Company contact information
   - Professional branding

---

## 🔒 Security Features

- ✅ Email validation (regex check)
- ✅ Required field validation
- ✅ XSS protection (HTML escaping in emails)
- ✅ SMTP authentication
- ✅ Error handling
- ✅ No rate limiting (add if needed)

---

## 🚀 Frontend Integration (React)

Update your `src/pages/Contact.js`:

```javascript
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      
      toast.success(response.data.message);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send message';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your Name *"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Your Email *"
        required
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
      />
      <input
        type="text"
        name="company"
        value={formData.company}
        onChange={handleChange}
        placeholder="Company Name"
      />
      <input
        type="text"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        placeholder="Subject"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Your Message *"
        required
        rows="5"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

---

## ⚠️ Important Notes

1. **For Production:**
   - Use SendGrid, Mailgun, or AWS SES (more reliable)
   - Don't use personal Gmail for high volume
   - Add rate limiting to prevent spam
   - Consider using reCAPTCHA

2. **Gmail Limitations:**
   - 500 emails per day limit
   - May mark as spam if volume is high
   - Use App Passwords (not regular password)

3. **Security:**
   - Never commit `.env` file to Git
   - Keep SMTP credentials secure
   - Validate and sanitize all inputs

---

## 🐛 Troubleshooting

### Error: "EAUTH - Authentication failed"
- Check SMTP_USER and SMTP_PASS in `.env`
- For Gmail, make sure you're using App Password, not regular password
- Verify 2-Step Verification is enabled

### Error: "ECONNECTION - Connection refused"
- Check SMTP_HOST and SMTP_PORT
- Verify firewall isn't blocking port 587
- Try port 465 with `secure: true`

### Emails going to Spam
- Set up SPF, DKIM, and DMARC records
- Use a professional email service (SendGrid, Mailgun)
- Avoid spam trigger words in subject/content

### Not receiving emails
- Check spam/junk folder
- Verify email address is correct
- Check server logs for errors

---

## 📊 Rate Limiting (Optional - Add if needed)

Install express-rate-limit:
```bash
npm install express-rate-limit
```

Add to contact route:
```javascript
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: 'Too many contact form submissions, please try again later.'
});

router.post('/', contactLimiter, async (req, res) => {
  // ... existing code
});
```

---

## ✅ Quick Setup Checklist

- [ ] Install nodemailer: `npm install nodemailer`
- [ ] Choose email provider (Gmail, SendGrid, etc.)
- [ ] Update `.env` with SMTP credentials
- [ ] Restart server
- [ ] Test with PowerShell command
- [ ] Check office@pjinfra.com inbox
- [ ] Check user confirmation email
- [ ] Update React Contact component
- [ ] Test from frontend
- [ ] Add to production (optional: rate limiting, reCAPTCHA)

---

**Email setup complete! Your contact form will send emails to office@pjinfra.com** 📧
