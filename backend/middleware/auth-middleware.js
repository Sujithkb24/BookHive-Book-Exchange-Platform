const jwt = require("jsonwebtoken")
const User = require("../models/user-model")

const authMiddleware = async(req, res, next) => {

    const token = req.header("Authorization")

    if(!token){
        return res.status(500).json({msg: "Unauthorized Request. No Token. Please Authorize", success: false})
    }
    const jwtToken = token.replace("Bearer", "").trim()

    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY)
        req.id = isVerified.userId
        next()
    } catch (error) {
        return res.status(500).json({msg: "Unauthorized Request. Please Authorize", success: false})
    }
}

module.exports = authMiddleware