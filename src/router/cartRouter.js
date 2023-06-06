import express from 'express';
import {
    Router
} from 'express';
import productsCollection from '../models/products.js';
import cartsCollection from '../models/cart.js';

const router = Router();


router.put('/api/carts/:cid', async (req, res) => {
    const cid = req.params.cid;

    try {
        const cart = await cartsCollection.find({_id: cid})
        if (!cart) {
          return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        
        // Actualizar el arreglo de productos del carrito con los nuevos productos 
        cart.products = productos;      
        res.status(200).json({ message: 'Carrito actualizado exitosamente' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocurrió un error al actualizar el carrito' });
      }
})

router.put('/api/carts/:cid/products/:pid', async (req, res) => {
    const pid = await req.params.pid;
    const cid = await req.params.cid;
    const { pQuantity } = req.body;
    
    try {
        const cart = await cartsCollection.find({_id: cid})
        const product = await productsCollection.find({_id: pid})
        if (!cart) {
          return res.status(404).json({ message: 'Carrito no encontrado' });
        }     
        if (!product) {
          return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }
        
        // Actualizar la cantidad del producto 'pid' con la cantidad 
        product.quantity = pQuantity;
        
        res.status(200).json({ message: 'Cantidad de producto actualizada exitosamente' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocurrió un error al actualizar la cantidad del producto' });
      }
})

router.delete('/api/carts/:cid/products/:pid', async (req, res) => {
    const pid = await req.params.pid;
    const cid = await req.params.cid;


    try {
        const product = await productsCollection.find({_id: pid})
        const cart = await cartsCollection.find({_id: cid})
        if (!cart) {
            return res.status(404).json({
                message: 'Carrito no encontrado'
            });
        }
        cart.products.pull({_id: pid});
        res.status(200).json({message: 'Producto eliminado del carrito exitosamente'});
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ocurrió un error al eliminar el producto del carrito'
        });
    }

})

router.delete('/api/carts/:cid', async (req, res) => {
    const  cid  = await req.params.cid;
  
    try {
    const cart = await cartsCollection.find({_id: cid})
      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
  
      // Eliminar todos los productos del carrito
      cart.products = []; 
      
      res.status(200).json({ message: 'Todos los productos del carrito han sido eliminados exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ocurrió un error al eliminar los productos del carrito' });
    }
  });
  

export default router;