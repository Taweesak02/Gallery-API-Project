const galleryResponse = (galleryData)=>({
    id:galleryData.id,
    artist_id:galleryData.artist_id,
    title:galleryData.title,
    image_path:galleryData.image_path,
    created_at:galleryData.created_at
})

module.exports = galleryResponse