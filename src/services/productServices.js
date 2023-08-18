import ProductModel from '../dao/models/product.model.js';
import { mockingProducts } from '../controllers/products.controller.js';
import log from '../config/loggers/customLogger.js';

export class ProductServiceDB {
  // Llamamos todos los productos
  async getAllProducts(query, options) {
    const products = await ProductModel.paginate(query, options);
    return products;
  }

  // Llamamos un producto por su id
  async getProductById(id) {
    const productFind = await ProductModel.findOne({ _id: id });
    if (!productFind) return `No se encuentra el producto con el id ${id}`;
    return productFind;
  }

  // Agregamos un producto a nuestra base de datos
  async addProduct(product, email) {
    const { title, price, description, thumbnail, status, stock, code, category } = product;
    // Le agrego el owner al prod
    const createProd ={
      ...product,
      owner: email
    }
    const newProduct = await ProductModel.create(createProd);
    return newProduct;
  }

  // Actualizamos un producto
  async updateProduct(id, data) {
    const productUpdate = await ProductModel.updateOne({ _id: id }, data);
    return productUpdate;
  }

  // Eliminamos un producto
  async deleteProduct(id) {
    const productDelete = await ProductModel.deleteOne({ _id: id });

    return productDelete;
  }
  async updateStock(id, quantity){
    const product = await ProductModel.findOne({ _id: id });

    
  }
}
