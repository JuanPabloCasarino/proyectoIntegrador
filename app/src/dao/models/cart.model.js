import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import db from './db.js';

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products"
        },
        quantity: Number
      },
    ],
    default: []

  },
});

cartSchema.pre("find", function () {
  this.populate("products.product")
})

const CartModel = db.model(cartsCollection, cartSchema);

export default CartModel;
