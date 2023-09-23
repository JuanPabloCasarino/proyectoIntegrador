import business from '../dao/models/bussiness.model.js';
import MongoSingleton from '../config/db.connect.js';

class businessServicesDB {
    constructor() {
        const db = MongoSingleton.getInstance();
    }

    getAll = async () => await business.find();

    getBusinessById = async (id) => await business.findOne({_id: id});

    create = async (info) => await business.create(info);

    updateBusinessProduct = async (id, product) => business.updateOne({_id: id}, {$push: {products: product}});
}

export default businessServicesDB;