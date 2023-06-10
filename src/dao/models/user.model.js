import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';
import db from './db.js';

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true,
    },
    lastname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    rol: {
        type: String,
        required: false,
    }
})

const UserModel = db.model(usersCollection, userSchema);

export default UserModel;