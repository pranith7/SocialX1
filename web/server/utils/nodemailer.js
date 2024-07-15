import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: process.env.APPLLICATION_USER_FOR_NODEMAILER,
        pass: process.env.APPLLICATION_PASSWORD_FOR_NODEMAILER
    },
    tls:{
        rejectUnauthorized: false,
    },
});

