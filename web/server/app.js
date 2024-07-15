import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { transporter } from "./utils/nodemailer.js";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

transporter.verify((error, success) => {
    if (error) {
        console.log("Nodemailer error", error);
    } else {
        console.log("Nodemailer success");
    }
})

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// import routes
import userRouter from './routes/user.routes.js'
app.use("/api/v1/users", userRouter)


export { app }