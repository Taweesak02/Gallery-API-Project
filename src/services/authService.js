const userRepo = require('../repository/userRepo')
const jwtService = require('./jwtService')
const blacklisttokenRepo = require('../repository/blackListTokenRepo')
const AppError = require('../errors/errorHandle')
const bcrypt = require('bcrypt')

const register = async (username,email, password)=>{
    const hashedPassword = bcrypt.hashSync(password, 10)
    // add user
    try{
        const userId = await userRepo.addUser(username,email,hashedPassword)

        const userDataNoToken = await userRepo.getData(userId.id)
        // genarate new token
        const accessToken = jwtService.generateAccessToken(userDataNoToken)
        const refreshToken = jwtService.generateRefreshToken(userDataNoToken)
        await userRepo.updateRefreshToken(refreshToken,userDataNoToken.id)
        //finish data
        const userData = await userRepo.getData(userDataNoToken.id)
        return {...userData,access_token:accessToken}
    }catch(error){
        throw new AppError("There are already have this user",409)
    }
}

const login = async (email, password) => {
    // checking if user exist in database
    const oldUserData = await userRepo.findByEmail(email)
    
    if(!oldUserData){
        throw {status: 401, message: 'Invalid email or password'}
    }
    // check matching password
    const isPasswordValid = bcrypt.compareSync(password, oldUserData.password)
    if(!isPasswordValid){
        throw {status: 401, message: 'Invalid email or password'}
    }
    //create new token
    const accessToken = jwtService.generateAccessToken(oldUserData)
    const refreshToken = jwtService.generateRefreshToken(oldUserData)
    await blacklisttokenRepo.addBlackListToken(oldUserData.refresh_token)
    await userRepo.updateRefreshToken(refreshToken,oldUserData.id)
    //get current userData
    const userData = await userRepo.getData(oldUserData.id)
   return {...userData,access_token:accessToken}
}

const refresh = async (userData)=>{
    await blacklisttokenRepo.addBlackListToken(userData.refresh_token)
    const newRefreshToken = jwtService.generateRefreshToken(userData)
    const newAccessToken = jwtService.generateAccessToken(userData)
    await userRepo.updateRefreshToken(newRefreshToken,userData.id)
    return {newAccessToken,newRefreshToken}
}

const logout = async (userData)=>{
    await blacklisttokenRepo.addBlackListToken(userData.refresh_token)
    //new token
    const newRefreshToken = jwtService.generateRefreshToken(userData)
    await userRepo.updateRefreshToken(newRefreshToken,userData.id)
}


module.exports = {
    register,
    login,
    refresh,
    logout
}