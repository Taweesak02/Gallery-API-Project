const express = require('express')
const app = express.Router()
const galleryRoute = require('../controllers/galleryController')
const authCheck = require('../middlewares/tokenCheck')

//set upload file
const multer = require('multer')
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
})
const upload = multer({storage})

app.use(authCheck.accessTokenCheck)

app.get('/',galleryRoute.getArtwork)
app.get('/:id',galleryRoute.getArtworkById)
app.use('/image', express.static('uploads'))
app.post('/add',upload.single('image'),galleryRoute.addArtwork)
app.patch('/edit/:id',upload.single('image'),galleryRoute.editArtwork)
app.delete('/remove/:id',galleryRoute.deleteArtwork)



module.exports = app