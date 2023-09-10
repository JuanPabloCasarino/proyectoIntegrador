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
    },
    documents: {
      type: [
        {
          name: {
            type: String,
            required: false
          },
          reference:{
            type: String,
            required: false
          }
        },
      ],
      default: [],
      required: false
  },
  lastConnection:{
    type: Date,
    default: Date.now
  },
  status: {
    type: [
      {
        profile: {
          type: Boolean,
          default:false
        },
        product: {
          type: Boolean,
          default:false
        },
        doc: {
          type: Boolean,
          default:false
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