const mongoose=require("mongoose");
const schema=mongoose.schema;

const UserOTPVerificationSchema= new Schema({
    userId:String,
    otp:String,
    createAt:Date,
    expireAt:Date,
});

const UserOTPVerification=mongoose.model( "UserOTPVerification", UserOTPVerificationSchema);
module.exports=UserOTPVerification