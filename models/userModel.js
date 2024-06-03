const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    is_admin:{
        type:Number,
        required:true
    },
    is_varified:{   
        type:Number,
        default:0
    },
    is_blocked:{
        type:Number,
        default:0
    },
    image: {
        type: String,
        required:true,
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    walletBalance: {
        type: Number,
        default: 0
    },
   
    referredUsers: [{
        type: String,
    }],
      
});
function generateRandomReferralCode() {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6;
    let referralCode = '';
    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        referralCode += characters.charAt(randomIndex);
    }
    return referralCode;
}


module.exports=mongoose.model('user',userSchema);