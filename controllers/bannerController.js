const Banner = require("../models/bannerModel")
const Product = require("../models/productModels")
const Category = require("../models/categoriesModel")


    // bannerlist page===================================

    const bannerlist = async(req,res) => { 
        try{
            const page = parseInt(req.query.page) || 1
            let query = {};
            const limit= 7;
            const totalcount = await Banner.countDocuments(query);
            const totalPages = Math.ceil(totalcount/limit)

            const banner = await Banner.find({})

           
            res.render("bannerlist",{banner,totalPages,currentpage: page});

        }catch (error){
            console.log(error)
        }
   };


   //banner adding page========================================================

   const loadbannerAdd = async(req,res) => {
    try{
        const category = await Category.find();
        const product = await Product.find();
        const admin = req.session.adminData;
   res.render('addbannerlist',{ admin,product,category});
    }catch(error) {
        console.log(error)
    }
   } 

   //banner Add ===================================

   const bannerAdd = async (req, res) => { 
    try {
        if (!req.body) {
            res.redirect("/admin/addbannerlist");
        }

        const image = req.file.filename;

        const {
            title,
            description,
            subtitle,               
        } = req.body;
        const newBanner = new Banner({
            title,
            image,
            description,
            subtitle,
        });
        newBanner.bannerType = req.body.bannerType;
        await newBanner.save();

        res.redirect("/admin/bannerlist");
    } catch (error) {
        console.log(error.message);
    }
};

// load banneredit !======================================
const loadBannerEdit = async(req,res) =>{
    try {
        const id = req.query.id;
        const banner = await Banner.findOne({_id:id})

        res.render("editbanner", { banner });  
    } catch (error) {
        console.log(error.message);
    }
    
};

// ! edit banner page ! ======================================


const editbanner = async (req, res) => {

    try {
        const id = req.query.id;
        const bannerData = await Banner.findOne({_id:id})


        if (req.body.title) {
            bannerData.title = req.body.title;      
        }
        if (req.body.description) {
            bannerData.description = req.body.description;
        }
        if (req.body.subtitle) {
            bannerData.subtitle = req.body.subtitle;
        }
        if (req.file) {
            bannerData.image = req.file.filename;
        }
        await bannerData.save();
        res.redirect("/admin/bannerlist");
    } catch (error) {
        console.log(error.message);
    }
};

// ! list and unlist banner ! ====================

const listbanner = async (req, res) => {
    try {
        const id = req.query.id; // Use 'id' instead of 'bannerId'
        const bannerData = await Banner.findById(id);

        if (!bannerData) {
            return res.status(404).send("Banner not found");
        }

        bannerData.isListed = !bannerData.isListed; // Toggle the boolean value

        await bannerData.save();
        res.redirect("/admin/bannerlist");
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};
    












    module.exports = {
        bannerlist,
        bannerAdd,
        loadbannerAdd,
        loadBannerEdit,
        editbanner,
        listbanner
    }