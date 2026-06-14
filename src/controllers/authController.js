const authService = require('../services/authService')
const register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        //check field input
        if(!username || !email || !password || !confirmPassword){
            return res.status(400).json({ message: 'missing fields input' })
        }

        //check password and confirm password
        if(password !== confirmPassword){
            return res.status(400).json({ message: 'Password and confirm password do not match' })
        }

        const response = await authService.register(username,email,password)
        setCookie(res,response.refresh_token)
        res.status(201).json({message:"register success",data:{
                id:response.id,
                username:response.username,
                email: response.email,
                role: response.role,
                accessToken:response.access_token
            }})
    }
    catch (error) {
        if(error.status){
            res.status(error.status).json({message:"register failed",error:error.message})
        }
        res.status(500).json({message:"register failed",'error': error.message})
    }
}
// below later
const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ message: 'missing fields input' })
        }

        const response = await authService.login(email, password)
        setCookie(res,response.refresh_token)
        res.status(200).json({
            message:"login success",
            data:{
                id:response.id,
                username:response.username,
                email: response.email,
                role: response.role,
                accessToken:response.access_token
            }})
    }catch (error) {
        if(error.status === 401){
            return res.status(401).json({ message: error.message })
        }
        res.status(500).json({message:"login failed",error: error.message})
    }   
}
// read refreshtoken to get new accesstoken
const refresh = async(req,res)=>{
    try{
        const userData = req.userData
        const response = await authService.refresh(userData)
        setCookie(res,response.newRefreshToken)
        res.status(200).json({message:"refresh success",accessToken:response.newAccessToken})
    }catch(error) {  
        res.status(500).json({message:"refresh failed",error:error.message})
    }
}

//
const logout = async(req,res)=>{
    try{
        const userData = req.userData
        const response = await authService.logout(userData)
        res.clearCookie("refreshToken")
        res.status(200).json({message:"logout success",data:response})
    }catch(error) {
        res.status(500).json({message:"logout failed",error:error.message})
    }
}

const getme = async(req,res)=>{
    try{
        const userData = req.userData
        // const userData = await authService.getme(userData)
        res.status(200).json({message:"getme success",data:{
                id:userData.id,
                username:userData.username,
                email: userData.email,
                role: userData.role,
                createAt:userData.created_at,
                updateAt:userData.updated_at
            }})
    }catch(error){
        res.status(500).json({message:"getme failed",error:error.message})
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
    getme
}