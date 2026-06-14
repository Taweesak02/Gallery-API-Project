const jwt = require('jsonwebtoken')
require('dotenv').config()

const generateAccessToken = (user) => {
    return jwt.sign({
        sub:user.id,
        username:user.username,
        email:user.email,
        role:user.role,
        jti:crypto.randomUUID(),
        type:"access"}, 
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_ACCESS_TOKEN })
}

const generateRefreshToken = (user) => {
    return jwt.sign({sub:user.id,
        username:user.username,
        email:user.email,
        role:user.role,
        jti:crypto.randomUUID(),
        type:"refresh"}, 
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_REFRESH_TOKEN })
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return decoded
    } catch (err) {
        return null
    } 
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken
}