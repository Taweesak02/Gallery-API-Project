const artistRepo = require('../repository/artistRepo')
const galleryRepo = require('../repository/galleryRepo')
const userRepo = require('../repository/userRepo')
const AppError = require('../utils/appError')
const imageService = require('./imageService')

const register = async (userData,name,sex,birth_date,nationality,imagePath)=> {

     // check name is require if not delete image that upload before add artist
    if(!name && imagePath){
        await imageService.deleteImages([imagePath])
        throw new AppError("Artist name required",400)
    }
    //add artist
    const response = await artistRepo.addArtist(userData.id,name)
    if(!response){
        throw new AppError("There are already have this artist",409)
    }
    //update role artist to user
    if(userData.role !== 'admin'){
        await userRepo.updateRole(userData.id,'artist')
    }
    
    //update artist data
    if(sex || birth_date || nationality || imagePath){
        const artistData = []
        if(sex){
            artistData.push(`sex = '${sex}'`)
        }
        if(birth_date){
            artistData.push(`birth_date = '${birth_date}'`)
        }
        if(nationality){
            artistData.push(`nationality = '${nationality}'`)
        }
        if(imagePath){
            artistData.push(`profile_image = '${imagePath}'`)
        }
        updatedData = await artistRepo.updateArtist(userData,artistData)

        return updatedData
    }
    return response
}

const deleteArtist = async(userData)=>{
    const artistData = await artistRepo.findByUserId(userData.id)
    // delete artwork require artist Id
    await clearImageFromArtist(artistData)
    // delete artist account
    const response = await artistRepo.deleteArtist(artistData.id)

    if(userData.role !== 'admin'){
        await userRepo.updateRole(userData.id,'user')
    }
    return response
}

const deleteArtistById = async(userData,targetId)=>{
     
    const artistData = await artistRepo.findByID(targetId)

    if(!(userData.role !== 'admin' || userData.id !== artistData.user_id)){
        throw new AppError("You are not allow to delete other artist account",403)
    }

    await clearImageFromArtist(artistData)
    // delete artist account
    const response = await artistRepo.deleteArtist(artistData.id)

    targetUserData = await userRepo.getData(artistData.user_id)
    if(targetUserData.role !== 'admin'){
        await userRepo.updateRole(targetUserData.id,'user')
    } 
    return response
}

const clearImageFromArtist = async (artistData)=>{
    // delete artwork require artist Id
    const allArtwork = await galleryRepo.getArtworkPathByArtistId(artistData.id)
    const imagePaths = allArtwork.map(item => item.image_path)
    //delete artwork image if have it
    if(imagePaths){
        await imageService.deleteImages(imagePaths)
    }
    //delete profile image if have it
    if(!(artistData.profile_image == 'unknown')){
        await imageService.deleteImages([artistData.profile_image])
    }
}

const updateArtist = async(userId,name,sex,birth_date,nationality,imagePath)=>{

    const artistData = await artistRepo.findByUserId(userId)
    
    // check what change
    const editData = []
    if(name){
        editData.push(`name = '${name}'`)
    }
    if(sex){
        editData.push(`sex = '${sex}'`)
    }
    if(birth_date){
        editData.push(`birth_date = '${birth_date}'`)
    }
    if(nationality){
        editData.push(`nationality = '${nationality}'`)
    }
    
    //check if image update or not
    if(imagePath){
        //delete lastest image
        
        if(artistData){
            await imageService.deleteImages([artistData.profile_image])
        }
        //push new image
        editData.push(`profile_image = '${imagePath}'`)
    }
    
    const response = await artistRepo.updateArtist(artistData.id,editData)
    return response
}

const updateArtistById = async (userData,targetId,name,sex,birth_date,nationality,imagePath)=>{
    const artistData = await artistRepo.findByID(targetId)

    if(!(userData.role !== 'admin' || userData.id !== artistData.user_id)){
        throw new AppError("You are not allow to delete other artist account",403)
    }

    // check what change
    const editData = []
    if(name){
        editData.push(`name = '${name}'`)
    }
    if(sex){
        editData.push(`sex = '${sex}'`)
    }
    if(birth_date){
        editData.push(`birth_date = '${birth_date}'`)
    }
    if(nationality){
        editData.push(`nationality = '${nationality}'`)
    }

    //check if image update or not
    if(imagePath){
        //delete lastest image
        if(artistData){
            await imageService.deleteImages([artistData.profile_image])
        }
        //push new image
        editData.push(`profile_image = '${imagePath}'`)
    }
    const response = await artistRepo.updateArtist(artistData.id,editData)
    return response

}

const getProfile = async(userId,name,sex,birthdate,nationality,createAt)=>{
    const response = await artistRepo.getArtist(userId,name,sex,birthdate,nationality,createAt)

    return response
}

const getProfileById = async (artistId)=>{
    const response = await artistRepo.findByID(artistId)

    return response
}

module.exports = {
    register,
    getProfileById,
    getProfile,
    updateArtist,
    updateArtistById,
    deleteArtist,
    deleteArtistById
}