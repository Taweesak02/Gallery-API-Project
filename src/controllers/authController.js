const authService = require('../services/authService')
const {userWithAccessResponse,deleteUserResponse,fullUserResponse} = require('../models/userResponse')

const register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body

        // check field input
        if(!username || !email || !password || !confirmPassword){
            let missingfield = []
            if(!username){
                missingfield.push('username')
            }
            if(!email){
                missingfield.push('email')
            }
            if(!password){
                missingfield.push('password')
            }
            if(!confirmPassword){
                missingfield.push('confirmPassword')
            }
            return res.status(400).json({message:'Missing fields input ' + missingfield.join(',')})
        }

        const response = await authService.register(username,email,password,confirmPassword)
        setCookie(res,response.refresh_token)
        res.status(201).json({
            message:"Register success",
            data: userWithAccessResponse(response)
        })
    }
    catch (error) {
        res.status(error.status || 500).json({message:"Register failed",error: error.message})
    }
}

const login = async (req, res) => {
    try{
        const { email, password } = req.body

        //check field
        if(!email || !password){
            let missingfield = []
            if(!email){
                missingfield.push('email')
            }
            if(!password){
                missingfield.push('password')
            }
            return res.status(400).json({ message: 'Missing fields input' + missingfield.join(',')})
        }

        const response = await authService.login(email, password)
        setCookie(res,response.refresh_token)
        res.status(200).json({
            message:"Login success",
            data: userWithAccessResponse(response)
        })
    }catch (error) {
        res.status(error.status || 500).json({message:"Login failed",error: error.message})
    }   
}
// read refreshtoken to get new accesstoken
const refresh = async(req,res)=>{
    try{
        const userData = req.userData
        const response = await authService.refresh(userData)
        setCookie(res,response.refresh_token)
        res.status(200).json({
            message:"Refresh success",
            data: userWithAccessResponse(response)
        })
    }catch(error) {  
        res.status(error.status || 500).json({message:"Refresh failed",error:error.message})
    }
}

const logout = async(req,res)=>{
    try{
        const userData = req.userData
        const response = await authService.logout(userData)
        res.clearCookie("refreshToken")
        res.status(200).json({message:"Logout success"})
    }catch(error) {
        res.status(error.status || 500).json({message:"Logout failed",error:error.message})
    }
}

const deleteUser = async(req,res)=>{
    try{
        const userData = req.userData
        const response = await authService.deleteUser(userData)
        res.clearCookie("refreshToken")
        res.status(200).json({
            message:"Delete user success",
            data: deleteUserResponse(response)
        })
    }catch(error){
        res.status(error.status || 500).json({message:"Delete user failed",error:error.message})
    }
}

const getme = async(req,res)=>{
    try{
        const userData = req.userData
        res.status(200).json({
            message:"Getme success",
            data:fullUserResponse(userData)
        })
    }catch(error){
        res.status(error.status || 500).json({message:"Getme failed",error:error.message})
    }
}

const updateProfile = async(req,res)=>{
    try{
        const userData = req.userData
        const {username,email,password} = req.body
        const response = await authService.updateUser(userData.id,username,email,password)
        res.status(200).json({
            message:"Update profile success",
            data:fullUserResponse(response)
        })
    }catch(error){
        res.status(error.status || 500).json({message:"Update profile failed",error:error.message})
    }
}

//update other data for admin only or edit yourself id
const updateProfileById = async(req,res)=>{
    try{
        const userData = req.userData
        const targetId = req.params.id
        const {username,email,password} = req.body
       
        //checking is admin or is own id
        if(!((targetId && userData.role == 'admin') || targetId == userData.id)){
            return res.status(401).json({message:"Update profile failed",error:"You are not allow to update other user"})
        }
        
        const response = await authService.updateUser(targetId,username,email,password)
        res.status(200).json({
            message:"Update profile success",
            data:fullUserResponse(response)
        })
    }catch(error){
        res.status(error.status || 500).json({message:"Update profile failed",error:error.message})
    }
}

//set refresh cookie
const setCookie = (res,refreshToken)=>{
    res.cookie("refreshToken",refreshToken,
            {
                httpOnly: true, // Prevents client-side JS from accessing the cookie (XSS protection)
                secure: true,   // Only sent over HTTPS
                sameSite: 'lax' // Protects against CSRF attacks
            }
        )
}


module.exports = {
    register,
    login,
    refresh,
    logout,
    deleteUser,
    getme,
    updateProfile,
    updateProfileById
}