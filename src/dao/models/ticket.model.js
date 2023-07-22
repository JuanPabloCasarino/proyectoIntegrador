import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';
import db from './db.js';
import { v4 as uuidv4 } from 'uuid';

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        default: uuidv4,
        unique: true
      },
      purchase_datetime: {
        type: Date,
        default: Date.now
      },
      amount: {
        type: Number,
        required: true
      },
      purchaser: {
        type: String,
        required: true
      },
});

const ticket = db.model(ticketCollection, ticketSchema);

export default ticket;