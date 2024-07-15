import { transporter } from "./../utils/nodemailer.js";



transporter.verify((error, success) => {
    if (error) {
        console.log("Nodemailer error", error);
    } else {
        console.log("Nodemailer success");
    }
});


