const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_KEY);
const msg = {
  to: "clayton.weller@gmail.com",
  from: "clayton.weller@gmail.com",
  subject: "Will this work",
  text: "<div>YUP!</div><div>Even with html</div>",
  html: "<div>YUP!</div><div>Even with html</div>"
};
sgMail.send(msg);
