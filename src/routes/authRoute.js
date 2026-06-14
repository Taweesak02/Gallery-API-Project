const express = require('express')
const app = express.Router()
const authController = require('../controllers/authController')
const tokenCheck = require("../middlewares/tokenCheck")

app.post('/login', authController.login)

app.post('/register', authController.register)

app.post('/refresh',tokenCheck.refreshTokenCheck, authController.refresh)

app.post('/logout',tokenCheck.refreshTokenCheck,authController.logout)

app.get('/getme',tokenCheck.accessTokenCheck, authController.getme)

module.exports = app