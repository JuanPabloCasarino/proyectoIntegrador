import express from 'express';
import session from "express-session"
import { Router} from 'express';
import productsCollection from '../models/products.js';
import {uploader} from "../utils.js";

const router = Router();

router.get('/', async (req, res) => {
    const {limit,sort,query} = req.query;
    let page = parseInt(req.query.page);
    if (!page) page = 1;


    //Confirmo si me pide el limite y si es asi lo actualizo
    if (limit) {
        let result = await productsCollection.paginate({}, {
            page,
            limit: limit,
            lean: true
        })
        result.prevLink = result.hasPrevPage ? `http://localhost:8080?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:8080?page=${result.nextPage}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages)
        res.render('products', result)
    } else if (sort) {
        if (sort === "desc") {
            let result = await productsCollection.paginate({}, {
                page,
                limit: 10,
                lean: true,
                sort: {price: -1}
            })
            result.prevLink = result.hasPrevPage ? `http://localhost:8080?page=${result.prevPage}` : '';
            result.nextLink = result.hasNextPage ? `http://localhost:8080?page=${result.nextPage}` : '';
            result.isValid = !(page <= 0 || page > result.totalPages)
            res.render('products', result)
        } 
        else if(sort==="asc"){
            let result = await productsCollection.paginate({}, {
                page,
                limit: 10,
                lean: true,
                sort: {price: 1}
            })
            result.prevLink = result.hasPrevPage ? `http://localhost:8080?page=${result.prevPage}` : '';
            result.nextLink = result.hasNextPage ? `http://localhost:8080?page=${result.nextPage}` : '';
            result.isValid = !(page <= 0 || page > result.totalPages)
            res.render('products', result)
        }
    } //Si hay una categoria ingresada lo separo por categorias 
    else if(query){
        let result = await productsCollection.paginate({category:query}, {
            page,
            limit: 10,
            lean: true
        })
        result.prevLink = result.hasPrevPage ? `http://localhost:8080?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:8080?page=${result.nextPage}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages)
        res.render('products', result)
    } else {
        let result = await productsCollection.paginate({}, {
            page,
            limit: 10,
            lean: true
        })
        result.prevLink = result.hasPrevPage ? `http://localhost:8080?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:8080?page=${result.nextPage}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages)
        res.render('products', result)
     }
})

router.use(express.json());
router.use(express.urlencoded({extended: true}))



export default router;