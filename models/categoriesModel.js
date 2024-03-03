
const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({

    category: {
        type:String,
        required: true
    },
    description:  {
        type: String,
        required:true
    },
    Image:  {
        type:String,
        required:true
    },
    isListed: {
        type:Boolean,
        default:false
    },
    discountStatus: {
        type:Boolean,
        default:false
    },
    name: {
        type:String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount:String,
    discountStart:Date,
    discountEnd:Date,
})

module.exports = mongoose.model('category',categoriesSchema)