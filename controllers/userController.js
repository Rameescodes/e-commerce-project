const user=require('../models/userModel');
const nodemailer =require('nodemailer');
const session = require('express-session');
const productModels = require('../models/productModels');
const category = require('../models/categoriesModel')
const Banner = require("../models/bannerModel")
const address = require("../models/addressModel")
const order = require("../models/orderModel")
const transaction = require("../models/transactionModel")

// user side user controllers---------------------------------------------------------->
 
// create random otp================================================
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };


// SENT MAIL========================================================                    
const sendOtpEmail = async (email, otp) => {
    // Create a Nodemailer transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'muhammedrameess89@gmail.com',
        pass: 'qicv vqxn qdxk acvi',
      },
    });
  
    // Define email options
    const mailOptions = {
      from: 'muhammedrameess89@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };
  
    // Send email
    try {
      await transporter.sendMail(mailOptions);
      console.log('OTP sent successfully');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };



// =====loadHome===================================================================================================

const loadHome =async(req,res)=>{
    try{
        const productData = await productModels.find({}).limit(10)
        const categoryData = await category.find({})
        const banData = await Banner.find({isListed:true});

         res.render('home', {session:req.session,productData,categoryData,banData});



    }catch(error){
        console.log(error.message);
    }
}
//===== signup  ===========================

const signUp=async(req,res)=>{
    try{
        res.render('signup');
    }catch(error){
        console.log(error.message);
    }
}

// =====loadLogin=====================================================================================================

const loadLogin=async(req,res)=>{
    try{
         res.render('login');
    }catch(error){
        console.log(error.message);
    }
}

// =====sentOtp========================================================================================================

const sentOtp=async(req,res)=>{
    try{
        const user =new user({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            is_admin:0,
        });

        const userData=await user.save();


        if(userData){
           
            const email = req.body.email;
            const otp = generateOTP();
            req.session.otp = otp;
            console.log(req.session.otp);
            await sendOtpEmail(email, otp);



if(otp){
    res.render('otpPage');
}


        }else{
            res.render('registration',{message:"otp Cant sent!"})
        }

    }catch(error){
        console.log(error.message);

    }
}

// ======validateOtp==================================================================================================

const validateOtp = async(req,res)=>{
try{
const otp = req.body.otp;
if(req.session.otp === otp){
    res.render('login',{message:'signup successfull! login now'})
}else{
    res.render('signup',{message:'incorrect otp re register'})
}
}catch(error){
    console.error(error);
}
}


// ===validateLogin==================================================================================================

const validateLogin = async(req,res) => {
    try{
        const productData = await productModels.find({}).limit(10)
        const categoryData = await category.find({})
        const banData = await Banner.find({isListed:true});
        const email = req.body.email;
        const password =req.body.password;
        const userData = await user.findOne({email:email})
        if(userData){
            if(userData.password===password){
                req.session.userId = userData._id
               
                res.render('home', {session:req.session,productData,categoryData,banData});
            }else{
                res.render('login',{message:"password is wrong"})
            }

        }else{
            res.render('login',{message:"email id is wrong"})
        }

    }catch(error){
        console.error(error)

    }
}
const verifyOtp = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const userData = await user.findById(userId);

    const otpGeneratedTime = req.session.otpGeneratedTime;
    const currentTime = Date.now();

    if (currentTime - otpGeneratedTime > 60 * 1000) {
      res.render("otp-validation", {
        message: "OTP expired",
        otpGeneratedTime,
      });
      return;
    }

    if (userData) {
      const firstDigit = req.body.first;
      const secondDigit = req.body.second;
      const thirdDigit = req.body.third;
      const fourthDigit = req.body.fourth;
      const fullOTP = firstDigit + secondDigit + thirdDigit + fourthDigit;

      if (fullOTP === req.session.otp) {
        delete req.session.otp;
        delete req.session.user_id;
        delete req.session.registerOtpVerify;

        if (req.session.referralCode) {
          await user.updateOne({ _id: userId }, { walletBalance: 50 });
          const referrer = await user.findOne({
            referralCode: req.session.referralCode,
          });
          const User = await user.findOne({ _id: userId });
          referrer.referredUsers.push(User.email);
          referrer.walletBalance += 100;
          await referrer.save();

          const referredUserTransaction = new Transaction({
            user: referrer._id,
            amount: 100,
            type: "credit",
            date: Date.now(),
            paymentMethod: "Wallet",
            description: "Referral Bonus",
          });
          const referrerTransaction = new Transaction({
            user: userId,
            amount: 50,
            type: "credit",
            date: Date.now(),
            paymentMethod: "Wallet",
            description: "Referral Bonus",
          });
          await referredUserTransaction.save();
          await referrerTransaction.save();
        }

        userData.is_varified = 1;
        await userData.save();
        res.render("verifiedOtp");
      } else {
        res.render("otpVerification", {
          message: "Invalid otp",
          otpGeneratedTime: otpGeneratedTime,
        });
      }
    } else {
      res.render("otpVerification", {
        message: "User Not Found",
        otpGeneratedTime: otpGeneratedTime,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
// ! register ==================================
const register = async (req, res) => {
  try {
    res.render("register", { errors: '' });
  } catch (error) {
    console.log(error.message);
  }
};

const logout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}

const profile = async (req, res) => {
    try {
      const id = req.session.userId
      const userData = await user.find({ _id: id });
      const addresses = await address.find({ user: id }).sort({ createdDate: -1 }).exec();
      const userOrders = await order.find({
        user: id,
        paymentStatus: "Payment Successful",    
      });
      const totalOrders = userOrders.length;
      const totalSpending = userOrders.reduce(
        (acc, order) => acc + order.totalAmount,
        0 
      );
      const uniqueProductIds = new Set(userOrders.flatMap(order => order.items.map(item => item.product)));
      const totalUniqueProducts = uniqueProductIds.size;
      const orderData = await order.find({ user: id })
        .populate('user')
        .populate({
          path: 'address',
          model: 'Address',
        })  
        .populate({
          path: 'items.product',
          model: 'Product',
        }).sort({ orderDate: -1 })
console.log("Total Orders:", totalOrders);

      res.render('profile', { userData, uniqueProductIds,addresses, orderData, totalOrders, totalSpending, totalUniqueProducts })
    } catch (error) {
      console.log(error.message);
    }
  }
  // wallet ! =======================

  const loadWallet = async (req, res) => {
    try {
      const id = req.session.userId;
      const userData = await user.findById(id);
      const transactions = await transaction.aggregate([
        { $match: { user: userData._id, paymentMethod: "Wallet" } },
        { $sort: { date: -1 } },
      ]);
  
      res.render("wallet", { User: userData, transactions });
    } catch (error) {             
      console.log(error.message);
    }
  };
  // ! contact
const contact = async(req,res)=>{
  try {
    res.render('contact')
  } catch (error) {
    console.log(error)
  }
}




// admin side user controllers---------------------------------------------------------------------------->




// user controllers=======================================================
const loadUsers = async (req, res) => {
  
    try {
        const userData = await user.find()
        res.render('userslist',{userData});
    } catch (error) {
        console.log(error.message);
    }
}

const unblockUser=async(req,res) => {
    try {
         
   const Id = req.query.id
   await user.updateOne({_id:Id},{is_blocked : 0})
   res.redirect('/admin/userslist')
        
    }catch {
        console.log(error)

    }
}

const blockUser = async(req,res) => {
    try {
        const Id=req.query.id
        await user.updateOne({_id:Id},{is_blocked:1})
        res.redirect('userslist')

    }catch {
        console.log(error)

    }
}




module.exports={
    loadLogin,loadHome,signUp,
    sentOtp,validateOtp,validateLogin,
    logout,profile,loadUsers,
    unblockUser,
    blockUser,loadWallet,contact,register,verifyOtp
}