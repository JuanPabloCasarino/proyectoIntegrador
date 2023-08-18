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

    getUserByEmail = async(email) => await users.findOne({email: email});

    updateUserById = async (id, info) => await users.updateOne({_id: id}, {$set: info});

    updatePasswordByEmail = async (email, hashedPassword) => await users.updateOne({email: email}, {$set: {password: hashedPassword}});
    
    changeRol = async (uid)=>{
        const user = this.getUserByID(uid)
        const {firstname, lastname, email, age, password, rol, carts}= user;
        
        if(rol==="premium"){
            const newRol = {
                ...user,
                rol: user
            }
            await users.updateOne({_id: id}, {$set: newRol});
        }else if(rol==="user"){
            const newRol = {
                ...user,
                rol: premium
            }
            await users.updateOne({_id: id}, {$set: newRol});
        }

    } 

    updateOrderByUserId = async (id, orderId) => await users.updateOne({_id: id}, {$push: {orders: orderId}});
}

export default userServicesDB