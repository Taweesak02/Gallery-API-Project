const userRepo = require('../repository/userRepo')
const artistService = require('../services/artistService')
const jwtService = require('./jwtService')
const blacklisttokenRepo = require('../repository/blackListTokenRepo')
const AppError = require('../errors/errorHandle')
const bcrypt = require('bcrypt')
const { deleteArtist } = require('../repository/artistRepo')

const register = async (username,email, password,confirmPassword)=>{

    // check field input
    if(!username || !email || !password || !confirmPassword){
        const missingfield = []
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
        throw new AppError('Missing fields input ' + missingfield.join(','),400)
    }

    //check confirm password
    if(password !== confirmPassword){
        throw new AppError('Password and confirmPassword do not matching',400)
    }

    //hashed password
    const hashedPassword = bcrypt.hashSync(password, 10)
    //add user into database
    const newUserData = await userRepo.addUser(username,email,hashedPassword)
    
    // genarate new token for user
    const result = await updateNewToken(newUserData)
    return  result

}

const updateNewToken = async (userData)=>{
    //new token
    const accessToken = jwtService.generateAccessToken(userData)
    const refreshToken = jwtService.generateRefreshToken(userData)

    const result = await userRepo.updateRefreshToken(userData.id,refreshToken)
    return {...result,access_token:accessToken}
}

const login = async (email, password) => {

    //check field
        if(!email || !password){
            const missingfield = []
            if(!email){
                missingfield.push('email')
            }
            if(!password){
                missingfield.push('password')
            }
            throw new AppError("Missing fields input " +  missingfield.join(','),400)
        }

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

    //blacklist old refresh token
    await blacklisttokenRepo.addBlackListToken(oldUserData.refresh_token)
    //create new token
    const result = await updateNewToken(oldUserData)
    return result
}

const refresh = async (userData)=>{
    //blacklist old refresh token
    await blacklisttokenRepo.addBlackListToken(userData.refresh_token)
    
    const result = await updateNewToken(userData)
    return result
}

const logout = async (userData)=>{
    //blacklist old one
    await blacklisttokenRepo.addBlackListToken(userData.refresh_token)
    //new refresh token
    const newRefreshToken = jwtService.generateRefreshToken(userData)
    //update new one
    await userRepo.updateRefreshToken(userData.id,newRefreshToken)
}

const deleteUser = async(userId,role,targetId=null)=>{

    //delete artist before delete user
    if(role === 'artist'){
        await artistService.deleteArtist(userId)
    }
    const deletedUserData = await userRepo.deleteUser(userId)
    return deletedUserData

}

const deleteUserById = async(userId,role,targetId)=>{
 
    if(!((targetId && role == 'admin') || targetId == userId)){
        throw new AppError("You are not allow to delete other user",401)
    }

    //delete artist before delete user
    if(role === 'artist'){
        await artistService.deleteArtist(targetId)
    }
    const deletedUserData = await userRepo.deleteUser(targetId)
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
    deleteUserById,
    updateUser
}