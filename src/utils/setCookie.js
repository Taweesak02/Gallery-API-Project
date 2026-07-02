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

module.exports = setCookie