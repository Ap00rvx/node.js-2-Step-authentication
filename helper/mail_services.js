const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});
const sendMail = async (email,otp ) =>  {
  await transporter.sendMail({
    from: '"Apurva B Raj" <apurvabarj@gmail.com>',
    to: email ,
    subject : "Verification OTP",
    text : "This is your one time password "+otp ,
    
  });
  console.log("email sent");
}

module.exports = sendMail; 