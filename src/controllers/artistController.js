const artistService = require('../services/artistService')
const imageService = require('../services/imageService')
const asyncHandler = require('../middlewares/asyncHandler')
const responseHandler = require('../utils/responseHandler')
const {artistResponse} = require('../models/artistResponse') 

const register = asyncHandler(async(req,res)=>{
    const userData = req.userData
    const {name,sex,birth_date,nationality} = req.body
    const imagePath = req.file?.filename ? `/image/${req.file?.filename }` : null
   
    const response = await artistService.register(userData,name,sex,birth_date,nationality,imagePath)
    responseHandler(res,201,req.originalUrl,artistResponse(response))
})

const deleteArtist = asyncHandler(async(req,res)=>{
    const userData = req.userData
    const response = await artistService.deleteArtist(userData)
    responseHandler(res,200,req.originalUrl,artistResponse(response))
})

const deleteArtistById = asyncHandler(async(req,res)=>{
    const artistId = req.params.artistId
    const userData = req.userData
    const response = await artistService.deleteArtistById(userData,artistId)
    responseHandler(res,200,req.originalUrl,artistResponse(response))
})

const updateArtist = asyncHandler(async(req,res)=>{
 
    const userId = req.userData.id
    const {name,sex,birth_date,nationality} = req.body
    const imagePath = req.file?.filename ? `/image/${req.file?.filename }` : null
    const response = await artistService.updateArtist(userId,name,sex,birth_date,nationality,imagePath)
    responseHandler(res,200,req.originalUrl,artistResponse(response))
})

const getProfile = asyncHandler(async(req,res)=>{
    const {userId,name,sex,birthdate,nationality,createAt} = req.query
    const response = await artistService.getProfile(userId,name,sex,birthdate,nationality,createAt)
    responseHandler(res,200,req.originalUrl,response.map((item)=>artistResponse(item)))
})

const getProfileById = asyncHandler(async(req,res)=>{
    const artistId = req.params.artistId
    const response = await artistService.getProfileById(artistId)
    responseHandler(res,200,req.originalUrl,artistResponse(response))
})

module.exports ={
    register,
    getProfile,
    getProfileById,
    updateArtist,
    deleteArtist,
    deleteArtistById
}