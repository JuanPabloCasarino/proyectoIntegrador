import {CartServiceDB} from '../services/cartServices.js';
import {ProductServiceDB} from '../services/productServices.js';
import mongoosePaginate from 'mongoose-paginate-v2';
import express from 'express';

const cartsService = new CartServiceDB();
const productService = new ProductServiceDB();

const getAllCarts = async (req, res) => {
  try {
    const carts = await cartsService.getAllCarts();
    console.log(carts)
    res.status(200).json(carts);
  } catch (error) {
    console.log(error);
  }
}
const getCartById = async (req, res) => {
  const {
    cid
  } = req.params;
  try {
    const cart = await cartsService.getCartById(cid);
    // console.log(JSON.stringify(cart, null, '\t'));
    console.log(JSON.stringify(cart.products, null, '\t'));
    res.render('productsOnCart', cart)
  } catch (error) {
    console.log(error);
  }
}

const createCart = async (req, res) => {
  try {
    const carts = await cartsService.addCart();
    res.status(200).json(carts);
  } catch (error) {
    console.log(error);
  }
}

const addProductToCart = async (req, res) => {
  const {cid,pid} = req.params;

  try {
    const carts = await cartsService.addProductToCart(cid, pid);
    res.status(200).json(carts);
  } catch (error) {
    console.log(error);
  }
}

const deleteProduct = async (req, res) => {
  const {
    cid,
    pid
  } = req.params;
  try {
    const cart = await cartsService.deleteProductToCart(cid, pid);

    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
  }
}

const deleteAllProducts = async (req, res) => {
  const {
    cid
  } = req.params;

  try {
    const cart = await cartsService.deleteAllProductsToCart(cid)
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
  }
}

const updateProduct = async (req, res) => {
  const {
    cid
  } = req.params;
  const products = req.body;

  try {
    const cart = await cartsService.updateCart(cid, products);
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
  }
}

const updateProductToCart = async (req, res) => {
  const {cid,pid} = req.params;
  const {quantity} = req.body
  try {
    const cart = await cartsService.updateProductToCart(cid, pid, quantity);

    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
  }
}
const purchaseProduct = async (req, res) => {
  const cartId = req.params.cid;

  try {
    // Buscar el carrito por su ID
    const cart = await cartsService.getCartById(cartId);
    console.log(cart.products);

    // Si el carrito no existe, enviar un error
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    /*
    for (const cartItem of cart.products) {
      const product = cartItem.product;
      const requestedQuantity = cartItem.quantity;

      // Verificar si hay suficiente stock del producto
      if (product.stock >= requestedQuantity) {
        // Restar la cantidad solicitada del stock del producto
        product.stock -= requestedQuantity;
        await product.save();
      } else {
        // Si no hay suficiente stock, no agregar el producto al proceso de compra
        return res.status(400).json({ message: `No hay suficiente stock para el producto: ${product.name}` });
      }
    }
    */  
    // Marcar el carrito como finalizado o eliminarlo, según tus necesidades
    cart.isPurchased = true;
    await cart.save();

    res.status(200).json({ message: 'Compra finalizada exitosamente' });
  } catch (error) {
    console.error('Error en la compra:', error);
    res.status(500).json({ message: 'Error en el servidor al procesar la compra' });
  }
}

export {
  getAllCarts,
  getCartById,
  createCart,
  addProductToCart,
  deleteProduct,
  deleteAllProducts,
  updateProduct,
  updateProductToCart,
  purchaseProduct
};