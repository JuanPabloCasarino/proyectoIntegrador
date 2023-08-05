//IMPORTO LIBRERIAS 
import express from 'express';
import session from 'express-session'
import mongoose from 'mongoose';
import path from 'path';
import {engine} from "express-handlebars"
import passport from 'passport';
import cookieParser from 'cookie-parser';
import config from './config/config.js';

// IMPORTO FUNCIONES CREADAS POR MI
import initializePassport from './config/passport.config.js'
import {__dirname} from './utils.js';

import productsRouter from './router/products.routes.js';
import cartRouter from './router/carts.routes.js';
import viewsRouter from './router/views.routes.js';
import sessionsRouter from './router/sessions.router.js';
import businessRouter from './router/business.router.js';
import orderRouter from './router/order.router.js';
import { mockingProducts } from './controllers/products.controller.js';
import errorHandler from "./middlewares/errors/info.js";
import customError from './services/errors/CustomError.js';

const publics = path.join(__dirname, './public');

const app = express();

app.use(session({
    secret: config.secretOrKey,
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(publics));
app.use(express.json());
app.use(passport.session());
app.use(cookieParser());
initializePassport()
app.use(passport.initialize());
app.use(express.urlencoded({
    extended: true
}));
app.use((err, req, res, next) => {
    if(err instanceof customError) {
        console.error('Custom error:'+err.message);
        return res.status(400).json({
            status: 'error',
            message: err.message,
            code: err.code
        })
}
console.error('Unhandled error: '+ err);
res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor'
})
});


app.use('/api/products',productsRouter);
app.use('/api/carts',cartRouter);
app.use('/',viewsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/orders', orderRouter)
app.use('/api/business', businessRouter)
app.use('/api/mockingProducts', mockingProducts)

//Configuracion de handlebars
app.engine('handlebars', engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars');

app.listen(config.port, (err) => {
    if (err) {
        console.log("Connection error", err);
        return;
    }
    console.log("Server listening on port " + config.port);
})



export default app;