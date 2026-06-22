const userWithAccessResponse = (userData)=>(
    {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        accessToken: userData.access_token
    }
)

const fullUserResponse = (userData)=>({
    id:userData.id,
    username:userData.username,
    email: userData.email,
    role: userData.role,
    createAt:userData.created_at,
    updateAt:userData.updated_at
})

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