import  express  from 'express';
import {Router} from 'express';
import studentsModel from '../models/students.js';

const router = Router();

router.use(express.json());
router.use(express.urlencoded({extended:true}))



export default router;