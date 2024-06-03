const mongoose=require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/world_of_shoes");
mongoose.connect("mongodb+srv://muhammedrameess89:muhammedrameess89@traversycluster.m3dpb7q.mongodb.net/world_of_shoes");


const express=require("express");
const app=express();
const nocache = require("nocache");
const session = require('express-session')


// ! session
app.use(session({
    secret: 'mine',
    resave: false,
    saveUninitialized: true
  }));
  
  app.use(nocache());

// ! session for ejs
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
//for user routes  ============================
const userRoute=require('./route/userRoute');


app.use('/',userRoute);

//adminroute    ====================
const adminRoute=require('./route/adminRoute')

app.use('/admin',adminRoute);

app.listen(3000,function(){
    console.log("server is running...");
});
  