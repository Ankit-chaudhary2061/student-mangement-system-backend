import nodemailer from "nodemailer";

export const sendTeacherMail = async (
  email: string,
  password: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Teacher Account Created",
    html: `
      <h3>Welcome</h3>
      <p>Your teacher account has been created.</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Password:</b> ${password}</p>
      <p>Please login and change your password.</p>
    `,
  });
};
