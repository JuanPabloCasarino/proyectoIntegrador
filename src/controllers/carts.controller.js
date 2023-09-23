import {CartServiceDB} from '../services/cartServices.js';
import {ProductServiceDB} from '../services/productServices.js';
import {TicketServiceDB} from '../services/ticketService.js';
import {userDto} from '../DTO/userDto.js';
import mongoosePaginate from 'mongoose-paginate-v2';
import express from 'express';
import nodemailer from 'nodemailer'
import transport from '../middlewares/mailing.js'; 
import log from '../config/loggers/customLogger.js';
import { decodeToken } from '../utils/validation.utils.js';

const cartsService = new CartServiceDB();
const productService = new ProductServiceDB();
const ticketService = new TicketServiceDB();

const getAllCarts = async (req, res) => {
  try {
    const carts = await cartsService.getAllCarts();
    res.status(200).json(carts);
  } catch (error) {
    log.error(error);
    res.status(400).send(error.message);
  }
}
const getCartById = async (req, res) => {
  const {cid} = req.params;
  try {
    const cart = await cartsService.getCartById(cid);
    
    res.status(200).json(cart);
  } catch (error) {
    log.error(error);
    res.status(400).send(error.message);
  }
}

const createCart = async (req, res) => {
  try {
    const carts = await cartsService.addCart();
    res.status(200).json(carts);
  } catch (error) {
    log.error(error);
    res.status(400).send(error.message);
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
    log.error(error);
    res.status(400).send(error.message);
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
    log.error(error);
    res.status(400).send(error.message);
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
    log.error(error);
    res.status(400).send(error.message);
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
    log.error(error);
    res.status(400).send(error.message);
  }
}

//Vista para saber que carrito voy a comprar
const confirmCart = async (req, res) => {
  const {cid} = req.params;
  try {
    const cart = await cartsService.getCartById(cid);
    
    res.status(200).json(cart);
  } catch (error) {
    log.error(error);
    res.status(400).send(error.message);
  }
}


//Posteo para confirmar la compra del carrito
const purchaseProduct = async (req, res) => {
  const {cid} = req.params;
    try {
      //Consigo info del user
      const token = await req.cookies.coderCookieToken
      const decodedToken = await decodeToken(token)
      const {rol, email}= decodedToken;
    
      //Armo la info del carrito
      const cart = await cartsService.getCartById(cid);
      if (!cart) {
        return res.status(404).json({
          message: 'Carrito no encontrado'
        });
      }
      const prods = []
      let resp;
      let sum = 0;
      for (let i = 0; i < cart.products.length; i++) {
        resp = await productService.getProductById(cart.products[i].product)
        const quantity = await (cart.products[i].quantity);
        sum = sum + (resp.price * quantity);
        prods.push(' '+resp.title)
        log.info("Prod NRO°"+(i+1)+" "+resp.title + ': ' + resp.price)
      }
      const newTicket = {
        amount: sum,
        purchaser: email
      }
      const ticketResult = await ticketService.createTicket(newTicket)

      let result = await transport.sendMail({
        from: "juan21casarino@gmail.com",
        to: email,
        subject: 'Ticket de compra: '+ticketResult._id,
        html: '<div><h1>Ticket de compra</h1></div><div><p>Gracias por confiar en nosotros! La suma total fue '+sum+'</p></div><div><p>Los productos comprados fueron los siguientes:'+prods+'</p></div>',
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

export {
  getAllCarts,
  getCartById,
  createCart,
  addProductToCart,
  deleteProduct,
  deleteAllProducts,
  updateProduct,
  purchaseProduct,
  confirmCart
};