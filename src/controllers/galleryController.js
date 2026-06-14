const galleryService = require('../services/galleryService')

const addArtwork = async (req,res) => {
    try{
        const userId = req.userData.id
        const title = req.body.title
        const imagePath = req.file.path
        const response = await galleryService.addArtwork(userId,title,imagePath)
        res.status(201).json({message:"add Artwork success",data:response})
    
    }catch(error){
        res.status(500).json({message:"add Artwork failed",error:error.message})
    }
}

const getArtwork = async(req,res)=>{
    try{
        const searchQuery = req.query
        const response = await galleryService.getArtwork(searchQuery)
        res.status(200).json({message:"get Artwork success",data:response})
    }catch(error){
        res.status(500).json({message:"get Artwork failed",error:error.message})
    }
}

const getArtworkById = async(req,res)=>{
    try{
        const artworkId = req.params.id
        const response = await galleryService.getArtworkById(artworkId)
        res.status(200).json({message:"get Artwork success",data:response})
    }catch(error){
        res.status(500).json({message:"get Artwork failed",error:error.message})
    }
}

const editArtwork = async(req,res)=>{
    try{
        const userId = req.userData.id
        const artworkId = req.params.id
        const editData = req.body
        const imagePath = req.file?.path || null
        
        const response = await galleryService.editArtwork(userId,artworkId,editData,imagePath)
        res.status(200).json({message:"edit Artwork success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"edit Artwork failed",error:error.message})
    }
}

const deleteArtwork = async(req,res)=>{
    try{
        const artworkId = req.params.id
        const userId = req.userData.id
        const response = await galleryService.deleteArtwork(userId,artworkId)
        res.status(200).json({message:"delete Artwork success",data:response})
    }catch(error){
        res.status(error.status || 500).json({message:"delete Artwork failed",error:error.message})
    }
}

module.exports = {
    addArtwork,
    getArtwork,
    getArtworkById,
    editArtwork,
    deleteArtwork
}