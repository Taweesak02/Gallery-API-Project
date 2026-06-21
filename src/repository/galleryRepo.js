const pool = require('../configs/dbConfig')

const addArtwork = async(artistId,title,imagePath)=>{
    const result = await pool.query(
        `INSERT INTO gallerys (artist_id, title,image_path) VALUES ($1, $2,$3) RETURNING *`,
        [artistId,title,imagePath]
    )
    return result.rows[0] || null
    
}

const getArtwork = async(searchQuery)=>{
    let setvaraiable = []

    if(searchQuery.title){
        setvaraiable.push(`title LIKE '%${searchQuery.title}%'`)
    }

    if(searchQuery.artist_id){
        setvaraiable.push(`artist_id = ${searchQuery.artist_id}`)
    }

    if(searchQuery.create_date){
        setvaraiable.push(`created_at LIKE '%${searchQuery.create_date}%'`)
    }

    const result = await pool.query(
        `select * from gallerys ${
            setvaraiable.length === 0
            ? ''
            : 'Where '+ setvaraiable.join('and')
        }`
    )
    return result.rows || null
}

const getArtworkById = async(id)=>{
    const result = await pool.query(
        `select * from gallerys where id = ${id}`
    )
    return result.rows[0] || null
}

const getArtworkPathByArtistId = async (artistId)=>{
    const result = await pool.query(
        `Select image_path from gallerys where artist_id = ${artistId}`
    )
    return result.rows || null
}

const editArtwork = async(artistId,artworkId,editData,image_path)=>{
    let setvaraiable = []

    if(editData.title !== undefined){
        setvaraiable.push(`title = '${editData.title}'`)
    }
 
    if(image_path !== null){
        setvaraiable.push(`image_path = '${image_path}'`)
    }

    const result = await pool.query(
        `UPDATE gallerys
        SET ${setvaraiable.join(",")}
        WHERE id = ${artworkId} and artist_id = ${artistId}  
        RETURNING *`
    )
    return result.rows[0] || null
}

const deleteArtwork = async(artistId,artworkId)=>{
    const result = await pool.query(
        `delete from gallerys where artist_id = $1 and id = $2 returning *`,
        [artistId,artworkId]
    )
    return result.rows[0] || null
}

module.exports = {
    addArtwork,
    getArtwork,
    getArtworkPathByArtistId,
    getArtworkById,
    editArtwork,
    deleteArtwork
}