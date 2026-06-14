const pool = require('../db/db')

const addArtist = async(userId,name)=>{
   
    const result = await pool.query(
        `INSERT INTO artists (user_id, name) VALUES ($1, $2) RETURNING *`,
        [userId,name]
    )
    return result.rows[0] || null
    
}

const deleteArtist = async(id)=>{
    const result = await pool.query(
        `delete from artists where user_id = $1 returning id`,
        [id]
    )
    return result.rows[0]
}

const editArtist = async(id,artistData)=>{
    let setvaraiable = []

    if(artistData.name !== undefined){
        setvaraiable.push(`name = '${artistData.name}'`)
    }
    if(artistData.sex !== undefined){
        setvaraiable.push(`sex = '${artistData.sex}'`)
    }
    if(artistData.birth_date !== undefined){
        setvaraiable.push(`birth_date = '${artistData.birth_date}'`)
    }
    if(artistData.nationality !== undefined){
        setvaraiable.push(`nationality = '${artistData.nationality}'`)
    }
    if(artistData.profile_image !== undefined){
        setvaraiable.push(`profile_image = '${artistData.profile_image}'`)
    }

    const result = await pool.query(
        `UPDATE artists
        SET ${setvaraiable.join(",")}
        WHERE user_id = ${id}  
        RETURNING *`,
    )
    return result.rows[0] || null
}

const findByID = async (id)=>{
    const result = await pool.query(
        `SELECT * FROM artists WHERE id = $1`,
        [id]
    )
    return result.rows[0] || null
}

const findByUserId = async (userId)=>{
    const result = await pool.query(
        `SELECT * FROM artists WHERE user_id = $1`,
        [userId]
    )
    return result.rows[0] || null
}

module.exports = {
    addArtist,
    findByID,
    findByUserId,
    editArtist,
    deleteArtist
}