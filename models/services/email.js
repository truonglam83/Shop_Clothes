const nodemailer = require("nodemailer");
// async..await is not allowed in global scope, must use a wrapper
async function sendMail(receiver, validCode) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
  const username = process.env.MAIL_USERNAME || testAccount.user;
  const password = process.env.MAIL_PASSWORD || testAccount.pass;
  const service = process.env.MAIL_SERVICE || "ethereal";
  const host = process.env.MAIL_HOST || "smtp.ethereal.email";
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: service,
    host: host,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: username,
      pass: password,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"lola shop" <lolashop@gmail.com>', // sender address
    to: receiver, // list of receivers
    subject: "Lola shop order", // Subject line
    text: `Valid code: ${validCode}`, // plain text body
    html: `<h1>Hello,You have order from lola shop</h1>
    
    <b>Here is your 5-digit code: ${validCode}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = { sendMail };
