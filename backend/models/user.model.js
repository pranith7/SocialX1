import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema(
    {
        username: {
            type: String, 
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        displayName: {
            type: String
        },
        email: {
            type: String, 
            required: true, 
            unique: true,
            lowercase: true,
            trim: true
        },
        emailVerified: {
            type: Boolean
        },
        fullName: {
            type: String,
            // required: true,
            trim: true, 
            index: true
        },
        profileImage: {
            type: String, // cloudinary url
            // required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        bio:{
            type: String
        },
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: "Followersmodel",
            }
        ],
        following: [
            {
                type: Schema.Types.ObjectId,
                ref: "Followingmodel",
            }
        ],
        password: {
            type: String, 
            required: [true, 'Password is required']
        },
        verified: {
            type: Boolean,
            default: false
        },
        hasBadge: {
            type: Boolean,
            default: false
        },
        badgeRequested: {
            type: Boolean,
            default: false
        },
        dateOfBirth:{
            type: Date
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,

    
    },
    {
      timestamps: true
    },{ collection: 'user-data'}
);

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Usermodel = mongoose.model('UserData', userSchema);
