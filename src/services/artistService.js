const artistRepo = require('../repository/artistRepo')
const AppError = require('../errors/errorHandle')

const register = async (userId,name)=> {
    //add artist
    const response = await artistRepo.addArtist(userId,name)
    if(!response){
        throw new AppError("There are already have this artist",409)
    }
    return response
}

const deleteArtist = async(userData)=>{

    const response = await artistRepo.deleteArtist(userData.id)
    if(!response){
        throw new AppError('There are no this artist',404)
    }
   
}

const editArtist = async(userData,artistData)=>{
    const response = await artistRepo.editArtist(userData.id,artistData)
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