const express = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog-model");
const Comment = require("../models/comment-model");

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


router.post("/create-Blog", upload.single("coverImage"), async (req,res)=>{

    const {title,body} = req.body;
    
    const blog = await Blog.create({
        title,
        body,
        coverImageUrl:`/uploads/${req.file.filename}`,
        createdBy: req?.user?._id,
    })

    return res.redirect(`/blog/${blog._id}`);

});

router.get("/:blogId" , async (req,res)=>{

    const blog = await Blog.findById(req.params.blogId).populate("createdBy");
    const comments = await Comment.find({blog: req.params.blogId }).populate("createdBy");

    return res.render("blog", { blog, user: req.user , comments});

})


router.post("/comment/:blogId" , async (req,res)=>{

    await Comment.create({
        content:req.body.content,
        blog : req.params.blogId,
        createdBy : req.user._id
    });

    return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports = router
