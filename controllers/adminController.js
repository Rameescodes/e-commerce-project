const User = require("../models/userModel");
const Category = require("../models/categoriesModel");
const bcrypt = require('bcrypt');
const Order = require("../models/orderModel");
const Product = require("../models/productModels"); 




// * dotenv
require("dotenv").config();

  const adminLogin = async (req, res) => {
    try {
      res.render("adminLogin");
    } catch (error) {
      console.log(error.message);
    }
  };

  // ! verify login
  const verifyLogin = async (req, res) => {
    try {
      let email = req.body.email;
      let password = req.body.password;
      console.log(email,password);

      if (
        email == process.env.ADMIN_EMAIL &&
        password == process.env.ADMIN_PASS
      ) {
        req.session.adminId = password;
        res.redirect("/admin/dashboard");
      } else {
        res.render("adminLogin", { message: "email and password incorrect" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //   ! dashboard
  const loadDashboard = async (req, res) => {
    try {
      console.log('first');
      const [
        totalRevenue,
        totalUsers,
        total,
        totalProducts,
        totalCategories,
        orders,
        monthlyEarnings,
        newUsers,
      ] = await Promise.all([
        Order.aggregate([
          { $match: { paymentStatus: "Payment Successful" } },
          { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
        ]),
        User.countDocuments({ is_blocked: false, is_verified: true }),
        Order.countDocuments(), // This is where totalOrders is assigned
        Product.countDocuments(),
        Category.countDocuments(),
        Order.find().populate("user").limit(10).sort({ orderDate: -1 }),
        Order.aggregate([
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
  
      // Other code omitted for brevity
      console.log('hello',total);
      // Pass totalOrders to the template
      res.render("dashboard", {
        orders,
        newUsers,
        totalRevenue: totalRevenue,
        total, // Correctly passing the total variable
        totalProducts,
        totalCategories,
        totalUsers,
        monthlyEarnings: monthlyEarnings,
    });
    
        
    } catch (error) {
      console.log(error.message);
    }
  };
  
  

  // ! logout
  const logout = async (req, res) => {
    try {
      req.session.destroy();
      res.redirect('/')
    } catch (error) {
      console.log(error.message);
    }
  }

  // ! load user
  const loadUsers = async (req, res) => {
    try {
      const itemsPerPage = 5;
      let currentPage = parseInt(req.query.page) || 1;
      currentPage = currentPage > 0 ? currentPage : 1;
      const totalProducts = await User.countDocuments({});
      const userData = await User.find({}).skip((currentPage - 1) * itemsPerPage).limit(itemsPerPage);


      res.render("userslist", { userData, currentPage, totalPages: Math.ceil(totalProducts / itemsPerPage) });
    } catch (error) {
      console.log(error.message);
    }
  }

  // ! block and unblock user
  const blockUser = async (req, res) => {
    try {
      const id = req.query.id;
      if (id == req.session.userId) {
        delete req.session.userId;
      }
      await User.updateOne({ _id: id }, { is_blocked: 1 });
      res.redirect("/admin/userslist");
    } catch (error) {
      console.log(error.message);
    }
  }

  const unblockUser = async (req, res) => {
    try {
      const id = req.query.id;
      await User.updateOne({ _id: id }, { is_blocked: 0 });
      res.redirect("/admin/userslist");
    } catch (error) {
      console.log(error.message);
    }
  }




  module.exports = {
    adminLogin,
    verifyLogin,
    loadDashboard,
    logout,
    loadUsers,
    blockUser,
    unblockUser
  };
