import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import db from './db.js';

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
        productId: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
});

cartSchema.statics.createCart = async function (cart, req) {
    try {
        const newCart = new this(cart);
        const result = await newCart.save();
        return result;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

cartSchema.plugin(mongoosePaginate);
const cartsModel = db.model(cartsCollection, cartSchema);

export default cartsModel;
