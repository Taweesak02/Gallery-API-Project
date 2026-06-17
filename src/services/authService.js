const userRepo = require('../repository/userRepo')
const jwtService = require('./jwtService')
const blacklisttokenRepo = require('../repository/blackListTokenRepo')
const AppError = require('../errors/errorHandle')
const bcrypt = require('bcrypt')

const register = async (username,email, password)=>{
    
    // add user
    const hashedPassword = bcrypt.hashSync(password, 10)
    const userDataNoToken = await userRepo.addUser(username,email,hashedPassword)
    if(!userDataNoToken){
        throw new AppError("There are already have this user",409)
    }
    
    // genarate new token
    const accessToken = jwtService.generateAccessToken(userDataNoToken)
    const refreshToken = jwtService.generateRefreshToken(userDataNoToken)
    const userData = await userRepo.updateRefreshToken(refreshToken,userDataNoToken.id)
 
    return {...userData,access_token:accessToken}

}

const login = async (email, password) => {

    // checking if user exist in database
    const oldUserData = await userRepo.findByEmail(email)
    
    if(!oldUserData){
        throw new AppError("Invalid email or password",401)
    }
    // check matching password
    const isPasswordValid = bcrypt.compareSync(password, oldUserData.password)
    if(!isPasswordValid){
         throw new AppError("Invalid email or password",401)
    }
    //create new token
    const accessToken = jwtService.generateAccessToken(oldUserData)
    const refreshToken = jwtService.generateRefreshToken(oldUserData)
    await blacklisttokenRepo.addBlackListToken(oldUserData.refresh_token)
    const userData = await userRepo.updateRefreshToken(refreshToken,oldUserData.id)
    
   return {...userData,access_token:accessToken}
}

const refresh = async (userData)=>{
    await blacklisttokenRepo.addBlackListToken(userData.refresh_token)
    const refreshToken = jwtService.generateRefreshToken(userData)
    const accessToken = jwtService.generateAccessToken(userData)
    const newUserData = await userRepo.updateRefreshToken(refreshToken,userData.id)
    return {...newUserData,access_token:accessToken}
}

const logout = async (userData)=>{
    await blacklisttokenRepo.addBlackListToken(userData.refresh_token)
    //new token
    const newRefreshToken = jwtService.generateRefreshToken(userData)
    await userRepo.updateRefreshToken(newRefreshToken,userData.id)
}

const deleteUser = async(userData)=>{
    const deletedUserData = await userRepo.deleteUser(userData.id)
    return deletedUserData

}

module.exports = {
    register,
    login,
    refresh,
    logout,
    deleteUser
}