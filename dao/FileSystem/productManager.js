import fs from 'fs';

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct(product) {
    const products = this.getProductsFromFile();
    const newProduct = {
      id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock
    };
    products.push(newProduct);
    this.saveProductsToFile(products);
    return newProduct;
  }

  getProducts() {
    return this.getProductsFromFile();
  }

  getProductById(id) {
    const products = this.getProductsFromFile();
    return products.find((product) => product.id === id);
  }

  updateProduct(id, updatedFields) {
    const products = this.getProductsFromFile();
    const productIndex = products.findIndex((product) => product.id === id);
    if (productIndex >= 0) {
      const updatedProduct = {
        ...products[productIndex],
        ...updatedFields
      };
      products[productIndex] = updatedProduct;
      this.saveProductsToFile(products);
      console.log("Product updated: " + updatedProduct.title);
      return updatedProduct;
    }
    return null;
  }

  deleteProduct(pid) {
    const products = this.getProductsFromFile();
    const product = products.findIndex((p) => p.id === pid);
    if (product !== -1) {
      products.splice(product, 1);
      this.saveProductsToFile(products);
      return products[pid];
    } else {
      return false;
    }
  }

  getProductsFromFile() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
    const productsData = fs.readFileSync(this.path, 'utf-8');
    return JSON.parse(productsData);
  }

  saveProductsToFile(products) {
    fs.writeFileSync(this.path, JSON.stringify(products));
  }
}

export default ProductManager;