import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';
import db from './db.js';

const orderCollection = 'orders';

const orderSchema = new mongoose.Schema({
    number: { type: Number},
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'businesses'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    products: {type: Array},
    totalPrice: { type: Number},
    status: {type: String}
});

const order = db.model(orderCollection, orderSchema);

export default order;