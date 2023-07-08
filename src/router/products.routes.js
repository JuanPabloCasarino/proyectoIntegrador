import express from 'express';
import session from "express-session"
import {Router,query} from 'express';
import {
  getProducts,
  getProductsById,
  addProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products.controller.js'

const path = 'products';

const router = Router();

router.get(`/${path}`, getProducts);

router.get(`/${path}/:id`, getProductsById);

router.post(`/${path}`, addProduct);

router.put(`/${path}/:id`, updateProduct);

router.delete(`/${path}/:id`, deleteProduct);

export default router;