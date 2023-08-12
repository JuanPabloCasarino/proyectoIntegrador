import express from 'express';
import session from "express-session"
import {Router,query} from 'express';
import {
  getProducts,
  getProductsById,
  addProduct,
  updateProduct,
  deleteProduct,
  mockingProducts
} from '../controllers/products.controller.js'
import passportConfig from '../config/passport.config.js';
import {isCapable, isUser} from '../middlewares/sessionAccess.js';
import isValid from '../middlewares/errors/prodValidation.js';

const router = Router();

router.get(`/`, getProducts);

router.get(`/:id`, getProductsById);

router.post(`/`, isValid, isCapable, addProduct);

router.put(`/:id`,isCapable, updateProduct);

router.delete(`/:id`,isCapable, deleteProduct);

router.get(`/mockingProducts`, mockingProducts); 

export default router;