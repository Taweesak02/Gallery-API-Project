const authService = require('../services/authService')
const asyncHandler = require('../middlewares/asyncHandler')
const {userWithAccessResponse,deleteUserResponse,fullUserResponse} = require('../models/userResponse')
const setCookie = require('../utils/setCookie')
const responseHandler = require('../utils/responseHandler')

const register = asyncHandler(async (req, res) => {
    const { username, email, password, confirmPassword } = req.body
    const response = await authService.register(username,email,password,confirmPassword)
    setCookie(res,response.refresh_token)
    responseHandler(res,201,req.originalUrl,userWithAccessResponse(response))
})

const login = asyncHandler (async(req,res) => {
    const { email, password } = req.body
    const response = await authService.login(email, password)
    setCookie(res,response.refresh_token)
    responseHandler(res,200,req.originalUrl,userWithAccessResponse(response))
})

// read refreshtoken to get new accesstoken
const refresh = asyncHandler( async(req,res)=>{
    const userData = req.userData
    const response = await authService.refresh(userData)
    setCookie(res,response.refresh_token)
    responseHandler(res,200,req.originalUrl,userWithAccessResponse(response))
})

const logout = asyncHandler(async(req,res)=>{
    const userData = req.userData
    const response = await authService.logout(userData)
    res.clearCookie("refreshToken")
    responseHandler(res,200,req.originalUrl,"logout success")

})

const deleteUser = asyncHandler(async(req,res)=>{
    const userId = req.userData.id
    const role = req.userData.role
    const response = await authService.deleteUser(userId,role)

    res.clearCookie("refreshToken")
    responseHandler(res,200,req.originalUrl, deleteUserResponse(response))
})

const deleteUserById = asyncHandler(async(req,res)=>{
    const userId = req.userData.id
    const role = req.userData.role
    const targetId = req.params.userId
    const response = await authService.deleteUserById(userId,role,targetId)

    responseHandler(res,200,req.originalUrl, deleteUserResponse(response))
})

const getme = asyncHandler(async(req,res)=>{
    const userData = req.userData
 
    responseHandler(res,200,req.originalUrl, fullUserResponse(userData))
})

const updateProfile = asyncHandler(async(req,res)=>{

    const userData = req.userData
    const {username,email,password} = req.body
    const response = await authService.updateUser(userData,username,email,password)
    responseHandler(res,200,req.originalUrl, fullUserResponse(response))
})

//update other data for admin only or edit yourself id
const updateProfileById = asyncHandler(async(req,res)=>{
    const userData = req.userData
    const targetId = req.params.userId
    const {username,email,password} = req.body
    const response = await authService.updateUser(userData,username,email,password,targetId)
    responseHandler(res,200,req.originalUrl, fullUserResponse(response))
    
})

module.exports = {
    register,
    login,
    refresh,
    logout,
    deleteUser,
    deleteUserById,
    getme,
    updateProfile,
    updateProfileById
}