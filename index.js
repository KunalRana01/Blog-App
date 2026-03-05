const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const userRouter = require("./routes/userRouter");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const port = process.env.PORT || 3000 ;

//connect mongodb
mongoose.connect('mongodb://127.0.0.1:27017/blogify').then(()=>{
    console.log("MongoDB Connection Successfull.....");
    
})

//view engine setup
app.set("view engine" , "ejs");

//setup express's inbuilt middleware to handle form data..
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));



app.get("/" , (req,res)=>{
    res.render("home" , {
        user : req.user
    })
})

// Routes

app.use("/user" , userRouter);


app.listen(port , ()=>{
    console.log(`Server started at http://127.0.0.1:${port}`);
})