import {Router} from 'express';
import mongoosePaginate from 'mongoose-paginate-v2';
import express from 'express';
import {
  getAllCarts,
  getCartById,
  createCart,
  addProductToCart,
  deleteProduct,
  deleteAllProducts,
  updateProduct,
  updateProductToCart
} from '../controllers/carts.controller.js';

const path = 'carts';

const router = Router();

//Obtengo todos los carritos
router.get(`/${path}`, getAllCarts);

//Muestro los productos de un carrito por su ID
router.get(`/${path}/:cid`, getCartById);

//Creo un nuevo carrito vacio
router.post(`/${path}`, createCart);

//Agrego un producto a un carrito
router.post(`/${path}/:cid/products/:pid`, addProductToCart);

// Eliminamos un producto del carrito
router.delete(`/${path}/:cid/products/:pid`, deleteProduct);

// Eliminamos todos los productos del carrito
router.delete(`/${path}/:cid`, deleteAllProducts);

//Actualizo el carrito con un producto
router.put(`/${path}/:cid`, updateProduct);

router.put(`/${path}/:cid/products/:pid`, updateProductToCart);

export default router;