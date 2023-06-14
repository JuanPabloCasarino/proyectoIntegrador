import {fileURLToPath} from 'url';
import { dirname } from 'path';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { error } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, __dirname+'/public/uploads')
    },
    filename:function(req, file, cb){
        console.log(file);
        cb(null, Date.now() +'-'+ file.originalname);
    }
})

export const uploader = multer({storage,onError:function(err, next){
    console.log(err);
    next();
}})

const PRIVATE_KEY = 'CoderKeyQueFuncionaComoUnSecret';

const generateToken = (user)=>{
    const token = jwt.sign({user},PRIVATE_KEY,{expiresIn:'1min'})
    return token;
}

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).send({
        error: 'Not Authenticated'
    })
    const token = authHeader.split('')[1];
    jwt.verify(token,PRIVATE_KEY,(error,credentials)=>{
        if(error) res.status(403).send({error:"Not authorized"})
        req.user = credentials.user;
        next();
    })
}

export default __dirname;