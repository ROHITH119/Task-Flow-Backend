const nodemailer = require("nodemailer")

const sendEmail = async({to, subject, html}) => {
    const transporter = nodemailer.createTransport({
        service: "smtp.gmail.com",
        port: 587,
        secure: false,
        family: 4,

        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    })

    await transporter.sendMail({
        from: `TaskFlow <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: html
    })
}

module.exports = {sendEmail}


