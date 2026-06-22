const express = require('express')
const app = express.Router()
const galleryRoute = require('../controllers/galleryController')
const authCheck = require('../middlewares/tokenCheck')
const upload = require('../configs/multerConfig')

app.use('/image', express.static('public/image'))

app.get('/',galleryRoute.getArtwork)

app.get('/:artworkId',galleryRoute.getArtworkById)

app.post('/add',authCheck.accessTokenCheck,upload.single('image'),galleryRoute.addArtwork)

app.patch('/edit/:artworkId',authCheck.accessTokenCheck,upload.single('image'),galleryRoute.editArtwork)

app.delete('/remove/:artworkId',authCheck.accessTokenCheck,galleryRoute.deleteArtwork)

module.exports = app