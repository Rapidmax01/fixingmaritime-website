# Email Configuration Guide for Fixing Maritime

This guide will help you set up email authentication using info@fixingmaritime.com.

## Option 1: Resend (Recommended - Already Configured)

1. **Sign up for Resend**
   - Go to [https://resend.com](https://resend.com)
   - Sign up for a free account
   - You get 100 emails/day on the free plan

2. **Add and Verify Your Domain**
   - In Resend dashboard, go to "Domains"
   - Click "Add Domain"
   - Enter `fixingmaritime.com`
   - Add the DNS records provided by Resend to your domain:
     - Usually includes TXT records for domain verification
     - DKIM records for email authentication
   - Wait for verification (usually takes a few minutes)

3. **Get Your API Key**
   - Go to "API Keys" in Resend dashboard
   - Create a new API key
   - Copy the key (starts with `re_`)

4. **Add to Vercel Environment Variables**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add: `RESEND_API_KEY` = your API key

## Option 2: SendGrid

If you prefer SendGrid:

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify your sender email (info@fixingmaritime.com)
3. Get API key
4. Update `lib/email.ts` to use SendGrid SDK

## Option 3: SMTP (Gmail/Custom)

For direct SMTP:

1. Update `.env` variables:
   ```
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=info@fixingmaritime.com
   EMAIL_SERVER_PASSWORD=your-app-password
   EMAIL_FROM=info@fixingmaritime.com
   ```

2. Update `lib/email.ts` to use nodemailer

## Testing Email

Once configured:

1. Create a new account on the website
2. Check the email inbox for verification email
3. Click the verification link
4. Confirm account is verified

## Troubleshooting

- **DNS not verified**: Wait 5-10 minutes for DNS propagation
- **Emails not sending**: Check API key is correct in Vercel
- **Emails in spam**: Add SPF/DKIM records from Resend

## Current Status

The code is already set up to use Resend. You just need to:
1. Create Resend account
2. Verify fixingmaritime.com domain
3. Add RESEND_API_KEY to Vercel environment variables