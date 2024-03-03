// !  models
// * address model 
const address = require('../models/addressModel')   
// * user model
const user = require("../models/userModel");

// ! add address page
const addAddressPage = async (req, res) => {
    try {
        res.render('addAddress')
    } catch (error) {   
        console.log(error.message)
    }
}


// ! insert Address !===================================

const insertAddress = async (req, res) => {
    try {
        const userId = req.session.userId
        const newAddress = new address({
            user: userId,
            type: req.body.type,
            phone: req.body.phone,
            houseName: req.body.houseName,
            name: req.body.name,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
        })

        await newAddress.save();

        if (req.query.checkout) {
            res.redirect('/checkoutpage');
        } else {
            res.redirect('/profile');
        }

    } catch (error) {
        console.log(error.message)
    }
}

// ! address  ===================================
const deleteAddress = async (req, res) => {
    try {
        const addressId = req.query.addressId
        await address.deleteOne({ _id: addressId })
        res.redirect('/profile');
    } catch (error) {
        console.log(error.message)
    }
}

// ! edit address
const editAddress = async (req, res) => {
    try {
        const addressId = req.query.addressId;
        const addressData = await address.findById(addressId);
        res.render('editAddress', { addressData });
    } catch (error) {
        console.log(error.message)
    }
}








module.exports = {
    addAddressPage,
    insertAddress,
    deleteAddress,
    editAddress
   
}