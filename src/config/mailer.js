import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export async function sendRegistrationNotification(user) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;

  const rows = Object.entries({
    Name: user.name,
    Email: user.email,
    Role: user.role,
    Phone: user.phone,
    Address: user.address,
    'Registered at': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  })
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 10px;font-weight:bold;">${k}</td><td style="padding:4px 10px;">${v}</td></tr>`)
    .join('');

  await transporter.sendMail({
    from: `"MernAcademy" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `New registration on mernacademy.in: ${user.name}`,
    html: `<h3>New user registered on mernacademy.in</h3><table>${rows}</table>`
  });
}
