const userWithAccessResponse = (userData)=>(
    {
        id: userData.id,
        role: userData.role,
        accessToken: userData.access_token
    }
)

const fullUserResponse = (userData)=>(
    {
        id:userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
    }
)

const deleteUserResponse = (userData)=>(
    {
        id:userData.id,
        username:userData.username,
        email: userData.email,
        role: userData.role
    }
)

module.exports = {
    userWithAccessResponse,
    deleteUserResponse,
    fullUserResponse
}