// const { Resend } = require("resend");

// const resend = new Resend("re_bWFA28Tu_P7R6dudAiNf2AJhximRcntH8");

// const sendResetEmail = async (to, resetUrl) => {
//   const data = await resend.emails.send({
//     from: "TaskFlow <onboarding@resend.dev>", // use this for now
//     to,
//     subject: "Reset your TaskFlow password",
//     html: `
//       <div style="font-family:Arial;padding:20px;">
//         <h2>Password Reset</h2>
//         <p>You requested to reset your password.</p>
//         <a href="${resetUrl}" 
//            style="background:#4f46e5;color:#fff;
//                   padding:10px 16px;
//                   text-decoration:none;
//                   border-radius:6px;">
//           Reset Password
//         </a>
//         <p style="font-size:12px;color:#666;margin-top:15px;">
//           This link expires in 10 minutes.
//         </p>
//       </div>
//     `,
//   });

//   console.log("Email response:", data);

// };

// module.exports = {sendResetEmail};

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (to, resetUrl) => {
  try {
    const info = await transporter.sendMail({
      from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset your TaskFlow password",
      html: `
        <div style="font-family:Arial;padding:20px;">
          <h2>Password Reset</h2>
          <p>You requested to reset your password.</p>
          <a href="${resetUrl}" 
             style="background:#4f46e5;color:#fff;
                    padding:10px 16px;
                    text-decoration:none;
                    border-radius:6px;">
            Reset Password
          </a>
          <p style="font-size:12px;color:#666;margin-top:15px;">
            This link expires in 10 minutes.
          </p>
        </div>
      `,
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.log("EMAIL ERROR:", error);
  }
};

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP READY");
  }
});


module.exports = { sendResetEmail };

