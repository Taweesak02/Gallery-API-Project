const artistRepo = require('../repository/artistRepo')
const galleryRepo = require('../repository/galleryRepo')
const AppError = require('../errors/errorHandle')
const imageService = require('./imageService')

const addArtwork =  async (userId,title,imagePath)=>{
    //image is require
    if(!imagePath){
        throw new AppError("Image file is require",400)
    }
    // if artist not exist delete uploaded image
    const artistData = await artistRepo.findByUserId(userId)
    if(!artistData){
        if(imagePath){
            await imageService.deleteImages([imagePath])
        }
            
        throw new AppError("Artist Not Found",404)
        
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

    if (imagePath){
        const artworkData = await galleryRepo.getArtworkById(artworkId)
        await imageService.deleteImages([artworkData.image_path])
    }

    const artistData = await artistRepo.findByUserId(userId)
    const response = await galleryRepo.editArtwork(artistData.id,artworkId,editData,imagePath)
    return response
}

const deleteArtwork = async(userId,artworkId)=>{
    const artistData = await artistRepo.findByUserId(userId)
    const response = await galleryRepo.deleteArtwork(artistData.id,artworkId)
    await imageService.deleteImages([response.image_path])
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