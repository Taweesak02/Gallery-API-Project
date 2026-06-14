const pool = require('../db/db')

const addUser = async (username,email,password)=>{
    const result =  await pool.query(
        `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`,
        [username, email, password]
    )
    return result.rows[0] || null
}

const updateRefreshToken = async (refresh_token,id)=>{
    const result = await pool.query(
         `UPDATE users SET refresh_token = $1 WHERE id = $2`,
        [refresh_token,id]
    )
}

const getData = async (id)=>{
    const result =  await pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [id]
    )
    return result.rows[0] || null
}

const findByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    )
    return result.rows[0] || null
}

const findByRefreshToken = async (refreshToken)=>{
    const result = await pool.query(
        `SELECT * FROM users WHERE refresh_token = $1`,
        [refreshToken]
    )
    return result.rows[0] || null
}

module.exports = {
    addUser,
    getData,
    updateRefreshToken,
    findByEmail,
    findByRefreshToken
}