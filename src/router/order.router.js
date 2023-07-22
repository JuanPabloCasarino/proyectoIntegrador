import express from 'express';
import { getAllOrders, getOrderById, createOrder, resolveORder} from '../controllers/order.controller.js';
const orderRouter = express.Router();


orderRouter.get('/', getAllOrders);

orderRouter.get('/:id', getOrderById);

orderRouter.post('/', createOrder);

orderRouter.put('/resolveOrder/:id', resolveORder);

export default orderRouter