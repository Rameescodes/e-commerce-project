const mongoose = require('mongoose');

function generateRandomNumberWithPrefix() {
    let prefix = "ODR"
    const randomNumber = Math.floor(Math.random() * 900000000) +1000000000;
    const result = `${prefix}${randomNumber}`;
    return result;
}

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
address: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Address',
},
orderID: {
    type: String,
    default: generateRandomNumberWithPrefix,
},
orderDate: {
    type: Date,
    default: Date.now,
},
deliveryDate: {
    type:Date,
},
shipping: {
    type: String,
    default:'Free Shipping'
},
status: {
    type:String,
    default: 'pending',
},
totalAmount: {
    type:Number,
    default:0
},
  paymentMethod: String,
  paymentStatus: {
    type: String,
    default: 'Pending'
  },

items: [
    {
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
        },
        quantity:Number,
        price: Number,              
        status: String
    },
],
});

module.exports = mongoose.model('Order',orderSchema);