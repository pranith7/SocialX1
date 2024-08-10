import { Usermodel as User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import transporter  from "../utils/nodemailer.js";
import dotenv from "dotenv";


dotenv.config({
  path: './.env'
})

const sendResetPasswordEmail = asyncHandler(async (email, token) => {

    const resetPasswordLink = `${process.env.BASE_URL}/reset-password?token=${token}`;

    const mailOptions = {
        from: process.env.APPLICATION_USER_FOR_NODEMAILER,
        to: email,
        subject: "Reset Your Password",
        html: `
          <p>You've requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetPasswordLink}">Reset Password</a>
        `,
    };

    await transporter.sendMail(mailOptions);
});

const ForgotPassword = asyncHandler(async (req, res) => {


    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return ApiError(403, "User not found");

    // const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    // const incomingAccessToken = req.cookies.accessToken || req.body.accessToken;

    // console.log(`accessToken ${incomingAccessToken}`);
    // console.log(`refreshToken ${incomingRefreshToken}`);

    const accessToken = user.generateAccessToken();
    console.log(`accessToken ${accessToken}`);
    user.resetPasswordToken = accessToken;
    user.resetPasswordExpires = Date.now() + 360000; // 10 minutes

    await user.save();
    await sendResetPasswordEmail(email, accessToken);

    return res.status(200).json(new ApiResponse(200, null, "Reset Password email sent"));
});

const ResetPassword = asyncHandler(async (req, res) => {
    const { token } = req.query;
    const { newPassword } = req.body;

    const user = await User.findOne({ resetPasswordToken: token });
    if (!user || user.resetPasswordExpires < Date.now()) {
        return ApiError(400, "Invalid or expired token");
    }

    user.password = newPassword; // No need to hash, pre-save middleware will handle it
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
});

export {
    ForgotPassword,
    ResetPassword
}