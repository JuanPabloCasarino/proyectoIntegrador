import config from '../../config/config.js';
import mongoose from 'mongoose';
import log from '../../config/loggers/customLogger.js';

mongoose.connect(config.mongoUrl,{
    Name: 'integrador',
})

const db = mongoose.connection;

db.on('error',console.error.bind(console,'Error to connect to MongoDB'));
db.once('open', () =>{
    log.info('Connection successful to MongoDB'); 
})

export default db;
