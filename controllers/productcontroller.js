const user = require("../models/categoriesModel")
const product = require("../models/productModels")
const categories = require("../models/categoriesModel")


// user side===================================================

const shop = async (req, res) => {
    try {
        const products = await product.find();
        const category = await categories.find();
        const itemsPerPage = 9;
        let currentPage = parseInt(req.query.page) || 1;
        currentPage = currentPage > 0 ? currentPage : 1;

        let filterCriteria = {};

        // Category part in home page
        if (req.query.category) {
            filterCriteria.category = req.query.category;
        }

        // Filters checking
        // if (req.body.category) {
        //     filterCriteria.category = { $in: req.body.category };
        // }

        const searchQuery = req.query.search;
        if (searchQuery) {
            filterCriteria.name = { $regex: new RegExp(searchQuery, "i") };
        }

        const totalProducts = await product.countDocuments(filterCriteria);
        let num = 0;
        if (req.query.sort) {
            num = req.query.sort;
        }
        const productData = await product
            .find(filterCriteria)
            .populate('category')
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage);

        const selectedFilters = {
            category: req.body.category || req.query.category || [],
        };

        res.render('productpage', {  productData, category, currentPage, selectedFilters });
   
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

// =====   product page=============================================================

const productpage = async (req,res) => {    
    try {
        console.log("productData")
        const id = req.query.id;
        const relatedProducts = await product.find({ _id: { $ne: id } }).populate('category').limit(4)

        const productData = await product.findOne({_id:id}).populate('category')
       
        res.render('productpage',{productData,relatedProducts})
    } catch(error) {
        console.log(error.message)
    }
}




    // product page============================
    // const productpage = async(req,res) => {
    //  try {
    //         const id = req.query.id;

    //         const productData = await product.findOne({_id: id}).populate('category')
    //         res.render('productlist',{productData})

    //  }catch (error) {
    //     console.log(error.meessge)
    //  }
    // }




   //===========admin side====================

   
   //load productside==============================
    const productlist = async (req, res) => {
        try {
    
            if (req.query.view) {
                view = req.query.view;
                const productData = await product.find({ isListed: view }).populate('category')
                res.render('adminProductlist', { productData })
            }
    
               const productData = await product.find({}).populate('category')
               
            res.render('adminProductlist', { productData})
        } catch (error) {
            console.log(error.message)
        }
    }
   //=====addproductlist =========================================


   const addproductlist = async (req,res) => {
    try {
        const Category = await categories.find({})
        res.render('addproductlist', { Category })

    }catch(error) {
        console.log(error.message);
    }
   }

   //===insertproductlist============================

const insertproduct = async (req,res) => {                                                    
    try{
        const productData = new product({
         name : req.body.name,
         description : req.body.description,
         image : req.file.filename,
         Brand : req.body.Brandname,    
         category : req.body.category,
         price : req.body.price,
         quantity : req.body.quantity
    })

        const sameProd = await product.findOne({name:productData.name})
        if(sameProd) {
            const Category = await categories.find({})
            res.render('addproductlist',{Category, message:"product category already exists"})

        } else {
            await productData.save();
            res.redirect('/admin/Productlist')
        }

    }catch (error){
        console.log(error)
    }
}

//=== List and Unlist===============================

const listproduct = async (req,res) => {
    try {
        const id = req.query.id;
        await product.updateOne ({_id : id}, { isListed:true});

        res.redirect("/admin/productlist");
    } catch (error) {
        console.log(error.message);
    }
}

const unlistProduct = async (req, res) => {
    try {
        const id = req.query.id;
        await product.updateOne({_id : id},{ isListed:false});

        res.redirect("/admin/productlist");
    } catch (error) {
        console.log(error.message);
    }
}

// edit page========================================================

const editpage = async(req, res) => {
    try {

        const id = req.query.id;
        const productData = await product.findOne({_id: id})
        const Category = await categories.find({})
        res.render('editproductlist', {message:'',Category,productData})
    }catch  (error) {
        console.log(error)
    }
}       

//===insert edit product=======================

const insertEditProduct = async (req,res) => {
    try{
        const id = req.body.id;
        const updateData = await product.findOne({_id:id})
        
        if(!updateData) {
            res.render('addproductlist',{ message:'product not found'})
        }

        const existingImages = updateData.productImages;

        if(req.body.name) {
            updateData.name = req.body.name
        }
        if(req.body.category) {
            updateData.category = req.body.category
        }
        if(req.body.description) {
            updateData.description = req.body.description
        }
        if(req.body.price) {    
            updateData.price = req.body.price
        }
        if(req.body.Brandname) {
            updateData.Brand = req.body.Brandname
        }
        if(req.body.quantity) {
            updateData.quantity =req.body.quantity
        }
        if (req.file) {
            updateData.image = req.file.filename; // Assuming you want to store the filename in the 'image' field
        }
        await updateData.save();
        res.redirect('/admin/productlist')

    }catch (error){
    
        console.log(error)

}
} 

//view product page=====================================

const viewProductPage = async(req,res) => {
    try {
        const id = req.query.id
        const products = await product.findOne({_id:id})
        res.render('viewProductPage',{products})
    } catch(error) {
        console.log(error.message)
    }
}















   module.exports = {
    productlist,
    addproductlist,
    insertproduct,
    listproduct,
    unlistProduct,
    editpage,
    insertEditProduct,
    viewProductPage,
    shop,
    productpage

   }    