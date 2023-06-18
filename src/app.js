import express from 'express';
import session from 'express-session'
import mongoose from 'mongoose';
import path from 'path';
import __dirname from './utils.js';
import {engine} from "express-handlebars"
import passport from 'passport';
import initializePassport from './config/passport.config.js'

import productsRouter from './router/products.routes.js';
import cartRouter from './router/carts.routes.js';
import viewsRouter from './router/views.routes.js';

const publics = path.join(__dirname, './public');

const app = express();

app.use(express.static(publics));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    /*
    store:MongoStore.create({
        mongoUrl:'mongodb+srv://juan21casarino:juan12345@ecommerce.lt4uvua.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: {useNewUrlParams:true},
        ttl:30
    }),
    */
    secret: 's3cr3t3',
    resave: false,
    saveUninitialized: false
}));
initializePassport()
app.use(passport.initialize());
app.use(passport.session());

app.use('/api',productsRouter);
app.use('/api',cartRouter);
app.use('/',viewsRouter);

app.engine('handlebars', engine())

app.set('views', __dirname + '/views')

app.set('view engine', 'handlebars');


const PORT = process.env.PORT || 8080;

app.listen(PORT, (err) => {
    if (err) {
        console.log("Connection error", err);
        return;
    }
    console.log("Server listening on port " + PORT);
})


export default app;