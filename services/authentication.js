const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const generateToken=(user)=>{

    const payload = {
        _id:user._id,
        email:user.email,
        profileImageUrl :user.profileImageUrl,
        role:user.role
    }

    const token = jwt.sign(payload , process.env.JWT_SECRET_KEY);

    return token;

}

const validateToken = (token)=>{
    
    const result = jwt.verify(token, process.env.JWT_SECRET_KEY);

    return result;

}

module.exports = {
    generateToken,
    validateToken
}