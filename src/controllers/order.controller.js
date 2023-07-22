import {orderServicesDB} from '../services/orderServices.js';
import userServicesDB from '../services/userServices.js';
import businessServicesDB from '../services/businesServices.js';

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
        console.log(actualOrders)
        if(!actualOrders) {
            return res.status(400).send("Algun producto no corresponde!");
        }

        const sum = actualOrders.reduce( (acc, prev) => {
            acc += prev.price;
            return acc;
        }, 0);

        const orderNumber = Date.now() + Math.floor(Math.random() * 10000 + 1);

        let newOrder = {
            nombre: orderNumber,
            businessId,
            userId,
            status: "pending",
            products: actualOrders.map(pr => pr.id),
            totalPrice: sum
        };

        console.log(newOrder);
        const orderResult = await order.createOrder(newOrder);

        await user.updateOrderByUserId(userId, orderResult.id);
        res.status(200).send({status: "Success", orderResult});
    } catch (e) {
        console.log("error - create Order", e);
        res.status(500).send("error al crear la orden");
    }
};

const resolveORder = async(req, res) => {
    try {
        const { resolve } = req.query;
        const { id } = req.params;

        await order.updateOrderById(id, resolve);
        res.status(200).send({status: "Success", result: "Order resolved"});
    } catch (e) {
        console.log("Error - resolve Order");
        res.status(500).send("Error al actualizar la orden");
    }
}

export {
    getAllOrders,
    getOrderById,
    createOrder,
    resolveORder
}