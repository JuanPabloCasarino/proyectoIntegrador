import express from 'express';
import session from 'express-session'
import router from "./router/products.routes.js"
import path from 'path';
import __dirname from './utils.js';
import {engine} from "express-handlebars"

import productsRouter from './router/products.routes.js';
import cartRouter from './router/carts.routes.js';

import productsCollection from './dao/models/product.model.js';
import cartsCollection from './dao/models/cart.model.js'

const publics = path.join(__dirname, './public');

const app = express();

app.use(express.static(publics));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use('/api',productsRouter);
app.use('/api',cartRouter);

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

//  let carts = cartsCollection.create({

//  })

export default app;