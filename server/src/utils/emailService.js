const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  if (typeof to !== "string" || typeof subject !== "string" || typeof html !== "string") {
    throw new Error('Expected "payload" to be a plain object with string fields.');
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: `"MyApp" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Email sent:", info.response);
};

module.exports = sendEmail;
