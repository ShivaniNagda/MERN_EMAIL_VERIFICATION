// import { MailtrapClient } from "mailtrap";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


// mail trap.i0--------------------------------------------------------------------------
// export const mailTrapclient = new MailtrapClient({ token: process.env.MAILTRAP_TOKEN,});

// export const mailTrapsender = {
//   email: "hello@demomailtrap.co",
//   name: "Mailtrap Test",
// };


// -------------------------------Nodemailer
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MYEMAIL,
    pass: process.env.MyEMAILPassKey
  }
}
)