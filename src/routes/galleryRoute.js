const express = require('express')
const app = express.Router()
const galleryRoute = require('../controllers/galleryController')
const authCheck = require('../middlewares/tokenCheck')

//set upload file
const multer = require('multer')
const storage = multer.diskStorage({
    destination: "upload/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
})
const upload = multer({storage})

app.get('/',galleryRoute.getArtwork)
app.get('/:id',galleryRoute.getArtworkById)
app.use('/upload', express.static('upload'))
app.post('/add',authCheck.accessTokenCheck,upload.single('image'),galleryRoute.addArtwork)
app.patch('/edit/:id',authCheck.accessTokenCheck,upload.single('image'),galleryRoute.editArtwork)
app.delete('/remove/:id',authCheck.accessTokenCheck,galleryRoute.deleteArtwork)

module.exports = app