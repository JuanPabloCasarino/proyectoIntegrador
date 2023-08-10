import {CartServiceDB} from '../services/cartServices.js';
import {ProductServiceDB} from '../services/productServices.js';
import {TicketServiceDB} from '../services/ticketService.js';
import {userDto} from '../DTO/userDto.js';
import mongoosePaginate from 'mongoose-paginate-v2';
import express from 'express';
import nodemailer from 'nodemailer'
import transport from '../middlewares/mailing.js'; 
import log from '../config/loggers/customLogger.js';

const cartsService = new CartServiceDB();
const productService = new ProductServiceDB();
const ticketService = new TicketServiceDB();

const getAllCarts = async (req, res) => {
  try {
    const carts = await cartsService.getAllCarts();
    res.status(200).json(carts);
  } catch (error) {
    log.fatal(error);
  }
}
const getCartById = async (req, res) => {
  const {
    cid
  } = req.params;
  try {
    const cart = await cartsService.getCartById(cid);
    const quantity = await (cart.products.quantity);
    let resp;
    const allProducts = [];
    for (let i = 0; i < cart.products.length; i++) {
      resp = await productService.getProductById(cart.products[i].product);
      allProducts.push(resp);
      log.info(resp);
    }
    res.render('productsOnCart', resp)
  } catch (error) {
    log.fatal(error);
  }
}

const createCart = async (req, res) => {
  try {
    const carts = await cartsService.addCart();
    res.status(200).json(carts);
  } catch (error) {
    log.fatal(error);
  }
}

const addProductToCart = async (req, res) => {
  const {
    cid,
    pid
  } = req.params;

  try {
    const carts = await cartsService.addProductToCart(cid, pid);
    res.status(200).json(carts);
  } catch (error) {
    log.fatal(error);
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
    log.fatal(error);
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
    log.fatal(error);
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
    log.fatal(error);
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
    const cart = await cartsService.updateProductToCart(cid, pid, quantity);

    res.status(200).json(cart);
  } catch (error) {
    log.fatal(error);
  }
}
const confirmCart = async (req, res) => {
  const {
    cid
  } = req.params;
  try {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      const cart = await cartsService.getCartById(cid);
      let resp;
      let sum = 0;
      for (let i = 0; i < cart.products.length; i++) {
        resp = await productService.getProductById(cart.products[i].product)
      }
      const title = resp.title;
      const price = resp.price;
      res.render('confirm', {title,price,cid})
    }

  } catch (error) {
    log.error(error);
    res.status(500).json({error: error.message});
  }
}

const purchaseProduct = async (req, res) => {
  const cid = req.params.cid;
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    try {
      const userResponse = await userDto(req.session.user)
      const cart = await cartsService.getCartById(cid);
      if (!cart) {
        return res.status(404).json({
          message: 'Carrito no encontrado'
        });
      }
      let resp;
      let sum = 0;
      for (let i = 0; i < cart.products.length; i++) {
        resp = await productService.getProductById(cart.products[i].product)
        const quantity = await (cart.products[i].quantity);
        sum = sum + (resp.price * quantity);
        log.info(resp.title + ': ' + resp.price)
      }
      const newTicket = {
        amount: sum,
        purchaser: userResponse.email
      }
      const ticketResult = await ticketService.createTicket(newTicket)

      let result = await transport.sendMail({
        from: "juan21casarino@gmail.com",
        to: userResponse.email,
        subject: 'Ticket de compra:'+ticketResult.title,
        html: '<div><h1>Ticket de compra</h1></div><div><p>Gracias por confiar en nosotros! La suma total fue '+sum+'</p></div>',
        attachments:''
      })
      res.status(200).send('Compra finalizada exitosamente, el ticket es: ' + ticketResult);
    } catch (error) {
      log.error(error);
      res.status(500).json({
        message: 'Error en el servidor al procesar la compra'
      });
    }
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
  purchaseProduct,
  confirmCart
};