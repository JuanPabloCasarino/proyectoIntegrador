import { Schema, model } from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new Schema({
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
const ProductModel = model('product', productSchema);

export default ProductModel;
