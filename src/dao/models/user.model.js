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
    },
    carts: {
        type: [
          {
            cart: {
              type: Schema.Types.ObjectId,
              ref: "carts"
            }
          },
        ],
        default: [],
        required: false
    },
    orders: {
        type: [
          {
            cart: {
              type: Schema.Types.ObjectId,
              ref: "orders"
            }
          },
        ],
        default: [],
        required: false
    }
})
userSchema.pre("find", function () {
    this.populate("carts.cart")
  })
  

const UserModel = db.model(usersCollection, userSchema);

export default UserModel;