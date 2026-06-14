const artistRepo = require('../repository/artistRepo')
const galleryRepo = require('../repository/galleryRepo')
const AppError = require('../errors/errorHandle')
const fs = require('fs').promises

const addArtwork =  async (userId,title,imagePath)=>{
    const artistData = await artistRepo.findByUserId(userId)
   
    if(!artistData){
        throw {status:404,message:"Artist Not Found"}
    }
    const response = await galleryRepo.addArtwork(artistData.id,title,imagePath)
    return response
}

const getArtwork = async (searchQuery)=>{
    const response = await galleryRepo.getArtwork(searchQuery)
    return response
}

const getArtworkById = async (artworkId)=>{
    const response = await galleryRepo.getArtworkById(artworkId)
    if(!response){
        throw new AppError("Artwork not Found",404)
    }
    return response
}

const editArtwork = async(userId,artworkId,editData,imagePath)=>{

    if(!editData && !imagePath){
        throw new AppError("No Data to Edit",400)
    }

    if (imagePath !== null){
        const artworkData = await galleryRepo.getArtworkById(artworkId)
        fs.unlink(artworkData.image_path)
    }

    const artistData = await artistRepo.findByUserId(userId)
    const response = await galleryRepo.editArtwork(artistData.id,artworkId,editData,imagePath)
    return response
}

const deleteArtwork = async(userId,artworkId)=>{
    const artistData = await artistRepo.findByUserId(userId)
    const response = await galleryRepo.deleteArtwork(artistData.id,artworkId)
    await fs.unlink(response.image_path)
    if(!response){
        throw new AppError('artwork not found',404)
    }
    return response
}

module.exports = {
    addArtwork,
    getArtwork,
    getArtworkById,
    editArtwork,
    deleteArtwork
}