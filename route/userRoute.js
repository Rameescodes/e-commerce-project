const express=require("express");
const user_route=express();

user_route.set('view engine','ejs');
user_route.set('views','./views/users');

const bodyParser=require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))

const auth = require('../middleware/auth')


const multer= require("multer");
const path=require("path");

const storage=multer.diskStorage({
       destination:function(req,file,cb){
         cb(null,path.join(__dirname,'../public/userImages'))  
       },

filename:function(req,file,cb){
    const name=Date.now()+'-'+file.originalname;
cb(null,name);
}
});
const upload=multer({storage:storage});

user_route.use(express.static('public'))

const userController=require("../controllers/userController");
const productController = require("../controllers/productcontroller");
const wishlistController = require("../controllers/wishlistController");
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
const addressController = require("../controllers/addressController")
const couponController = require("../controllers/couponController")
const pdfController = require("../controllers/pdfController")


user_route.get('/',userController.loadHome)
user_route.get('/register',userController.register)

user_route.get('/login',userController.loadLogin)
user_route.get('/logout',userController.logout)
user_route.get('/signup',userController.signUp)
user_route.get('/profile',userController.profile)

user_route.get('/wallet',userController.loadWallet) 
user_route.get('/home',userController.home)



//product=============================================  
user_route.get('/shop',productController.shop)
user_route.get('/productpage',productController.productpage)


//wishlist=========================================================
user_route.get('/wishlist',wishlistController.loadWishlist)                                         
user_route.get('/addWishlist',wishlistController.addToWishlist)
user_route.get('/removeFromWishlist',wishlistController.removeFromWishlist)

//cartController====================================================
user_route.get('/cartlist',cartController.cartload)
user_route.get('/removeCart',cartController.removeCart)
user_route.get('/clearcart',cartController.clearCart)

// order ==================================
user_route.get('/checkoutPage',orderController.checkoutPage)
user_route.get("/orderSuccess",orderController.loadOrderSuccess);
user_route.get('/userorderdetails',orderController.userOrderDetails)
user_route.get('/cancelOrder',orderController.changeOrderStatus)
user_route.get('/cancelSingleProduct',orderController.changeOrderStatus)
user_route.get('/returnOrder',orderController.changeOrderStatus)
user_route.get('/orderFailed',orderController.orderFailed)
user_route.get('/userorderdetails',orderController.userOrderDetails)



  //address ! ======================================
user_route.get('/addAddress', addressController.addAddressPage)
user_route.get('/deleteAddress',addressController.deleteAddress)
user_route.get('/editAddress',addressController.editAddress)

// profile ! =====================
user_route.get('/couponPage',couponController.couponPage)


// invoice generate ! =================
user_route.get('/generate-invoice/:orderId', pdfController.generateInvoice)

// contact ! =========================
user_route.get('/contact',userController.contact)




// ! post routes ! ========================================


// user route ======================
user_route.post('/verifyOtp', userController.verifyOtp)

user_route.post('/otppage',userController.sentOtp)
user_route.post('/validate',userController.validateOtp)
user_route.post('/validateLogin',userController.validateLogin)


// cart controller ============================

user_route.post('/productPage', cartController.insertToCart)
user_route.put('/updateQuantityAndSubtotal', cartController.updateQuantityAndSubtotal);

// ! order ====================================
user_route.post('/postCheckout',orderController.postCheckout)

user_route.post('/applyCoupon', orderController.applyCoupon)
user_route.post('/razorpayOrder', orderController.razorpayOrder)
// ! address ====================
user_route.post('/editAddress',addressController.insertAddress)
user_route.post('/addAddress', addressController.insertAddress)





module.exports = user_route