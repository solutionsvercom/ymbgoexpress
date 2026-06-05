# Contact Form SMTP Setup

This project sends two emails on each contact form submission:

1. Owner notification to `CONTACT_TO`
2. Auto-response to the user who submitted the form

## 1) Install dependencies

Already included:

- `nodemailer`
- `express-rate-limit`
- `validator`

## 2) Configure environment variables

Copy `.env.example` to `.env` in `backend/` and fill real values:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS` (use App Password for Gmail)
- `CONTACT_FROM_NAME`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO`
- `CONTACT_REPLY_TO`
- `CONTACT_EXPECTED_RESPONSE_TIME`
- `CONTACT_RATE_LIMIT_MAX`
- `CORS_ORIGIN`

## 3) Template customization

Edit `backend/config/contactEmailConfig.js`:

- `subjects.ownerNotification`
- `subjects.userAutoResponse`
- `defaults.expectedResponseTime`
- `company` contact details
- `templates.autoResponseHtml`
- `templates.autoResponseText`

## 4) API behavior

Endpoint: `POST /api/contact`

Required fields:

- `name`
- `email`
- `phone`
- `message`

Optional fields:

- `subject`
- `website` (honeypot field; must remain empty)

Security:

- Rate limiting via `express-rate-limit`
- Email format validation via `validator`
- Domain MX lookup check
- Input sanitization before email rendering
- Retry logic for transient SMTP failures

## 5) Testing locally

1. Start backend: `npm run dev` inside `backend`
2. Start frontend: `npm run dev` inside `frontend`
3. Submit contact form from UI
4. Verify:
   - You receive owner notification email
   - User email receives auto-response

## 6) Deployment notes

- Never commit real `.env` values
- Set all SMTP vars in your hosting provider's environment settings
- For Gmail: enable 2FA and use App Password
