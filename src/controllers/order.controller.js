import {orderServicesDB} from '../services/orderServices.js';
import userServicesDB from '../services/userServices.js';
import businessServicesDB from '../services/businesServices.js';
import log from '../config/loggers/customLogger.js';
import { error } from 'winston';

const order = new orderServicesDB();
const user = new userServicesDB();
const business = new businessServicesDB();

const getAllOrders = async (req, res) => {
    const result = await order.getAllOrders();
    res.status(200).send(result);
}

const getOrderById = async (req, res) => {
    const { id } = req.params;
    const result = await order.getOrderById(id);
    res.status(200).send(result);
}

const createOrder = async(req, res) => {
    const { userId, businessId, product} = req.body;

    const resultBusiness = await business.getBusinessById(businessId);

    try {
        let actualOrders = resultBusiness.products.filter( pr => product.includes(pr.id));
        log.debug(actualOrders)
        if(!actualOrders) {
            return res.status(400).send("Algun producto no corresponde!");
        }

        const sum = actualOrders.reduce( (acc, prev) => {
            acc += prev.price;
            return acc;
        }, 0);

        const orderNumber = Date.now() + Math.floor(Math.random() * 10000 + 1);

        let newOrder = {
            number: orderNumber,
            businessId,
            userId,
            status: "pending",
            products: actualOrders.map(pr => pr.id),
            totalPrice: sum
        };
        log.debug(newOrder);
        const orderResult = await order.createOrder(newOrder);

        await user.updateOrderByUserId(userId, orderResult._id);
        res.status(200).send({status: "Success", orderResult});
    } catch (error) {
        log.error("error - create Order", error);
        res.status(500).send("error al crear la orden");
    }
};

const resolveORder = async(req, res) => {
    try {
        const { resolve } = req.query;
        const { id } = req.params;

        await order.updateOrderById(id, resolve);
        res.status(200).send({status: "Success", result: "Order resolved"});
    } catch (error) {
        log.error("Error - resolve Order", error);
        res.status(500).send("Error al mandar la orden la orden");
    }
}

export {
    getAllOrders,
    getOrderById,
    createOrder,
    resolveORder
}