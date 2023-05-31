import  express  from 'express';
import {Router} from 'express';
import productsCollection from '../models/products.js';
import { uploader } from "../utils.js";

const router = Router();

// router.get('/',(req,res)=>{
//     const { limit, page, sort, query } = req.query;

//     res.render('index',{})   
// })

router.get('/',async (req,res)=>{
    const { limit, sort, query } = req.query;
    let page = parseInt(req.query.page);
    if(!page) page=1;
    
    if(limit){
        let result = await productsCollection.paginate({},{page,limit:limit,lean:true})
        result.prevLink = result.hasPrevPage?`http://localhost:8080?page=${result.prevPage}`:'';
        result.nextLink = result.hasNextPage?`http://localhost:8080?page=${result.nextPage}`:'';
        result.isValid= !(page<=0||page>result.totalPages)
        res.render('products',result)
    }
    // } else if(sort){
    //     let sortOrders = await productsCollection.aggregate([
    //         {
    //         if (sort === desc){
    //             { $sort: { totalQuantity: -1}}
    //         } else {
    //             { $sort: { totalQuantity: 1}}
    //         }
    //     }
    //     ])}
     else {
    let result = await productsCollection.paginate({},{page,limit:10,lean:true})
    result.prevLink = result.hasPrevPage?`http://localhost:8080?page=${result.prevPage}`:'';
    result.nextLink = result.hasNextPage?`http://localhost:8080?page=${result.nextPage}`:'';
    result.isValid= !(page<=0||page>result.totalPages)
    res.render('products',result)
    }
})

router.use(express.json());
router.use(express.urlencoded({extended:true}))



export default router;