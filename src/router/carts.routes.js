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
  purchaseProduct
} from '../controllers/carts.controller.js';
import {isAdmin, isUser} from '../middlewares/sessionAccess.js';

const router = Router();

//Obtengo todos los carritos
router.get(`/`, getAllCarts );

//Muestro los productos de un carrito por su ID
router.get(`/:cid`, getCartById);

//Creo un nuevo carrito vacio
router.post(`/`, createCart);

//Agrego un producto a un carrito
router.post(`/:cid/products/:pid`, isUser, addProductToCart);

// Eliminamos un producto del carrito
router.delete(`/:cid/products/:pid`, deleteProduct);

// Eliminamos todos los productos del carrito
router.delete(`/:cid`, deleteAllProducts);

//Actualizo el carrito con un producto
router.put(`/:cid`, updateProduct);

// Actualizo un producto de un carrito
router.put(`/:cid/products/:pid`, updateProductToCart);

router.post(`/:cid/purchase`, purchaseProduct);

export default router;