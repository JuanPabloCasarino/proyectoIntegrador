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
import {isAdmin, isUser} from '../middlewares/sessionAccess.js';
import isValid from '../middlewares/errors/prodValidation.js';

const router = Router();

router.get(`/`, getProducts);

router.get(`/:id`, getProductsById);

router.post(`/`, isValid, addProduct);

router.put(`/:id`,isAdmin, updateProduct);

router.delete(`/:id`,isAdmin, deleteProduct);

router.get(`/mockingProducts`, mockingProducts); 

export default router;