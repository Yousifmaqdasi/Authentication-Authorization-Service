import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetEmail = async (
  email: string,
  userId: number,
  token: string,
) => {
  return transporter.sendMail({
    from: "noreply@myapp.com",
    to: email,
    subject: "Password Reset",
    text: `https://yourfrontend.com/reset-password/${userId}/${token}`,
  });
};