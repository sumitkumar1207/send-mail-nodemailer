const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

//View engine Setup
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("contact");
});

app.post("/send", (req, res) => {
  const output = `
  <p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Phone: ${req.body.phone}</li>
    <li>email: ${req.body.email}</>
    <li>Company: ${req.body.company}</li>
  </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email", //What ever protocol you wish to use.
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "test@test.com", // your email
      pass: "test123" // your password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: "<youremailid@xyz.com>", // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.redirect("url", status()); //redirect url and status.
    // OR
    res.send({ msg: "Email sent or whatever msg you want" });
  });
});
app.listen(3000, () => console.log("Server Started"));
