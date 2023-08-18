import {Router} from 'express';
import express from 'express';
import {
  getAllCarts,
  getCartById,
  createCart,
  addProductToCart,
  deleteProduct,
  deleteAllProducts,
  updateProduct,
  updateProductToCart,
  purchaseProduct, 
  confirmCart
} from '../controllers/carts.controller.js';
import {isCapable} from '../middlewares/sessionAccess.js';
import { canAdd } from '../middlewares/premiumAccess.js';

const router = Router();

//Obtengo todos los carritos
router.get(`/`, getAllCarts );

//Muestro los productos de un carrito por su ID
router.get(`/:cid`, getCartById);

//Creo un nuevo carrito vacio
router.post(`/`, createCart);

//Agrego un producto a un carrito
router.post(`/:cid/products/:pid`,canAdd, addProductToCart);

// Eliminamos un producto del carrito
router.delete(`/:cid/products/:pid`, deleteProduct);

// Eliminamos todos los productos del carrito
router.delete(`/:cid`, deleteAllProducts);

//Actualizo el carrito con un producto
router.put(`/:cid`, updateProduct);

// Actualizo un producto de un carrito
router.put(`/:cid/products/:pid`, updateProductToCart);

router.get(`/:cid/purchase`, confirmCart);

router.post(`/:cid/purchase`, purchaseProduct);

export default router;