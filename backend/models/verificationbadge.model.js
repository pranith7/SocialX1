import mongoose, { Schema } from "mongoose";

const userVerificationBadgeSchema = new Schema({
    userId: String,
    otpcode: String,
    createdAt: String,
    expiredAt: String,
});

export const Verificationbadgemodel = mongoose.model('userVerificationBadge',userVerificationBadgeSchema)