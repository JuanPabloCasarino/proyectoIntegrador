import { Router } from 'express';
import { CartManagerDB } from '../dao/managers/DB/CartManager.db.js';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartsManager = new CartManagerDB();
const path = 'carts';

const router = Router();

//Obtengo todos los carritos
router.get(`/${path}`, async (req, res) => {
  try {
    const carts = await cartsManager.getAllCarts();
    res.status(200).json(carts);
  } catch (error) {
    console.log(error);
  }
});

//Muestro los productos de un carrito por su ID
router.get(`/${path}/:cid`, async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartsManager.getCartById(cid);
    console.log(JSON.stringify(cart,null, '\t'));
    console.log(JSON.stringify(cart.products,null, '\t'));
    res.render('productsOnCart',cart)
  } catch (error) {
    console.log(error);
  }
});

//Creo un nuevo carrito vacio
router.post(`/${path}`, async (req, res) => {
  try {
    const carts = await cartsManager.addCart();
    res.status(200).json(carts);
  } catch (error) {
    console.log(error);
  }
});

//Agrego un producto a un carrito
router.post(`/${path}/:cid/products/:pid`, async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const carts = await cartsManager.addProductToCart(cid, pid);
    res.status(200).json(carts);
  } catch (error) {
    console.log(error);
  }
});

// Eliminamos un producto del carrito
router.delete(`/${path}/:cid/products/:pid`, async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartsManager.deleteProductToCart(cid, pid);

    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
  }
});

// Eliminamos todos los productos del carrito
router.delete(`/${path}/:cid`, async (req, res) => {
  const { cid } = req.params;
  
  try {
    const cart = await cartsManager.deleteAllProductsToCart(cid)
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
  }
});

//Actualizo el carrito con un producto
router.put(`/${path}/:cid`, async (req, res) => {
  const { cid } = req.params;
  const products = req.body;

  try {
    const cart = await cartsManager.updateCart(cid, products);
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
  }
});

router.put(`/${path}/:cid/products/:pid`, async (req, res) => {
  const { cid, pid } = req.params;
  const {quantity} = req.body
  try {
    const cart = await cartsManager.updateProductToCart(cid, pid, quantity);

    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
  }
});

export default router;
