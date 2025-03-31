
import dotenv from "dotenv";
dotenv.config();
import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { transporter } from "./mailTrap.config.js";

// const TOKEN = process.env.MAILTRAP_TOKEN;
// console.log("nodemailerTrap...",TOKEN)
export const sendVerificationEmail = async (email, verificationToken) => {
  console.log("SendVerificationEmail..Signup",email);
    const recipient = email;
//  const transport = Nodemailer.createTransport(
//   MailtrapTransport({
//     token: TOKEN,
//   })
// );
// const recipients = [
//     "shivaninagda1997@gmail.com",
//   ];
  
//  const sender = {
//   address: "hello@demomailtrap.co",
//   name: "Mailtrap Test",
// };
try{
transporter
  .sendMail({
    from: process.env.MYEMAIL,
    to: recipient,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    html:VERIFICATION_EMAIL_TEMPLATE.replace(`{verificationCode}`,verificationToken),
    category: "Integration Test",
  })
}catch(err){
  console.log("Error sending email");
  console.log(err.message);
  throw new Error(`Error sending email : ${err}`);
}
}