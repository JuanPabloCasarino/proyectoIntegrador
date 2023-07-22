import users from '../dao/models/user.model.js';
import MongoSingleton from '../config/db.connect.js';

class userServicesDB {
    constructor() {
        const db = MongoSingleton.getInstance();
    }

    getAll = async () => await users.find();

    getUserByID = async(id) => await users.findOne({_id: id});

    create = async (info) => await users.create(info);

    updateUserById = async (id, info) => await users.updateOne({_id: id}, {$set: info});

    updateOrderByUserId = async (id, orderId) => await users.updateOne({_id: id}, {$push: {orders: orderId}});
}

export default userServicesDB