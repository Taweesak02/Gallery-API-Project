const artistService = require('../services/artistService')
const imageService = require('../services/imageService')
const AppError = require('../errors/errorHandle')

const register = async(req,res)=>{
    try{
        const userId = req.userData.id
        const {name,sex,birth_date,nationality} = req.body
        const imagePath = req.file?.filename ? `/image/${req.file?.filename }` : null
        // check name is require if not delete image that upload before add artist
        if(!name && imagePath){
            await imageService.deleteImages([imagePath])
            return res.status(400).json({message:"Register artist failed",error:"missing field"})
        }
        const response = await artistService.register(userId,name,sex,birth_date,nationality,imagePath)
        res.status(201).json({message:"Register artist success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Register artist failed",error: error.message})
    }
}

const deleteArtist = async(req,res)=>{
    try{
        const userId = req.userData.id
        const response = await artistService.deleteArtist(userId)
        res.status(200).json({message:"Delete artist success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Delete artist failed",error: error.message})
    }
}

const deleteArtistById = async(req,res)=>{
    try{
        const artistId = req.params.artistId
        const userId = req.userData.id
        const role = req.userData.role
        const artistData = await artistService.getProfileById(artistId)
        if(!(role == 'admin' || userId == artistData.user_id)){
            throw new AppError("You are not allow to delete other artist",401)
        }
        const response = await artistService.deleteArtist(artistData.user_id)
        res.status(200).json({message:"Delete artist success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Delete artist failed",error: error.message})
    }
}

const updateArtist = async(req,res)=>{
    try{
        const userId = req.userData.id
        const {name,sex,birth_date,nationality} = req.body
        const imagePath = req.file?.filename ? `/image/${req.file?.filename }` : null
        const response = await artistService.updateArtist(userId,name,sex,birth_date,nationality,imagePath)
        res.status(200).json({message:"Edit artist success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Edit artist failed",error: error.message})
    }
}

const getProfile = async(req,res)=>{
    try{
        const {userId,name,sex,birthdate,nationality,createAt} = req.query
        const response = await artistService.getProfile(userId,name,sex,birthdate,nationality,createAt)
        res.status(200).json({message:"Get profile success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Get profile failed",error: error.message})
    }
}

const getProfileById = async(req,res)=>{
    try{
        const artistId = req.params.artistId
        const response = await artistService.getProfileById(artistId)
        res.status(200).json({message:"Get profile success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Get profile failed",error: error.message})
    }
}

module.exports ={
    register,
    getProfile,
    getProfileById,
    updateArtist,
    deleteArtist,
    deleteArtistById
}