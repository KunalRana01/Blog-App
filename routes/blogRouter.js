const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
       const fileName = `${Date.now()}-${file.originalname}`;
       cb(null,fileName);
    }
})

const upload = multer({ storage: storage })

router.get("/add-Blog" , (req,res)=>{
    return res.render("addBlog" , {user:req.user});
})


router.post("/create-Blog", upload.single("coverImage"), (req,res)=>{
    console.log(req);
    
    console.log(req.body);

});

module.exports = router
