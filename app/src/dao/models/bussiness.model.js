import mongoose from 'mongoose';
import db from './db.js';

const businessCollection = 'business';

const businessSchema = new mongoose.Schema({
    name: { type: String},
    products: {type: Array}
});

const business = db.model(businessCollection, businessSchema);

export default business;