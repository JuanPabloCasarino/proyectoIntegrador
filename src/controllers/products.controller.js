import express from 'express';
import session from "express-session"
import {Router,query} from 'express';
import {ProductServiceDB} from '../services/productServices.js';
import mongoosePaginate from 'mongoose-paginate-v2';
import {generateProducts} from '../middlewares/generateProduct.js';
import isValid from '../middlewares/errors/prodValidation.js';
import log from '../config/loggers/customLogger.js';
import { decodeToken } from '../utils/validation.utils.js';
import nodemailer from 'nodemailer'
import transport from '../middlewares/mailing.js';

const products = new ProductServiceDB();
const path = 'products';

const getProducts = async (req, res) => {
    const {
        limit,
        page,
        sort,
        category,
        status
    } = req.query;

    try {
        const options = {
            limit: limit || 10,
            page: page || 1,
            sort: {
                price: sort === 'asc' ? 1 : -1,
            },
            lean: true,
        };

        if (status != undefined) {
            const resProducts = await products.getAllProducts({
                status: status
            }, options);
            return res.json({
                resProducts
            });
        }

        if (category != undefined) {
            const resProducts = await products.getAllProducts({
                category: category
            }, options);
            return res.json({
                resProducts
            });
        }

        const result = await products.getAllProducts({}, options);

        result.prevLink = await result.hasPrevPage ? `http://localhost:8080/api/${path}?page=${result.prevPage}` : '';
        result.nextLink = await result.hasNextPage ? `http://localhost:8080/api/${path}?page=${result.nextPage}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages)
        res.render('products', result)
    } catch (error) {
        log.error(error);
        res.status(500).json({error:error.message});
    }
}

const getProductsById = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const result = await products.getProductById(id);
        res.render('singleProduct', result)
    } catch (error) {
        log.error(error);
        res.status(500).json({error:error.message});
    }
}
const addProduct = async (req, res) => {
    const body = req.body;
      //Destokenizo el token para tomar la info del usario de adentro
    const token = await req.cookies.coderCookieToken
    const decodedToken = await decodeToken(token)
    const {email, rol}= decodedToken;
    try {
        if(rol=== "premium"){      
            const resProducts = await products.addProduct(body, email);
            res.status(200).json(resProducts);         
    }else{
            const resProducts = await products.addProduct(body, "admin");
            res.status(200).json(resProducts);      
    }
    } catch (error) {
        log.error(error);
        res.status(500).json({error:error.message});
        
    }  
    
}

const updateProduct = async (req, res) => {
    const {id} = req.params;
    const body = req.body;
    try {
        const resProducts = await products.updateProduct(id, body);
        res.status(200).json(resProducts);
    } catch (error) {
        log.error(error);
        res.status(500).json({error:error.message});
    }
}
const deleteProduct = async (req, res) => {
    const token = await req.cookies.coderCookieToken
    const decodedToken = await decodeToken(token)
    const {rol, email}= decodedToken;
    const {id} = req.params;
    const prod = await products.getProductById(id)
     try {
        if(rol==="premium"){
            const resProduct = await products.deleteProduct(id);

            let result = await transport.sendMail({
                from: "juan21casarino@gmail.com",
                to: email,
                subject: 'Hemos eliminado tu producto: '+prod.title,
                html: '<div><h1>Eliminamos el producto con el ID: '+id+'</h1></div><div><p>Title: '+prod.title+'</p></div>',
                attachments:''
              })
            log.info("Has borrado correctamente tu producto y te hemos enviado un email")
            res.status(200).json(resProduct);
          }else{
            const resProduct = await products.deleteProduct(id);
            log.info("Has borrado correctamente tu producto")
            res.status(200).json(resProduct);
          }
        
    } catch (error) {
        log.error(error);
        res.status(500).json({error:error.message});
    }
}

const mockingProducts = async (req, res) => {
    try {
        let productsGen = []
        for(let i = 0; i < 50; i++){
            const resProducts = await products.addProduct(generateProducts())
            productsGen.push(resProducts)
        }
        res.status(200).json(productsGen);
    } catch (error) {
        log.error(error);
        res.status(500).json({error:error.message});
    }
}

export {
    getProducts,
    getProductsById,
    addProduct,
    updateProduct,
    deleteProduct,
    mockingProducts
}