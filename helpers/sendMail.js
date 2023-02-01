import nodemailer from "nodemailer";
import { config } from "dotenv";

config();
function sendMail(url, email) {
  var transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD
    },
  });

  var mailOptions = {
    from: process.env.SENDER_MAIL,
    to: email,
    subject: 'Reset Password',
    html: `Click this link to reset your password <a href="${url}">${url}</a>`
  };

  return new Promise((res) => res(transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })));
}

export default sendMail;