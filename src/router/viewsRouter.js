import  express  from 'express';
import {Router} from 'express';

import ProductManager from "../productManager.js";
const productManager = new ProductManager('./products.json');


const router = Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}))


router.get('/', (req, res)=>{ 
    res.render('index',{});
  })

router.get('/home', (req, res)=>{
    const products = productManager.getProducts();
    res.render('home',{products});
  })

 router.get('/realtimeproducts', (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { products });
});
  
  

export default router;