import multer from "multer";
import { __dirname } from "../utils.js";

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        const uid = req.params.uid
        cb(null,__dirname+'/upload/documents')
    },
    filename: function(req,file,cb){
        const uid = req.params.uid
        cb(null,file.originalname,': ',uid)
    }
})

const uploader = multer({storage})

export {uploader}