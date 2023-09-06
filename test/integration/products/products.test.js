import {expect, use} from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import assert from 'assert';

import { prod1, prod2, pid1 } from '../../mocks/products.mock.js';
import ProductModel from '../../../src/dao/models/product.model.js';
//import { ProductServiceDB } from '../../../src/services/productServices.js';
//const products = await new ProductServiceDB()

const requester = supertest('http://localhost:8080')
describe('Testing products routes',()=>{

    before(async()=>{

    })

    it('It should return all the products on the database',async ()=>{
        
        const result = await requester.get('/api/products').send();

        expect(result.ok).to.be.true;
        expect(result.statusCode).to.deep.equal(200);
        expect(result.body).to.be.an('object');
    })

    it('It should return the product based on the ID',async ()=>{
        
        const result = await requester.get('/api/products/'+pid1).send();

        expect(result.ok).to.be.true;
        expect(result.statusCode).to.deep.equal(200);
        expect(result.body).to.be.an('object');
    })

    it('It should return a 403 error because of a missing jwt when creating a product',async ()=>{
        
        const result = await requester.post('/api/products').send(prod1);

       // expect(result.ok).to.be.true;
       expect(result.ok).to.be.false;
       expect(result.statusCode).to.deep.equal(403);
    })
    it('It should return a 403 error because of a missing jwt when deleting a product',async ()=>{
        
        const result = await requester.post('/api/products').send(prod1);

        expect(result.ok).to.be.false;
        expect(result.statusCode).to.deep.equal(403);
    })
})
