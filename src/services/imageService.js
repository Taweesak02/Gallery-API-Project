const fs = require('fs').promises

const deleteImages = async(imagePaths = [])=>{
    for(path of imagePaths){
        await fs.unlink("public"+path)
    }
}

module.exports = {deleteImages}