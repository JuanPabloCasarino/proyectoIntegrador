import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import db from './db.js';

const productsCollection = 'products';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    code :{
        type: String,
        required:true,
    },
    stock :{
        type : Number,
        required:true,
    }

});

productSchema.statics.createProduct = async function (product, req) {
    try {
        const newProduct = new this(product);
        const result = await newProduct.save();
        return result;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

productSchema.plugin(mongoosePaginate);
const productsModel = db.model(productsCollection, productSchema);

export default productsModel;