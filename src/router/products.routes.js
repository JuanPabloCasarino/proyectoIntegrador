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
import passportConfig from '../config/passport.config.js';
import {isAdmin, isUser} from '../middlewares/sessionAccess.js';

const router = Router();

router.get(`/`, getProducts);

router.get(`/:id`, getProductsById);

router.post(`/`, isAdmin, addProduct);

router.put(`/:id`,isAdmin, updateProduct);

router.delete(`/:id`,isAdmin, deleteProduct);

export default router;