const artistService = require('../services/artistService')

const register = async(req,res)=>{
    try{
        const {id} = req.userData
        const {name} = req.body
        const response = await artistService.register(id,name)

        res.status(201).json({message:"register success",data:response})
    }catch(error){
        if(error.status == "409"){
             res.status(409).json({message: error.message})
        }
        res.status(500).json({message:"register failed",error: error.message})
    }
}

const deleteArtist = async(req,res)=>{
    try{
        const userData = req.userData
        const response = await artistService.deleteArtist(userData)
        res.status(200).json({message:"delete artist success"})
    }catch(error){
        res.status(500).json({message:"getProfile failed",error: error.message})
    }
}

const editArtist = async(req,res)=>{
    try{
        const userData = req.userData
        const editData = req.body
        const response = await artistService.editArtist(userData,editData)
        res.status(200).json({message:"edit profile success",data:response})
    }catch(error){
        res.status(500).json({message:"editProfile failed",error: error.message})
    }
}

const getProfile = async(req,res)=>{
    try{
        const id = req.params.userId
        const response = await artistService.getProfile(id)
        res.status(200).json({message:"get profile success",data:response})
    }catch(error){
        if(error.status == "404"){
            res.status(404).json({message:error.message})
        }
        res.status(500).json({message:"get profile failed",error: error.message})
    }
}

module.exports ={
    register,
    getProfile,
    editArtist,
    deleteArtist
}