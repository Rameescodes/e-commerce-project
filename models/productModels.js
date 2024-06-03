const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name :{
        type:String,
        required:true
    },

    name: String,
    category:{
      type:mongoose.Schema.Types.ObjectId,String,
      ref:'category'

    },
   price:{
    type: Number,
    required:true
   },
   image:{
    type:String,
    required:true
   },
   isListed:{
    type:Boolean,
    default:true
   },
   Brand: { type: String }, 
   
   quantity: {
    type:Number,
    required:true
   },
   description: {
    type:String,
    required:true
   }
    
});

module.exports = mongoose.model('Product', productSchema);