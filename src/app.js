import express from 'express';
import router from "./router/productsRouter.js"
import path from 'path';
import __dirname from './utils.js';
import {
    engine
} from "express-handlebars"

import productsCollection from './models/products.js';
import cartsCollection from './models/cart.js';

const publics = path.join(__dirname, './public');

const app = express();

app.use(express.static(publics));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use("/", router);

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

let carts = cartsCollection.insertMany([{
    "products": [{
        "productId": "1",
        "quantity": "2"
    }, {
        "productId": "2",
        "quantity": "1"
    }, {
        "productId": "10",
        "quantity": "1"
    }, {
        "productId": "5",
        "quantity": "1"
    }]
}])
/*, {
    "products": [{
        "productId": 5,
        "quantity": 3
    }]
}, {
    "products": [{
        "productId": 11,
        "quantity": 1
    }, {
        "productId": 5,
        "quantity": 1
    }, {
        "productId": 7,
        "quantity": 1
    }]
    
}])
*/

/*
 let products = productsCollection.insertMany([{
     "title": "Torta de chocolate",
     "category": "Sin azucar",
     "price": 19.99,
     "code": "ABC123",
     "stock": 10
 }, {
     "title": "Torta de zanahoria",
     "category": "Sin gluten",
     "price": 23.99,
     "code": "EFG456",
     "stock": 13
 }, {
     "title": "Torta de manzana",
     "category": "Sin gluten",
     "price": 27.99,
     "code": "ZXC123",
     "stock": 13
 },
 {
     "title": "Torta de banana",
     "category": "Sin azucar",
     "price": 15.00,
     "code": "VBN567",
     "stock": 13
 }, 
 {
     "title": "Torta de manzana",
     "category": "Sin gluten",
     "price": 30.99,
     "code": "JKL789",
     "stock": 15
 },
 {
     "title": "Tarta capresse",
     "category": "Sin gluten",
     "price": 10.99,
     "code": "TYU125",
     "stock": 10
 },
 {
     "title": "Refuerzo de membrilo",
     "category": "Sin azucar",
     "price": 30.99,
     "code": "UIO135",
     "stock": 15
 },
 {
     "title": "Torta de manzana",
     "category": "Vegano",
     "price": 19.99,
     "code": "ZXC125",
     "stock": 15
 },
 {
     "title": "Torta de limon",
     "category": "Vegano",
     "price": 23.99,
     "code": "VBN757",
     "stock": 15
 },
 {
     "title": "Budin de espinaca",
     "category": "Vegano",
    "price": 15.99,
     "code": "ÑLK098",
     "stock": 15
 }
 ]
 )
 */
export default app;