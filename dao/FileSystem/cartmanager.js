import fs from 'fs';

class CartManager {
  constructor(path) {
    this.path = path;
  }

  addCart(cart) {
    const carts = this.getCart(); 
    carts.push(cart);
    this.saveCartToFile(carts);
  }


  getCart() {
    return this.getCartFromFile();
  }

  getCartById(id) {
    const carts = this.getCartFromFile();
    return carts.find((cart) => cart.id === id);
  }

  addProductToCart(cid, pid) {
    const carts = this.getCartFromFile();
    const cartIndex = carts.findIndex((cart) => cart.id === cid);

    if (cartIndex === -1) {
      console.error(`El carrito con ID ${cid} no existe`);
      return;
    }
    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex((product) => product.product === pid)
    if (productIndex === -1) {
      // Si el producto no existe en el carrito, lo agregamos como un nuevo objeto con quantity en 1
      cart.products.push({
        product: pid,
        quantity: 1
      });
    } else {
      // Si el producto ya existe en el carrito, incrementamos su cantidad en 1
      cart.products[productIndex].quantity++;
    }
    this.saveCartToFile(carts);
    console.log(`El producto con ID: ${pid} se agregó al carrito con ID: ${cid}`);
    return(carts);
  }

  getCartFromFile() {
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
    const cartsData = fs.readFileSync(this.path, 'utf-8');
    return JSON.parse(cartsData) || [];

  }

  saveCartToFile(cart) {
    fs.writeFileSync(this.path, JSON.stringify(cart));
  }
}

export default CartManager;