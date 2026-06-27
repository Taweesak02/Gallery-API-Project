const express = require('express')
const app = express.Router()
const authController = require('../controllers/authController')
const tokenCheck = require("../middlewares/tokenCheck")

app.post('/register', authController.register)

app.post('/login', authController.login)

app.post('/refresh',tokenCheck.refreshTokenCheck, authController.refresh)

app.post('/logout',tokenCheck.accessTokenCheck,authController.logout)

app.delete('/delete',tokenCheck.accessTokenCheck,authController.deleteUser)

app.delete('/delete/:userId',tokenCheck.accessTokenCheck,authController.deleteUserById)

app.get('/getme',tokenCheck.accessTokenCheck, authController.getme)

app.patch('/update/:id',tokenCheck.accessTokenCheck,authController.updateProfileById)

app.patch('/update',tokenCheck.accessTokenCheck,authController.updateProfile)

module.exports = app