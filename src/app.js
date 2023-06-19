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
import sessionsRouter from './router/sessions.router.js';

const publics = path.join(__dirname, './public');

const app = express();

app.use(express.static(publics));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(session({
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
app.use('/api/sessions',sessionsRouter);

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

export const db = mongoose.connection;

db.on('error',console.error.bind(console,'Error to connect to MongoDB'));
db.once('open', () =>{
    console.log('Connection successful to MongoDB'); 
})

export default app;