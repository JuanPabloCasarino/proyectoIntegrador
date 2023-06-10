import express from 'express';
import session from "express-session"
import { Router, query } from 'express';
import { ProductManagerDB } from '../dao/managers/DB/ProductManager.db.js';
import mongoosePaginate from 'mongoose-paginate-v2';

const products = new ProductManagerDB();

const path = 'products';

const router = Router();

router.get(`/${path}`, async (req, res) => {
  const { limit, page, sort, category, status } = req.query;

  try {
    const options = {
      limit: limit || 10,
      page: page || 1,
      sort: {
        price: sort === 'asc' ? 1 : -1,
      },
      lean: true,
    };

    if (status != undefined) {
      const resProducts = await products.getAllProducts({ status: status }, options);
      return res.json({ resProducts });
    }

    if (category != undefined) {
      const resProducts = await products.getAllProducts({ category: category }, options);
      return res.json({ resProducts });
    }

    const result = await products.getAllProducts({}, options);
    // const { totalPages, docs, hasPrevPage, hasNextPage, prevPage, nextPage } = result;

    result.prevLink = await result.hasPrevPage ? `http://localhost:8080/${path}?page=${result.prevPage}` : '';
    result.nextLink = await result.hasNextPage ? `http://localhost:8080/${path}?page=${result.nextPage}` : '';
    result.isValid = !(page <= 0 || page > result.totalPages)
    res.render('products', result)
  } catch (error) {
    console.log(error);
  }
});

router.get(`/${path}/:id`, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await products.getProductById(id);
    res.render('singleProduct', result)
  } catch (error) {
    console.log(error);
  }
});

router.post(`/${path}`, async (req, res) => {
  const body = req.body;
  try {
    const resProducts = await products.addProduct(body);
    res.status(200).json(resProducts);
  } catch (error) {
    console.log(error);
  }
});

router.put(`/${path}/:id`, async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const resProducts = await products.updateProduct(id, body);
    res.status(200).json(resProducts);
  } catch (error) {
    console.log(error);
  }
});

router.delete(`/${path}/:id`, async (req, res) => {
  const { id } = req.params;
  try {
    const resProduct = await products.deleteProduct(id);
    res.status(200).json(resProduct);
  } catch (error) {
    console.log(error);
  }
});

router.use(express.json());
router.use(express.urlencoded({extended: true}))

export default router;
