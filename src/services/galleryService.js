const artistRepo = require('../repository/artistRepo')
const galleryRepo = require('../repository/galleryRepo')
const AppError = require('../utils/appError')
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

const editArtwork = async(userData,artworkId,title,imagePath)=>{

    const artworkData = await galleryRepo.getArtworkById(artworkId)
    const artistData = await artistRepo.findByUserId(userData.id)
    if(userData.role !== 'admin' && artworkData.artist_id !== artistData.id ){
        throw new AppError("You are not allow to edit other artwork",403)
    }

    const setvaraiable = []

    if(title){
        setvaraiable.push(`title = '${title}' `)
    }
   
    if(imagePath){
        setvaraiable.push(`image_path = '${imagePath}' `)
        await imageService.deleteImages([artworkData.image_path])
    }
    
    if(setvaraiable.length == 0){
        throw new AppError("No data to edit",400)
    }
    
    const result = await galleryRepo.editArtwork(artworkId,setvaraiable)
    return result
}

const deleteArtwork = async(userData,artworkId)=>{
    const artworkData = await galleryRepo.getArtworkById(artworkId)
    const artistData = await artistRepo.findByUserId(userData.id)
    if(userData.role !== 'admin' && artworkData.artist_id !== artistData.id ){
        throw new AppError("You are not allow to delete other artwork",403)
    }

    const response = await galleryRepo.deleteArtwork(artworkId)
    await imageService.deleteImages([response.image_path])
  
    return response
}

module.exports = {
    addArtwork,
    getArtwork,
    getArtworkById,
    editArtwork,
    deleteArtwork
}