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

const router = Router();

router.get(`/`, getProducts);

router.get(`/:id`, getProductsById);

router.post(`/`, addProduct);

router.put(`/:id`, updateProduct);

router.delete(`/:id`, deleteProduct);

export default router;