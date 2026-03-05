const express = require("express");
const User = require("../models/user-model");

const router = express.Router();


router.get("/signup" , (req,res)=>{
    return res.render("signup" , {error:null , user:req.user});
});

router.get("/signin" , (req,res)=>{
    return res.render("signin" , {error:null , user:req.user});
});

router.get("/logout" , (req,res)=>{
    res.clearCookie("token").redirect("/");
})

router.post("/signup" , async (req,res)=>{

    const {fullname , email , password} = req.body;

    await User.create({
        fullname,
        email,
        password
    });

    return res.redirect("/");

})


router.post("/signin" , async (req,res)=>{
    const {email , password} = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken(email,password);
        return res.cookie("token" , token).redirect("/");
    }catch(error){
        return res.render("signin" , {error:"Incorrect Username Or Password" , user:req.user});
    }
})






module.exports = router;