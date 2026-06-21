const jwtService = require("../services/jwtService")
const userRepo = require("../repository/userRepo")

const refreshTokenCheck = async (req,res,next) =>{
    try{
        const refreshToken = req.cookies.refreshToken

        if(!refreshToken){
            return res.status(401).json({message:'no token provide'})
        }

        const decoded = jwtService.verifyToken(refreshToken)
        
        if(!decoded ){
            return res.status(401).json({ message: 'refresh token not correct'})
        }
        // pull refreshtoken from database
        const userData = await userRepo.getData(decoded.sub)
        const matchtoken = await userRepo.findByRefreshToken(userData.refresh_token)
        // check matching token
        if(refreshToken != matchtoken.refresh_token){
            return res.status(404).json({ message: 'token went wrong' })
        }
        req.userData = userData
        next();
    }catch(error){
        res.status(500).json({message:"tokenCheck failed",error:error.message})
    }
}

// const accessTokenCheck = async (req,res,next)=>{
//     try{
//         const authHeader = req.headers['authorization']
//         if(!authHeader){
//             return res.status(401).json({message:'no token provide'})
//         }

//         const accessToken = authHeader.split(' ')[1]
//         const decoded = jwtService.verifyToken(accessToken)

//         if(!decoded ){
//             return res.status(401).json({ message: 'access token not correct'})
//         }

//         const userData = await userRepo.getData(decoded.sub)
       
//         req.userData = userData
//         next();
//     }catch(error){
//         res.status(500).json({message:"accessTokenCheck failed",error:error.message})
//     }
// }

const accessTokenCheck = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']

        // ── No access token → fall back to refresh token check ──
        if (!authHeader) {
            return res.status(401).json({message:'no token provide'})
        }

        const accessToken = authHeader.split(' ')[1]

        // ── Invalid/missing bearer value → fall back to refresh token check ──
        if (!accessToken) {
            return res.status(401).json({message:'access token not correct'})
        }

        const decoded = jwtService.verifyToken(accessToken)

        // ── Expired/invalid access token → fall back to refresh token check ──
        if (!decoded) {
            return res.status(401).json({ message: 'access token not correct'})
        }

        const userData = await userRepo.getData(decoded.sub)
        req.userData = userData
        next();
    } catch (error) {
        res.status(500).json({ message: "accessTokenCheck failed", error: error.message })
    }
}

module.exports ={
    refreshTokenCheck,
    accessTokenCheck
}