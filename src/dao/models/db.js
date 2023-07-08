import config from '../../config/config.js';
import mongoose from 'mongoose';

mongoose.connect(config.mongoUrl,{
    Name: 'integrador',
})

const db = mongoose.connection;

db.on('error',console.error.bind(console,'Error to connect to MongoDB'));
db.once('open', () =>{
    console.log('Connection successful to MongoDB'); 
})

export default db;
