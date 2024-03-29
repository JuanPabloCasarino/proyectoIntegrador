import express from 'express';
import { getAllBusiness, getBusinessById, insertBusiness, addBusinessProduct } from '../controllers/business.controller.js';
const businessRouter = express.Router();


businessRouter.get('/', getAllBusiness);

businessRouter.get('/:id', getBusinessById);

businessRouter.post('/', insertBusiness);

businessRouter.post('/:id', addBusinessProduct);

export default businessRouter