const pool = require("../configs/dbConfig")

const addBlackListToken = async (refreshToken)=>{
    try{
        const time_expired = new Date(Date.now() + 60 * 60 * 1000); // Set expiration time (e.g., 1 hour)
        const result = await pool.query(
            `INSERT INTO blacklist_token (token,time_expired) VALUES ($1,$2) RETURNING id`,
            [refreshToken,time_expired]
        )
        return result.rows[0] || null
    }catch(error){
        throw new Error("Already have Token in BlackList",error)
    } 
}

module.exports = {
    addBlackListToken
}