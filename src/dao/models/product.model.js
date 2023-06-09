import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2"

import db from './db.js';

const productsCollection = 'products';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: false,
  },
  status: Boolean,
  stock: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

productSchema.plugin(mongoosePaginate);
const ProductModel = db.model(productsCollection, productSchema);

export default ProductModel;
