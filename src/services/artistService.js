const artistRepo = require('../repository/artistRepo')

const register = async (userId,name)=> {
    try{
         //add artist
        const response = await artistRepo.addArtist(userId,name)
        return response
    }catch(error){
        
        throw {status:409,message:"There are already have this artist"}
    }
}

const deleteArtist = async(userData)=>{

    const response = await artistRepo.deleteArtist(userData.id)
    if(!response){
        throw {status: 404, message: 'There are no this artist'}
    }
   
}

const editArtist = async(userData,artistData)=>{
    const response = await artistRepo.editArtist(userData.id,artistData)
    if(!response){
        throw {status: 404, message: 'Artist Not Found'}
    }
    return response
}


const getProfile = async (id)=>{
    const response = await artistRepo.findByID(id)
    if(!response){
        throw {status: 404, message: 'Artist Not Found'}
    }
    return response
}

module.exports = {
    register,
    getProfile,
    editArtist,
    deleteArtist
}