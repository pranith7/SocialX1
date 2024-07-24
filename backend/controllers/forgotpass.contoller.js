import nodemailer from "nodemailer";
import bcrypt from "bvrypt";
import { Usermodel as User } from "../models/user.model";
import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "./../utils/ApiError.js";
import { ApiResponse } from "./../utils/ApiResponse.js";
import { generateAccessAndRefreshTokens } from "./auth.controller.js";

const sendResetPasswordEmail = asyncHandler(async(req,res) => {
    const { email, token } = req.body;
    let transporter = nodemailer.createTransport({
        host: "live.smtp.mailtrap.io",
        port: 587,
        auth: {
          user: process.env.AUTH_USER_NODEMAILER,
          pass: process.env.AUTH_PASS_NODEMAILER,
        },
      });
    
      const resetPasswordLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
    
      const mailOptions = {
        from: "fakeX <fakex@demomailtrap.com>",
        to: email,
        subject: "Reset Your Password",
        html: `
          <p>You've requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetPasswordLink}">Reset Password</a>
        `,
      };
    
      await transporter.sendMail(mailOptions);
});

const ForgotPassword = asyncHandler(async(req,res) => {
    const { email } = req.body;
    const user = await User.findOne({email: email});
    if(!user) return ApiError(403,"user not found");

    const {accessToken, refreshToken} = generateAccessAndRefreshTokens(user._id);
    user.refreshToken = refreshToken;
    // user.resetPasswordExpires = Date.now() + 360000;

    await user.save();
    await sendResetPasswordEmail(email, accessToken)
    ApiResponse(200,"Reset Password email sent");
});

const ResetPassword = asyncHandler(async(req,res) => {
    const { token } = req.query;
    const { newPasword } = req.body;

    const user = await User.findOne({ refreshToken: token});
    if(!user || user.resetPasswordExpires < Date.now()){
        return ApiError(400, "Invalid or expired Token");
    }
    const hashedpassword = await bcrypt.hash(newPasword, 10);
    user.password = hashedpassword;
    user.resetPAsswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return ApiResponse(200,"Password reset Successful");
});

export {
    ForgotPassword,
    ResetPassword
}

