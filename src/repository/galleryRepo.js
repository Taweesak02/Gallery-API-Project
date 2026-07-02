const pool = require('../configs/dbConfig')
const AppError = require('../utils/appError')

const addArtwork = async(artistId,title,imagePath)=>{
    let result
    if(title){
        result = await pool.query(
            `INSERT INTO gallerys (artist_id, title,image_path) VALUES ($1, $2,$3) RETURNING *`,
            [artistId,title,imagePath]
        )
    }else {
        result = await pool.query(
            `INSERT INTO gallerys (artist_id,image_path) VALUES ($1, $2) RETURNING *`,
            [artistId,imagePath]
        )
    }
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
            : 'Where '+ setvaraiable.join(' and ')
        }`
    )
    return result.rows || null
}

const getArtworkById = async(id)=>{
    const result = await pool.query(
        `select * from gallerys where id = ${id}`
    )
    if(!result.rows[0]){
        throw new AppError("Artwork not found",404)
    }
    return result.rows[0] 
}

const getArtworkPathByArtistId = async (artistId)=>{
    const result = await pool.query(
        `Select image_path from gallerys where artist_id = ${artistId}`
    )
    return result.rows || null
}

const editArtwork = async(artworkId,editData)=>{
    const result = await pool.query(
        `UPDATE gallerys
        SET ${editData.join(" , ")} ,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ${artworkId}
        RETURNING *`
    )
    return result.rows[0] || null
}

const deleteArtwork = async(artworkId)=>{
    const result = await pool.query(
        `delete from gallerys where id = $1 returning *`,
        [artworkId]
    )
    if(!result.rows[0]){
        throw new AppError("Artwork not found",404)
    }
    return result.rows[0]
}

module.exports = {
    addArtwork,
    getArtwork,
    getArtworkPathByArtistId,
    getArtworkById,
    editArtwork,
    deleteArtwork
}