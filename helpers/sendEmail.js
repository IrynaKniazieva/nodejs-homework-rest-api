const nodemailer = require("nodemailer");
require("dotenv").config();

const {EMAIL_FROM, META_PASSWORD} = process.env;

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_FROM, 
        past: META_PASSWORD,
    }
}

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async(data) => {
    const email = {...data, from: EMAIL_FROM};
    await transport.sendMail(email);
    return true;
}

module.exports = sendEmail;