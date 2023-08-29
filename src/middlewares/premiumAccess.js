import log from "../config/loggers/customLogger.js";
import {validateToken, decodeToken} from "../utils/validation.utils.js"
import { ProductServiceDB } from "../services/productServices.js";
const products = new ProductServiceDB()

const canDelete = async(req, res, next) => {
    //Tomo el producto con su respectivo owner
    const {id} = req.params;
    const product = await products.getProductById(id);
    const { owner } = product;
    //Tomo la info de quien esta haciendo el delete
    const token = await req.cookies.coderCookieToken
    if (!token) {
      return res.status(403).json({ error: 'Access denied. JWT must be provided' });
    }
    const decodedToken = await decodeToken(token)
    const {rol, email}= decodedToken;

  if(rol==="premium"){
    if(email===owner){
        log.info("Has podido borrar tu producto")
        next()
    }else{
        log.warn("No puedes borrar productos que no son tuyos")
        return res.status(403).json({ error: 'Can not delete not owned products' });
    }
  }else{
    next()
  }
}

const canAdd = async(req,res, next)=>{
    //Tomo el producto con su respectivo owner
    const {pid} = req.params;
    const product = await products.getProductById(pid);
    const { owner } = product;
    //Tomo la info de quien esta haciendo el delete
    const token = await req.cookies.coderCookieToken
    if (!token) {
      return res.status(403).json({ error: 'Access denied. JWT must be provided' });
    }
    const decodedToken = await decodeToken(token)
    const {rol, email}= decodedToken;
    
  if(rol==="premium"){
    if(email!==owner){
        log.info("Has podido agregar el producto al carrito")
        next()
    }else{
        log.warn("No puedes agregar productos que son tuyos")
        return res.status(403).json({ error: 'Can not add owned products' });
    }
  }else{
    next()
  }    
}

export {canDelete, canAdd}