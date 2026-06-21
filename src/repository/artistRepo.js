const pool = require('../configs/dbConfig')

const addArtist = async(userId,name)=>{
    try{
        const result = await pool.query(
            `INSERT INTO artists (user_id, name) VALUES ($1, $2) RETURNING *`,
            [userId,name]
        )
        return result.rows[0]
    }catch(error){
        return null
    }
}

const deleteArtist = async(id)=>{
    const result = await pool.query(
        `delete from artists where user_id = $1 returning *`,
        [id]
    )
    return result.rows[0]
}

const editArtist = async(id,editData)=>{

    const result = await pool.query(
        `UPDATE artists
        SET ${editData.join(",")}
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