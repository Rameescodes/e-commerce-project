const multer = require('multer');
const path = require('path');
const express =require("express");
const admin_route =express();

// auth file
const auth = require('../middleware/adminAuth')


// controllers
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const categoryController = require("../controllers/categoriesController");
const productController = require("../controllers/productcontroller");
const bannerController = require("../controllers/bannerController");
const orderController = require('../controllers/orderController')
const couponController = require("../controllers/couponController")
const offerController = require("../controllers/offerController")


// sessions-------------------------------------------------------------------------------
const session =require("express-session");
const config = require("../config/config");
admin_route.use(session({secret:config.sessionSecret}));


const bodyParser= require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));


admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');   

admin_route.use(express.static('public'))

// category storage========================================================================================
const categoryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/categoryImages'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const categoryUpload = multer({ storage: categoryStorage });
// --------------------------------------------------------------------------------------------------------
//======== product storage=============
const productStorage = multer.diskStorage({
   destination: function (req,file,cb) {
    cb(null,path.join(__dirname,'../public/productImages'));
   },
   filename: function (req, file, cb) {
    cb(null,file.originalname);
   }    

})
const productUpload = multer({ storage : productStorage});

//bannerStorage=============================================

const bannerStorage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,path.join(__dirname,'../public/bannerImages'));
    },
    filename: function (req,file,cb) {
        cb(null,file.originalname);
    }
})
const bannerUplaod = multer ({storage :  bannerStorage})



// admin---------------------------------------------------------------------

admin_route.get('/',auth.isLogout,adminController.loadLogin)
admin_route.post('/',auth.isLogin,adminController.verifyAdmin)
admin_route.get('/dashboard',adminController.dashboard)


// users----------------------------------------------------------------------

admin_route.get('/userslist',auth.isLogin,userController.loadUsers)
admin_route.get('/unblockUser',auth.isLogin,userController.unblockUser)
admin_route.get('/blockUser',auth.isLogin,userController.blockUser)

// categories------------------------------------------------------------------

admin_route.get('/categories',auth.isLogin,categoryController.categoriesList)
admin_route.get('/addcategories',auth.isLogin,categoryController.addcategories)
admin_route.post('/addcategories',auth.isLogin,categoryUpload.single('image'),categoryController.insertCategory)
admin_route.get('/editCategories',auth.isLogin,categoryController.editCategories)
admin_route.get('/listCat',auth.isLogin,categoryController.listCat)
admin_route.get('/unlistCat',auth.isLogin,categoryController.unlistCat)
admin_route.post('/editCategories',auth.isLogin,categoryUpload.single('image'),categoryController.insertEditCategory)

//=== ! products ! ================================
admin_route.get('/Productlist',auth.isLogin,productController.productlist)
admin_route.get('/addproductlist',auth.isLogin,productController.addproductlist)
admin_route.get('/listproduct',auth.isLogin,productController.listproduct)
admin_route.get('/unlistProduct',auth.isLogin,productController.unlistProduct)
admin_route.get('/editpage',auth.isLogin,productController.editpage)
admin_route.get('/viewProductPage',auth.isLogin,productController.viewProductPage)

// === ! Banners ! ============================================

admin_route.get('/bannerlist',auth.isLogin,bannerController.bannerlist)
admin_route.get('/addbannerlist',auth.isLogin,bannerController.loadbannerAdd);
admin_route.get('/editbanner',auth.isLogin,bannerController.loadBannerEdit)
admin_route.get('/listbanner',auth.isLogin,bannerController.listbanner)

// ! orderlist !==========================================
admin_route.get('/orderList',auth.isLogin,orderController.listUserOrders)
admin_route.get('/orderstatus',auth.isLogin,orderController.changeOrderStatus)
admin_route.get('/orderdetails',auth.isLogin,orderController.adminOrderDetails)
admin_route.get('/cancelProduct',auth.isLogin,orderController.produtCancel)
admin_route.get('/refundOrder',auth.isLogin,orderController.returnOrder)
admin_route.get('/cancelOrder',auth.isLogin,orderController.orderCancel)
admin_route.get("/transactionList",auth.isLogin,orderController.transactionList)
admin_route.get("/salesReport",auth.isLogin,orderController.loadSalesReport);


// ! coupon !  =================================================

admin_route.get('/addCoupon',auth.isLogin,couponController.addCouponPage)
admin_route.get('/couponList',auth.isLogin,couponController.couponList)
admin_route.get('/couponUnlist',auth.isLogin, couponController.unlistCoupon)
admin_route.get('/loadEditCoupon',auth.isLogin,couponController.loadEditCoupon)

// offer ! =============================
admin_route.get('/addOffer',auth.isLogin,offerController.loadOfferAdd)
admin_route.get('/offerList',auth.isLogin,offerController.OfferList)
admin_route.get('/blockOffer',auth.isLogin,offerController.offerBlock)
admin_route.get('/offerEdit',auth.isLogin,offerController.loadOfferEdit)




   

   
// ! category ! =============================
admin_route.post('/editCategories',auth.isLogin,categoryUpload.single('image'),categoryController.insertEditCategory)
admin_route.post('/addcategories',auth.isLogin,categoryUpload.single('image'),categoryController.insertCategory)

// banner post ! ==================================
admin_route.post('/addbannerlist',auth.isLogin,bannerUplaod.single('image'),bannerController.bannerAdd) 
admin_route.post("/editbanner", auth.isLogin,bannerUplaod.single('image'),bannerController.editbanner);

// productlist ! ========================

admin_route.post('/addproductlist',auth.isLogin,productUpload.single('image'),productController.insertproduct)
admin_route.post('/editProductlist', auth.isLogin,productUpload.single('image'), productController.insertEditProduct);

//coupon !==============================

admin_route.post('/addCoupon',auth.isLogin,couponController.insertCoupon)
admin_route.post('/editCoupon',auth.isLogin,couponController.insertEditCoupon)   

// offer ! =============================    

admin_route.post('/addOffer',auth.isLogin,offerController.addOffer)
admin_route.post('/offerEdit',auth.isLogin, offerController.editOffer)
    



module.exports=admin_route;











