const user = require("../models/userModel");
const categories = require("../models/categoriesModel");
const product = require("../models/productModels");

//===categories list==================

const categoriesList = async (req,res) => {
    try {
        const catData = await categories.find()

        res.render ('categoriesList',{catData:catData});

    }catch (error) {
        console.log(error.message);
    }
}

//=======add categories=================================

const addcategories = async(req,res) => {
    try{
        res.render('addcategories');
    }catch (error) {
        console.log(error);
    }
}

//==== insert categories===================================

const insertCategory = async(req,res) => {

 try{   
    const categoryData = new categories({
        category : req.body.title,    
        description : req.body.Description,
        Image: req.file.filename

    })

    let sameCat = await categories.findOne({ categories: { $regex: new RegExp(categoryData.category, "i") } })
    if (sameCat) {
      res.render('addcategories', { message: 'category exists' })
    } else {
      await categoryData.save();
      res.redirect('/admin/addcategories')
    }   

 } catch(error) {
    console.log(error)
}}
// ! list and unlist category
const listCat = async (req, res) => {
    try {
      const id = req.query.id;
      await categories.updateOne({ _id: id }, { isListed: true });
      const catData = await categories.findOne({ _id: id })
      await product.updateMany({ category: catData.categories }, { $set: { isListed: true } })
      res.redirect("/admin/categoriesList");
    } catch (error) {
      console.log(error.message); 
    }
  }
  const unlistCat = async (req, res) => {
    try {
      const id = req.query.id;
      await categories.updateOne({ _id: id }, { isListed: false });
      const catData = await categories.findOne({ _id: id })
      await product.updateMany({ category: catData.categories }, { $set: { isListed: false } })
      res.redirect("/admin/categoriesList");
    } catch (error) {
      console.log(error.message);
    }
  } 

  //=============edit categories========================================================================

  const editCategories = async (req,res) => { 
    try {

       const id = req.query.id;
       const categoryData = await categories.findById({_id:id})
if(categoryData){
    res.render ('editcategory',{category:categoryData});
}else {
   
}
    }catch (error) {
        console.log(error.message); 
    }}

//========== insert edit categories=======================

const insertEditCategory = async (req,res) => {
    try {
        const id = req.query.id;
        const sameCat = await categories.findOne({_id: {$ne: id},categories:{ $regex:new RegExp(req.body.name, "i" )}});
        const updateData = await categories.findById(id);
        if(sameCat) {
            res.render('editcategory', { category:updateData, message: 'Category with the same name exists,try another name'});
        }else{

            if(req.body.name) {
                updateData.category = req.body.name;
            }   
            if(req.body.description) {
                updateData.description = req.body.description;
            }
            if (req.file) {
                updateData.Image = req.file.filename; // Assuming you want to store the filename in the 'image' field
            }
            
                     
            await updateData.save();
            res.redirect("/admin/categories")
        }
        
    }catch (error) {
      console.log(error.message);
    }
    }
    







    

module.exports={
    categoriesList,
    addcategories,
    insertCategory,
    editCategories,
    listCat,    
    unlistCat,
    insertEditCategory
    
}

   


