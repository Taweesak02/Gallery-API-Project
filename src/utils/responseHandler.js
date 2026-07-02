const responseHandler = (res,statusCode,path,data)=>{
    res.status(statusCode).json({
        status:statusCode,
        path: path,
        response: data
    })
}

module.exports = responseHandler