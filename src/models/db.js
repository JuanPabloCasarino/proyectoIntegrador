import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://juan21casarino:juan12345@ecommerce.lt4uvua.mongodb.net/?retryWrites=true&w=majority',{
    Name: 'integrador',
})

const db = mongoose.connection;

db.on('error',console.error.bind(console,'Error to connect to MongoDB'));
db.once('open', () =>{
    console.log('Connection successful to MongoDB'); 
})

export default db;