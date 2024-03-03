const User = require("../models/userModel");
const Category = require("../models/categoriesModel");
const bcrypt = require('bcrypt');
const Order = require("../models/orderModel");
const Product = require("../models/productModels"); 

const Orders = require("../models/orderModel");

// =======loadLogin==================================================================================================
const loadLogin = async (req, res) => {
    try {
        res.render('adminLogin');
    } catch (error) {
        console.log(error.message);
    }
}

// ====== verifyAdmin =============================================================================================================
const verifyAdmin = async (req, res) => {
    try {
        const name = req.body.name;
        const password = req.body.password;

        const adminData = await User.findOne({ email: name })

        if (adminData) {
            if (adminData.password == password) {
                if (adminData.is_admin === 1) {
                    res.render('dashboard')
                } else {
                    res.render('adminLogin', { message: 'unauthorised' })
                }
            } else {
                res.render('adminLogin', { message: 'password is wrong!' })
            }

        } else {
            res.render('adminLogin', { message: 'username is wrong!' })
        }
    } catch (error) {
        console.log(error.message);
    }
}

// ! dashboard !====================================
const dashboard = async (req, res) => {
    try {
        const [
            totalRevenue,
            totalUsers,
            totalOrders,
            totalProducts,
            totalCategories,
            ordersData, // Change variable name to avoid conflicts
            monthlyEarnings,
            newUsers,
        ] = await Promise.all([
            Orders.aggregate([
                { $match: { paymentStatus: "Payment Successful" } },
                { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
            ]),
            User.countDocuments({ is_blocked: false, is_verified: true }),
            Orders.countDocuments(),
            Product.countDocuments(), // Use the imported Product model
            Category.countDocuments(),
            Orders.find().populate("user").limit(10).sort({ orderDate: -1 }),
            Orders.aggregate([
                {
                    $match: {
                        paymentStatus: "Payment Successful",
                        orderDate: {
                            $gte: new Date(
                                new Date().getFullYear(),
                                new Date().getMonth(),
                                1
                            ),
                        },
                    },
                },
                { $group: { _id: null, monthlyAmount: { $sum: "$totalAmount" } } },
            ]),
            User.find({ is_blocked: 0, is_varified: 1 })
                .sort({ date: -1 })
                .limit(5),
        ]);

        const totalRevenueValue =
            totalRevenue.length > 0 ? totalRevenue[0].totalAmount : 0;

        const monthlyEarningsValue =
            monthlyEarnings.length > 0 ? monthlyEarnings[0].monthlyAmount : 0;

        res.render("dashboard", {
            Orders: ordersData,
            newUsers,
            totalRevenue: totalRevenueValue,
            totalOrders,
            totalProducts,
            totalCategories,
            totalUsers,
            monthlyEarnings: monthlyEarningsValue,
        });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    loadLogin,
    verifyAdmin,
    dashboard
}
