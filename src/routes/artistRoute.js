const express = require('express')
const app = express.Router()
const artistController = require('../controllers/artistController')
const authCheck = require('../middlewares/tokenCheck')
const upload = require('../configs/multerConfig')

app.post('/register',authCheck.accessTokenCheck ,upload.single('image'),artistController.register)

app.delete('/delete',authCheck.accessTokenCheck,artistController.deleteArtist)

app.delete('/delete/:artistId',authCheck.accessTokenCheck,artistController.deleteArtistById)

app.patch('/update',authCheck.accessTokenCheck,upload.single('image'),artistController.updateArtist)

app.get('/',artistController.getProfile)

app.get('/:artistId',artistController.getProfileById)


module.exports = app