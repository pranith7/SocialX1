import mongoose, {Schema} from "mongoose";

const userOtpVerificationSchema = new Schema({
    userId: String,
    otpcode: String,
    creeatedat: String,
    expiredat: String,
});

export const userOtpVerificationmodel = mongoose.model("userOtpVerification", userOtpVerificationSchema);
 