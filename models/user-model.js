const mongoose = require("mongoose");

const {createHmac , randomBytes} = require("node:crypto");
const { generateToken } = require("../services/authentication");

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageUrl:{
        type:String,
        default: "/images/defaultUserImage.jpg"
    },
    role:{
        type:String,
        enum : ["USER", "ADMIN"],
        default: "USER"
    }
    
} ,{timestamps:true});

userSchema.pre("save" , function(next){
    const user = this;

    if(!user.isModified("password")) return;

    // Made a random salt string for every user password
    const salt = randomBytes(16).toString();
    const hashedPass = createHmac("sha256" , salt)
    .update(user.password)
    .digest("hex");


    this.salt = salt;
    this.password = hashedPass;

    next;

})



userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
    let user = await this.findOne({email});

    if(!user) throw new Error("Error : User not found....");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256" , salt)
    .update(password)
    .digest("hex");

   if(hashedPassword !== userProvidedHash){
        throw new Error ("Incorrect Password...");
   };

   const token = generateToken(user);

   return token;

})  


const User = mongoose.model("user" , userSchema);

module.exports = User;