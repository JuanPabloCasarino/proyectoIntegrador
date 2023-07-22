import express from 'express';
import session from "express-session"
import {Router,query} from 'express';
import {ProductServiceDB} from '../services/productServices.js';
import mongoosePaginate from 'mongoose-paginate-v2';

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
            const resProducts = await products.getAllProducts({status: status}, options);
            return res.json({resProducts});
        }

        if (category != undefined) {
            const resProducts = await products.getAllProducts({category: category}, options);
            return res.json({resProducts});
        }

        const result = await products.getAllProducts({}, options);

        result.prevLink = await result.hasPrevPage ? `http://localhost:8080/api/${path}?page=${result.prevPage}` : '';
        result.nextLink = await result.hasNextPage ? `http://localhost:8080/api/${path}?page=${result.nextPage}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages)
        res.render('products', result)
    } catch (error) {
        console.log(error);
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
        console.log(error);
    }
}
const addProduct = async (req, res) => {
    const body = req.body;
    try {
        const resProducts = await products.addProduct(body);
        res.status(200).json(resProducts);
    } catch (error) {
        console.log(error);
    }
}

const updateProduct = async (req, res) => {
    const {
        id
    } = req.params;
    const body = req.body;
    try {
        const resProducts = await products.updateProduct(id, body);
        res.status(200).json(resProducts);
    } catch (error) {
        console.log(error);
    }
}
const deleteProduct = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const resProduct = await products.deleteProduct(id);
        res.status(200).json(resProduct);
    } catch (error) {
        console.log(error);
    }
}

export {
    getProducts,
    getProductsById,
    addProduct,
    updateProduct,
    deleteProduct
}