import { asyncHandler } from "./../utils/asyncHandler.js";
import { ApiError } from "./../utils/ApiError.js";
import { ApiResponse } from "./../utils/ApiResponse.js";
import { uploadOnCloudinary } from "./../utils/cloudinary.js";
import  jwt from "jsonwebtoken";
import { Usermodel as User } from "../models/user.model.js";
import transporter  from "./../utils/nodemailer.js";
import { userOtpVerificationmodel as UserOtpVerification } from "../models/otpverification.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config({
    path: './.env'
})

transporter.verify((error, success) => {
    if (error) {
        console.log("Nodemailer error", error);
    } else {
        console.log("Nodemailer success");
    }
})

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error){
        throw new ApiError(500, "Something went wrong while generating refresh and Access Token")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    try {
        console.log(`Executing RegisterUser function `);

        const { name, email, password } = req.body;
        console.log(`name: ${name} email: ${email} password: ${password}`);

        const existedUser = await User.findOne({
            $or: [{ name }, { email }]
        });

        if (existedUser) {
            throw new ApiError(409, "User with email or username already exists");
        }
        console.log("Creating User ");
        const user = await User.create({
            username: name.toLowerCase(),
            email,
            password,
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user");
        }

        const otpResult = await sendOtpVerificationCode(user);
        console.log(`OTP result: ${otpResult}`);

        if (otpResult.status === 'FAILED') {
            return res.status(500).json(new ApiResponse(500, null, 'Failed to send OTP code'));
        }
        return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { name, password } = req.body;

        const user = await User.findOne({
            username: name
        });

        if (!user) {
            throw new ApiError(401, "User does not exist");
        }
        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            // secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200, 
                    { 
                        user: loggedInUser, accessToken, refreshToken 
                    },
                    "User logged in successfully"
                )
            );
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            {
                new: true
            }
        );

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged out"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true
        };
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Invalid refresh token");
    }
});

const verifyOTP = asyncHandler(async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            throw new ApiError(400, "Empty OTP details are not allowed");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const userOtpVerificationRecords = await UserOtpVerification.find({
            userId: user._id,
        });

        console.log(userOtpVerificationRecords);

        if (userOtpVerificationRecords.length <= 0) {
            throw new ApiError(404, "Account record doesn’t exist or has been verified already, please sign up or sign in");
        }

        const { expiredAt, otpcode } = userOtpVerificationRecords[0];

        // Debugging: Log otpCode to ensure it is retrieved correctly
        console.log(`Retrieved otpCode: ${otpcode}`);

        if (expiredAt < Date.now()) {
            await UserOtpVerification.deleteMany({ userId: user._id });
            throw new ApiError(400, "Code has expired, please request one more time");
        }

        if (!otpcode) {
            throw new ApiError(500, "OTP code not found in the database");
        }

        const validOtp = bcrypt.compareSync(otp, otpcode);
        if (!validOtp) {
            throw new ApiError(400, "Invalid code passed, check your email");
        }

        await User.updateOne({ _id: user._id }, { verified: true });
        await UserOtpVerification.deleteMany({ userId: user._id });
        return res.json(new ApiResponse(200, null, "User email verified successfully"));

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
});

const sendOtpVerificationCode = async ({ _id, email }) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: process.env.APPLICATION_USER_FOR_NODEMAILER,
            to: email,
            subject: "Verify Your Email",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #333333;
                    }
                    .content {
                        margin-bottom: 30px;
                    }
                    .code {
                        font-size: 24px;
                        font-weight: bold;
                        color: #007bff;
                    }
                    .footer {
                        text-align: center;
                    }
                    .footer p {
                        color: #666666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Verify Your Email Address</h1>
                    </div>
                    <div class="content">
                        <p>Dear User,</p>
                        <p>To complete your sign up, please enter the verification code below in the app:</p>
                        <p class="code">${otp}</p>
                        <p>This code will expire in <b>1 hour</b>.</p>
                    </div>
                    <div class="footer">
                        <p>Thank you for choosing our service.</p>
                    </div>
                </div>
            </body>
            </html>`,
        };

        const hashedOtp = bcrypt.hashSync(otp, 10);

        const newOtpVerification = new UserOtpVerification({
            userId: _id,
            otpcode: hashedOtp,
            createdAt: Date.now(),
            expiredAt: Date.now() + 3600000,
        });

        await newOtpVerification.save();
        await transporter.sendMail(mailOptions);

        const result = new ApiResponse(200, {
            userId: _id,
            email,
        }, "Verification OTP code email sent");

        console.log("sendOtpVerificationCode result:", result); // Add this line to debug

        return result;
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Failed to send OTP code");
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    verifyOTP,
    refreshAccessToken,
    generateAccessAndRefreshTokens
}