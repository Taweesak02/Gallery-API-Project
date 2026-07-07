const galleryService = require('../services/galleryService')
const asyncHandler = require('../middlewares/asyncHandler')
const responseHandler = require('../utils/responseHandler')
const galleryResponse = require('../models/galleryResponse')

const addArtwork = asyncHandler(async (req,res) => {

    const userId = req.userData.id
    const title = req.body.title
    const imagePath = req.file?.filename ? `/image/${req.file.filename}` :null
    const response = await galleryService.addArtwork(userId,title,imagePath)
    responseHandler(res,201,req.orignalUrl,galleryResponse(response))
})

const getArtwork = asyncHandler(async(req,res)=>{
 
    const searchQuery = req.query
    const response = await galleryService.getArtwork(searchQuery)
    responseHandler(res,200,req.orignalUrl,response.length != 0 ? response.map(item => galleryResponse(item)):"No artwork")
})

const getArtworkById = asyncHandler(async(req,res)=>{
    
    const artworkId = req.params.artworkId
    const response = await galleryService.getArtworkById(artworkId)
    responseHandler(res,200,req.orignalUrl,galleryResponse(response))
})

const editArtwork = asyncHandler(async(req,res)=>{
    const userData = req.userData
    const artworkId = req.params.artworkId
    const title = req.body?.title
    const imagePath = req.file?.filename ? `/image/${req.file.filename}` :null
    const response = await galleryService.editArtwork(userData,artworkId,title,imagePath)
    responseHandler(res,200,req.orignalUrl,galleryResponse(response))
})

const deleteArtwork = asyncHandler(async(req,res)=>{
    const artworkId = req.params.artworkId
    const userData = req.userData
    const response = await galleryService.deleteArtwork(userData,artworkId)
    responseHandler(res,200,req.orignalUrl,galleryResponse(response))   
})

module.exports = {
    addArtwork,
    getArtwork,
    getArtworkById,
    editArtwork,
    deleteArtwork
}