const jwtService = require("../services/jwtService")
const userRepo = require("../repository/userRepo")
const asyncHandler = require('../middlewares/asyncHandler')
const AppError = require('../utils/appError')

const refreshTokenCheck = asyncHandler(async (req,res,next) =>{

    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        throw new AppError("Token is required",400)
    }

    const decoded = jwtService.verifyToken(refreshToken)
    
    if(!decoded ){
        throw new AppError("Token is unvalid",401)
    }
    // pull refreshtoken from database
    const userData = await userRepo.getData(decoded.sub)
    const matchtoken = await userRepo.findByRefreshToken(userData.refresh_token)
    // check matching token
    if(refreshToken != matchtoken.refresh_token){
        throw new AppError("Token not matching",404)
    }
    req.userData = userData
    next();

})

const accessTokenCheck = asyncHandler(async (req, res, next) => {
  
        const authHeader = req.headers['authorization']

        // ── No access token → fall back to refresh token check ──
        if (!authHeader) {
            throw new AppError("Token is required",400)
        }

        const accessToken = authHeader.split(' ')[1]

        // ── Invalid/missing bearer value → fall back to refresh token check ──
        if (!accessToken) {
            throw new AppError("Token is required",400)
        }

        const decoded = jwtService.verifyToken(accessToken)

        // ── Expired/invalid access token → fall back to refresh token check ──
        if (!decoded) {
            throw new AppError("Token is unvalid",401)
        }

        const userData = await userRepo.getData(decoded.sub)
        req.userData = userData
        next();
})

module.exports ={
    refreshTokenCheck,
    accessTokenCheck
}