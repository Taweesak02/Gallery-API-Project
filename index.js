const express = require('express')
const cookieParser = require('cookie-parser');
const app = express()
const initDB = require('./src/db/initdb')
const authRoute = require('./src/routes/authRoute')
const artistRoute = require('./src/routes/artistRoute')
const galleryRoute = require('./src/routes/galleryRoute')
require('dotenv').config()

const port = process.env.APP_PORT || 3000

async function start() {
  try {
      await initDB()
  }catch (err) {
      console.error('Failed to initialize database:', err)
      process.exit(1)
  }

}

start()

app.use(cookieParser())
app.use(express.json())

//route
app.use('/v1/auth', authRoute)
app.use('/v1/artist',artistRoute)
app.use('/v1/gallery',galleryRoute)
//default
app.get('/', (req, res) => {
  res.status(200).json({message:'Welcome to the Gallery API'})
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})