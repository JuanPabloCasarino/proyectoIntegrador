import express from 'express';
import router from "./router/productsRouter.js"
import path from 'path';
import __dirname from './utils.js';
import {engine} from "express-handlebars"

import productsCollection from './models/products.js';

const publics = path.join(__dirname, './public');

const app = express();

app.use(express.static(publics));

app.use(express.json());

app.use(express.urlencoded({ extended:true}));

app.use("/", router);

app.engine('handlebars', engine())

app.set('views',__dirname+'/views')

app.set('view engine','handlebars');

const PORT = process.env.PORT || 8080;

app.listen(PORT, (err) => {
    if(err){
        console.log("Connection error", err);
        return;
    }
    console.log("Server listening on port " + PORT);
})

// let products = productsCollection.insertMany([{
//     "title": "Torta de chocolate",
//     "description": "Sin azucar",
//     "price": 19.99,
//     "thumbnail": "path/to/image",
//     "code": "ABC123",
//     "stock": 10
// }, {
//     "title": "Torta de zanahoria",
//     "description": "Sin gluten",
//     "price": 23.99,
//     "thumbnail": "path/to/image2",
//     "code": "EFG456",
//     "stock": 13
// }, {
//     "title": "Torta de manzana",
//     "description": "Sin gluten",
//     "price": 27.99,
//     "thumbnail": "path/to/image3",
//     "code": "ZXC123",
//     "stock": 13
// },
// {
//     "title": "Torta de banana",
//     "description": "Sin azucar",
//     "price": 15.00,
//     "thumbnail": "path/to/image4",
//     "code": "VBN567",
//     "stock": 13
// }, 
// {
//     "title": "Torta de manzana",
//     "description": "Sin gluten",
//     "price": 30.99,
//     "thumbnail": "path/to/image5",
//     "code": "JKL789",
//     "stock": 15
// },
// {
//     "title": "Tarta capresse",
//     "description": "Sin gluten",
//     "price": 10.99,
//     "thumbnail": "path/to/image6",
//     "code": "TYU125",
//     "stock": 10
// },
// {
//     "title": "Refuerzo de membrilo",
//     "description": "Sin azucar",
//     "price": 30.99,
//     "thumbnail": "path/to/image7",
//     "code": "UIO135",
//     "stock": 15
// },
// {
//     "title": "Torta de manzana",
//     "description": "Vegano",
//     "price": 19.99,
//     "thumbnail": "path/to/image8",
//     "code": "ZXC125",
//     "stock": 15
// },
// {
//     "title": "Torta de limon",
//     "description": "Vegano",
//     "price": 23.99,
//     "thumbnail": "path/to/image9",
//     "code": "VBN757",
//     "stock": 15
// },
// {
//     "title": "Budin de espinaca",
//     "description": "Vegano",
//     "price": 15.99,
//     "thumbnail": "path/to/image10",
//     "code": "ÑLK098",
//     "stock": 15
// }
// ]
// )
export default app;