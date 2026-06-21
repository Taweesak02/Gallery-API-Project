const artistRepo = require('../repository/artistRepo')
const galleryRepo = require('../repository/galleryRepo')
const userRepo = require('../repository/userRepo')
const AppError = require('../errors/errorHandle')
const imageService = require('./imageService')

const register = async (userId,name,imagePath)=> {
    //add artist
    const response = await artistRepo.addArtist(userId,name)
    if(!response){
        throw new AppError("There are already have this artist",409)
    }
    await userRepo.updateRole('artist',userId)
    let artistData
    if(imagePath){
        artistData = await artistRepo.editArtist(userId,[`profile_image = '${imagePath}'`])
    }
    
    return artistData || response
}

const deleteArtist = async(userData)=>{
    const artistData = await artistRepo.findByUserId(userData.id)
    const allArtwork = await galleryRepo.getArtworkPathByArtistId(artistData.id)
    const imagePaths = allArtwork.map(item => item.image_path)

    if(imagePaths){
        await imageService.deleteImages(imagePaths)
    }
    if(!(artistData.profile_image == 'unknown')){
        await imageService.deleteImages([artistData.profile_image])
    }
    //delete image
    const response = await artistRepo.deleteArtist(userData.id)
    if(!response){
        throw new AppError('There are no this artist',404)
    }

    await userRepo.updateRole('user',userData.id)
   
}

const editArtist = async(userData,editData,imagePath)=>{
     let newEditData = []

    if(editData.name){
        newEditData.push(`name = '${editData.name}'`)
    }
    if(editData.sex){
        newEditData.push(`sex = '${editData.sex}'`)
    }
    if(editData.birth_date){
        newEditData.push(`birth_date = '${editData.birth_date}'`)
    }
    if(editData.nationality){
        newEditData.push(`nationality = '${editData.nationality}'`)
    }
    if(imagePath){
        const artistData = await artistRepo.findByUserId(userData.id)
        if(artistData){
            await imageService.deleteImages([artistData.profile_image])
        }
        newEditData.push(`profile_image = '${imagePath}'`)
    }
    //delete image
    const response = await artistRepo.editArtist(userData.id,newEditData)
    if(!response){
        throw new AppError('Artist Not Found',404)
    }
    return response
}


const getProfile = async (id)=>{
    const response = await artistRepo.findByID(id)
    if(!response){
         throw new AppError('Artist Not Found',404)
    }
    return response
}

module.exports = {
    register,
    getProfile,
    editArtist,
    deleteArtist
}