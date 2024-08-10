import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))



app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// import routes
// import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import forgotPassRouter from './routes/forgotpass.routes.js'
import postRouter from './routes/post.routes.js'
// import 



app.use("/api/v1/auth", authRouter)
app.use("/api/v1/credentials", forgotPassRouter)
app.use("/api/v1/post", postRouter);


export { app }