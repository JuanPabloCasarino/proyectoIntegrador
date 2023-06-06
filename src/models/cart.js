import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import db from './db.js';

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
  products: {
    type: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
      }
    }],
    default: []
  }
});

cartSchema.pre('find',function(){
  this.populate('products.product');
})


const cartsModel = db.model(cartsCollection, cartSchema);

export default cartsModel;