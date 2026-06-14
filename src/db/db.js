const {Pool} = require('pg')
require('dotenv').config()

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.POSTGRES_PORT || 5432,
    max: 10,              // max pool connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Failed to connect to DB:', err.message)
  } else {
    console.log('✅ Connected to PostgreSQL')
    release()
  }
})

module.exports = pool