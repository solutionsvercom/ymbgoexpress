function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
}

function isSmtpConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_TO);
}

function getMailFrom() {
  const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;
  const fromName = process.env.CONTACT_FROM_NAME || 'YMB GoExpress Website';
  return `"${fromName}" <${fromEmail}>`;
}

module.exports = {
  getSmtpConfig,
  isSmtpConfigured,
  getMailFrom,
};
