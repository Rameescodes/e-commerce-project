const multer = require('multer');
const path = require('path');
const express =require("express");
const admin_route =express();

// auth file
const auth = require('../middleware/auth')


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

admin_route.get('/',adminController.adminLogin)
admin_route.post('/',adminController.verifyLogin)
admin_route.get('/dashboard',adminController.loadDashboard)


// users----------------------------------------------------------------------

admin_route.get('/userslist',userController.loadUsers)
admin_route.get('/unblockUser',userController.unblockUser)
admin_route.get('/blockUser',userController.blockUser)

// categories------------------------------------------------------------------

admin_route.get('/categories',categoryController.categoriesList)
admin_route.get('/addcategories',categoryController.addcategories)
admin_route.post('/addcategories',categoryUpload.single('image'),categoryController.insertCategory)
admin_route.get('/editCategories',categoryController.editCategories)
admin_route.get('/listCat',categoryController.listCat)
admin_route.get('/unlistCat',auth.isLogin,categoryController.unlistCat)
admin_route.post('/editCategories',auth.isLogin,categoryUpload.single('image'),categoryController.insertEditCategory)

//=== ! products ! ================================
admin_route.get('/Productlist',productController.productlist)
admin_route.get('/addproductlist',productController.addproductlist)
admin_route.get('/listproduct',productController.listproduct)
admin_route.get('/unlistProduct',productController.unlistProduct)
admin_route.get('/editpage',productController.editpage)
admin_route.get('/viewProductPage',productController.viewProductPage)

// === ! Banners ! ============================================

admin_route.get('/bannerlist',bannerController.bannerlist)
admin_route.get('/addbannerlist',bannerController.loadbannerAdd);
admin_route.get('/editbanner',bannerController.loadBannerEdit)
admin_route.get('/listbanner',bannerController.listbanner)

// ! orderlist !==========================================
admin_route.get('/orderList',orderController.listUserOrders)
admin_route.get('/orderstatus',orderController.changeOrderStatus)
admin_route.get('/orderdetails',orderController.adminOrderDetails)
admin_route.get('/cancelProduct',orderController.produtCancel)
admin_route.get('/refundOrder',orderController.returnOrder)
admin_route.get('/cancelOrder',orderController.orderCancel)
admin_route.get("/transactionList",orderController.transactionList)
admin_route.get("/salesReport",orderController.loadSalesReport);


// ! coupon !  =================================================

admin_route.get('/addCoupon',couponController.addCouponPage)
admin_route.get('/couponList',couponController.couponList)
admin_route.get('/couponUnlist',couponController.unlistCoupon)
admin_route.get('/loadEditCoupon',couponController.loadEditCoupon)

// offer ! =============================
admin_route.get('/addOffer',offerController.loadOfferAdd)
admin_route.get('/offerList',offerController.OfferList)
admin_route.get('/blockOffer',offerController.offerBlock)
admin_route.get('/offerEdit',offerController.loadOfferEdit)




   

   
// ! category ! =============================
admin_route.post('/editCategories',categoryUpload.single('image'),categoryController.insertEditCategory)
admin_route.post('/addcategories',categoryUpload.single('image'),categoryController.insertCategory)

// banner post ! ==================================
admin_route.post('/addbannerlist',bannerUplaod.single('image'),bannerController.bannerAdd) 
admin_route.post("/editbanner",bannerUplaod.single('image'),bannerController.editbanner);

// productlist ! ========================

admin_route.post('/addproductlist',productUpload.single('image'),productController.insertproduct)
admin_route.post('/editProductlist', productUpload.single('image'), productController.insertEditProduct);

//coupon !==============================

admin_route.post('/addCoupon',couponController.insertCoupon)
admin_route.post('/editCoupon',couponController.insertEditCoupon)   

// offer ! =============================    

admin_route.post('/addOffer',offerController.addOffer)
admin_route.post('/offerEdit',offerController.editOffer)
    



module.exports=admin_route;