import ProductModel from '../../models/product.model.js';

export class ProductManagerDB {
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
  async addProduct(product) {
    const { title, price, description, thumbnail, status, stock, code, category } = product;

    const checkProductInfo = Object.values(product).includes(undefined);

    if (checkProductInfo) return 'Faltan propiedades al producto';

    const newProduct = await ProductModel.create(product);
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
}
