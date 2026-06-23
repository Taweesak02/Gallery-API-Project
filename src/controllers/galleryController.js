const galleryService = require('../services/galleryService')

const addArtwork = async (req,res) => {
    try{
        const userId = req.userData.id
        const title = req.body.title
        const imagePath = req.file?.filename ? `/image/${req.file.filename}` :null
        const response = await galleryService.addArtwork(userId,title,imagePath)
        res.status(201).json({message:"Add artwork success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Add artwork failed",error:error.message})
    }
}

const getArtwork = async(req,res)=>{
    try{
        const searchQuery = req.query
        const response = await galleryService.getArtwork(searchQuery)
        res.status(200).json({message:"Get artwork success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Get artwork failed",error:error.message})
    }
}

const getArtworkById = async(req,res)=>{
    try{
        const artworkId = req.params.artworkId
        const response = await galleryService.getArtworkById(artworkId)
        res.status(200).json({message:"Get artwork success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Get artwork failed",error:error.message})
    }
}

const editArtwork = async(req,res)=>{
    try{
        const userId = req.userData.id
        const artworkId = req.params.artworkId
        const title = req.body.title
        const imagePath = req.file?.filename ? `/image/${req.file.filename}` :null
        const response = await galleryService.editArtwork(userId,artworkId,title,imagePath)
        res.status(200).json({message:"Edit artwork success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Edit artwork failed",error:error.message})
    }
}

const deleteArtwork = async(req,res)=>{
    try{
        const artworkId = req.params.artworkId
        const userId = req.userData.id
        const response = await galleryService.deleteArtwork(userId,artworkId)
        res.status(200).json({message:"Delete artwork success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"Delete artwork failed",error:error.message})
    }
}

module.exports = {
    addArtwork,
    getArtwork,
    getArtworkById,
    editArtwork,
    deleteArtwork
}