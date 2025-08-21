# Email Configuration Guide for Fixing Maritime

This guide will help you set up email authentication using info@fixingmaritime.com with Google Workspace.

## Option 1: Gmail SMTP (Recommended - Direct Google Workspace)

Since info@fixingmaritime.com is on Google Workspace, you can use Gmail SMTP directly:

1. **Generate App-Specific Password**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Sign in with info@fixingmaritime.com
   - Enable 2-Step Verification if not already enabled
   - Under "2-Step Verification", click on "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Enter "Fixing Maritime Website" as the name
   - Copy the generated 16-character password

2. **Add to Vercel Environment Variables**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add these two variables:
     - `GMAIL_USER` = info@fixingmaritime.com
     - `GMAIL_APP_PASSWORD` = your-16-character-app-password (no spaces)

3. **That's it!** 
   - No domain verification needed
   - No third-party services
   - Direct sending from your Google Workspace account
   - Professional delivery with Google's infrastructure

## Security Note

- **App Password**: The app-specific password is NOT your regular Gmail password
- **2-Step Verification**: Required for app passwords to work
- **Security**: App passwords are secure and can be revoked anytime
- **Limits**: Google Workspace accounts have higher sending limits than regular Gmail

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