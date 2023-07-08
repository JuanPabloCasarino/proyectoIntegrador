import {
  CartManagerDB
} from '../dao/managers/DB/CartManager.db.js';
import mongoosePaginate from 'mongoose-paginate-v2';
import express from 'express';

const cartsManager = new CartManagerDB();

const getAllCarts = async (req, res) => {
  try {
    const carts = await cartsManager.getAllCarts();
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
    const cart = await cartsManager.getCartById(cid);
    console.log(JSON.stringify(cart, null, '\t'));
    console.log(JSON.stringify(cart.products, null, '\t'));
    res.render('productsOnCart', cart)
  } catch (error) {
    console.log(error);
  }
}

const createCart = async (req, res) => {
  try {
    const carts = await cartsManager.addCart();
    res.status(200).json(carts);
  } catch (error) {
    console.log(error);
  }
}

const addProducTtoCart = async (req, res) => {
  const {
    cid,
    pid
  } = req.params;

  try {
    const carts = await cartsManager.addProductToCart(cid, pid);
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
    const cart = await cartsManager.deleteProductToCart(cid, pid);

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
    const cart = await cartsManager.deleteAllProductsToCart(cid)
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
    const cart = await cartsManager.updateCart(cid, products);
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
  }
}

const updateProductToCart = async (req, res) => {
  const {
    cid,
    pid
  } = req.params;
  const {
    quantity
  } = req.body
  try {
    const cart = await cartsManager.updateProductToCart(cid, pid, quantity);

    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
  }
}

export {
  getAllCarts,
  getCartById,
  createCart,
  addProducTtoCart,
  deleteProduct,
  deleteAllProducts,
  updateProduct,
  updateProductToCart
};