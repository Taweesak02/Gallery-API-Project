const express = require('express')
const app = express.Router()
const artistController = require('../controllers/artistController')
const authCheck = require('../middlewares/tokenCheck')
const upload = require('../configs/multerConfig')

app.post('/register',authCheck.accessTokenCheck ,upload.single('image'),artistController.register)

app.delete('/delete',authCheck.accessTokenCheck,artistController.deleteArtist)

app.patch('/edit',authCheck.accessTokenCheck,upload.single('image'),artistController.editArtist)

app.get('/:userId',artistController.getProfile)

module.exports = app