const userRepo = require('../repository/userRepo')
const artistService = require('../services/artistService')
const jwtService = require('./jwtService')
const blacklisttokenRepo = require('../repository/blackListTokenRepo')
const AppError = require('../errors/errorHandle')
const bcrypt = require('bcrypt')
const { deleteArtist } = require('../repository/artistRepo')

const register = async (username,email, password,confirmPassword)=>{
    //check confirm password
    if(password !== confirmPassword){
        throw new AppError('Password and confirmPassword do not matching',400)
    }

    //add user into database
    const hashedPassword = bcrypt.hashSync(password, 10)
    const userDataNoToken = await userRepo.addUser(username,email,hashedPassword)
    if(!userDataNoToken){
        throw new AppError("There are already have this user",409)
    }
    
    // genarate new token for user
    const accessToken = jwtService.generateAccessToken(userDataNoToken)
    const refreshToken = jwtService.generateRefreshToken(userDataNoToken)
    const userData = await userRepo.updateRefreshToken(userDataNoToken.id,refreshToken)
 
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
    const userData = await userRepo.updateRefreshToken(oldUserData.id,refreshToken)
    
    return {...userData,access_token:accessToken}
}

const refresh = async (userData)=>{
    //blacklist old refresh token
    await blacklisttokenRepo.addBlackListToken(userData.refresh_token)

    //generate new one
    const refreshToken = jwtService.generateRefreshToken(userData)
    const accessToken = jwtService.generateAccessToken(userData)

    //update new one
    const newUserData = await userRepo.updateRefreshToken(userData.id,refreshToken)

    return {...newUserData,access_token:accessToken}
}

const logout = async (userData)=>{
    //blacklist old one
    await blacklisttokenRepo.addBlackListToken(userData.refresh_token)
    //new refresh token
    const newRefreshToken = jwtService.generateRefreshToken(userData)
    //update new one
    await userRepo.updateRefreshToken(userData.id,newRefreshToken)
}

const deleteUser = async(userData)=>{
    //delete artist before delete user
    await artistService.deleteArtist(userData)
    const deletedUserData = await userRepo.deleteUser(userData.id)
    return deletedUserData

}

const updateUser = async(userId,username,email,password)=>{
    // what data change
    const editData = []
    if(username){
        editData.push(`username = '${username}'`)
    }
    if(email){
        editData.push(`email = '${email}'`)
    }
    if(password){
        const hashedPassword = bcrypt.hashSync(password, 10)
        editData.push(`password = '${hashedPassword}'`)
    }
    const response =  await userRepo.updateData(userId,editData)
    if(!response){
        throw new AppError("New data is conflict in database",409)
    }
    return response
}

module.exports = {
    register,
    login,
    refresh,
    logout,
    deleteUser,
    updateUser
}