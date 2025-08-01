import nodemailer from "nodemailer";


const sendEmail = async ({ email, subject, message }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        service: process.env.SMTP_SERVICE,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    const options = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject,
        text: message,
    };
    await transporter.sendMail(options);
};
export default sendEmail;

