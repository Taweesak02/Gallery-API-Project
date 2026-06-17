const artistService = require('../services/artistService')

const register = async(req,res)=>{
    try{
        const {id} = req.userData
        const {name} = req.body
        const response = await artistService.register(id,name)

        res.status(201).json({message:"Register success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Register failed",error: error.message})
    }
}

const deleteArtist = async(req,res)=>{
    try{
        const userData = req.userData
        const response = await artistService.deleteArtist(userData)
        res.status(200).json({message:"Delete artist success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Delete artist failed",error: error.message})
    }
}

const editArtist = async(req,res)=>{
    try{
        const userData = req.userData
        const editData = req.body
        const response = await artistService.editArtist(userData,editData)
        res.status(200).json({message:"Edit profile success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Edit profile failed",error: error.message})
    }
}

const getProfile = async(req,res)=>{
    try{
        const id = req.params.userId
        const response = await artistService.getProfile(id)
        res.status(200).json({message:"Get profile success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Get profile failed",error: error.message})
    }
}

module.exports ={
    register,
    getProfile,
    editArtist,
    deleteArtist
}