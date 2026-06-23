const artistRepo = require('../repository/artistRepo')
const galleryRepo = require('../repository/galleryRepo')
const userRepo = require('../repository/userRepo')
const AppError = require('../errors/errorHandle')
const imageService = require('./imageService')

const register = async (userId,name,sex,birth_date,nationality,imagePath)=> {
    //add artist
    const response = await artistRepo.addArtist(userId,name)
    if(!response){
        throw new AppError("There are already have this artist",409)
    }
    //update role artist to user
    await userRepo.updateRole(userId,'artist')
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
        updatedData = await artistRepo.editArtist(userId,artistData)

        return updatedData
    }
    return response
}

const deleteArtist = async(userId)=>{
    const artistData = await artistRepo.findByUserId(userId)
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
    // delete artist account
    const response = await artistRepo.deleteArtist(userId)
    if(!response){
        throw new AppError('There are no this artist',404)
    }
    //update role user to user
    await userRepo.updateRole(userId,'user')
   
}

const updateArtist = async(userId,name,sex,birth_date,nationality,imagePath)=>{
    // check what change
    const editData = []
    if(name){
        editData.push(`name = '${editData.name}'`)
    }
    if(sex){
        editData.push(`sex = '${editData.sex}'`)
    }
    if(birth_date){
        editData.push(`birth_date = '${editData.birth_date}'`)
    }
    if(nationality){
        editData.push(`nationality = '${editData.nationality}'`)
    }

    //check if image update or not
    if(imagePath){
        //delete lastest image
        const artistData = await artistRepo.findByUserId(userId)
        if(artistData){
            await imageService.deleteImages([artistData.profile_image])
        }
        //push new image
        editData.push(`profile_image = '${imagePath}'`)
    }
    
    const response = await artistRepo.updateArtist(userId,editData)
    if(!response){
        throw new AppError('Artist Not Found',404)
    }
    return response
}


const getProfile = async (artistId)=>{
    const response = await artistRepo.findByID(artistId)
    if(!response){
         throw new AppError('Artist Not Found',404)
    }
    return response
}

module.exports = {
    register,
    getProfile,
    updateArtist,
    deleteArtist
}